import type { PatientInput, DifferentialDiagnosis, ClinicalAnalysis } from "@/lib/medical/types";
import { DISEASES, KNOWLEDGE_CORPUS, ICD10_CODES } from "@/lib/medical/knowledge";

const LLM_TIMEOUT_MS = 110_000;

async function llmCallWithTimeout(
  messages: { role: "assistant" | "user"; content: string }[],
  temperature = 0.3
): Promise<string | null> {
  try {
    const apiKey = process.env.ZAI_API_KEY;
    const baseUrl = process.env.ZAI_BASE_URL || "https://api.z.ai/api/paas/v4";

    if (!apiKey) {
      throw new Error("Missing ZAI_API_KEY environment variable");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "glm-4.5-flash",
        messages,
        thinking: { type: "disabled" },
        temperature,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err: any) {
    console.error("[llmCallWithTimeout] error:", err?.message || err);
    return null;
  }
}

function normalizePercent(value: any, minVal = 5): number {
  const n = Number(value);
  if (isNaN(n)) return minVal;

  let pct = n <= 1 && n > 0 ? n * 100 : n;

  return Math.min(98, Math.max(minVal, Math.round(pct)));
}

export function buildPatientContext(patient: PatientInput): string {
  const v = patient.vitals;
  const l = patient.labs;
  return `PATIENT: ${patient.name}, ${patient.age}y ${patient.gender}${patient.pregnant ? " (pregnant)" : ""}
SYMPTOMS: ${patient.symptoms.join(", ") || "none"} (duration: ${patient.symptomDuration}, severity: ${patient.severity}, pain ${v.painScore}/10)
VITALS: HR ${v.heartRate}, BP ${v.systolicBP}/${v.diastolicBP}, T ${v.temperature}°C, RR ${v.respiratoryRate}, SpO2 ${v.spo2}%, glucose ${v.bloodGlucose}, BMI ${(v.weightKg / Math.pow(v.heightCm / 100, 2)).toFixed(1)}
LABS: Hgb ${l.hemoglobin}, WBC ${l.whiteBloodCells}, Plt ${l.platelets}, Na ${l.sodium}, K ${l.potassium}, Cr ${l.creatinine}, BUN ${l.bun}, glucose ${l.glucose}, ALT ${l.alt}, AST ${l.ast}, troponin ${l.troponin}, CRP ${l.crp}, ESR ${l.esr}, INR ${l.inr}, HbA1c ${l.hemoglobinA1c}%
HISTORY: ${patient.medicalHistory.join(", ") || "none"}
MEDS: ${patient.currentMedications.join(", ") || "none"}
ALLERGIES: ${patient.allergies.join(", ") || "NKA"}
RISK FACTORS: ${patient.riskFactors.join(", ") || "none"}
LIFESTYLE: smoking ${patient.lifestyle.smoking ? "Y" : "N"}, alcohol ${patient.lifestyle.alcohol}, exercise ${patient.lifestyle.exercise}
${patient.notes ? `NOTES: ${patient.notes}` : ""}`;
}

export interface LLMDifferential {
  disease: string;
  icd10: string;
  probability: number;
  confidence: number;
  reasoning: string;
  keyEvidence: string[];
  redFlags: string[];
  recommendedTests: string[];
}

export async function generateClinicalReasoning(patient: PatientInput): Promise<{
  differentials: LLMDifferential[];
  narrative: string;
  partial: boolean;
}> {
  const patientContext = buildPatientContext(patient);

  const [differentialsResult, narrativeResult] = await Promise.all([
    generateDifferentialsWithRetry(patientContext),
    generateNarrative(patientContext, patient),
  ]);

  return {
    differentials: differentialsResult || [],
    narrative: narrativeResult || "",
    partial: !differentialsResult || !narrativeResult,
  };
}

async function generateDifferentialsWithRetry(patientContext: string): Promise<LLMDifferential[] | null> {
  for (let attempt = 1; attempt <= 2; attempt++) {
    const result = await generateDifferentials(patientContext);
    if (result && result.length > 0) return result;
    console.warn(`[generateDifferentials] attempt ${attempt} failed, ${attempt < 2 ? "retrying..." : "giving up"}`);
  }
  return null;
}

async function generateDifferentials(patientContext: string): Promise<LLMDifferential[] | null> {
  const systemPrompt = `You are MediSync AI, an expert clinical decision support system. Generate a focused differential diagnosis as JSON only.

Respond with valid JSON (no markdown, no prose) using this exact schema:
{"differentials":[{"disease":"string","icd10":"string","probability":number,"confidence":number,"reasoning":"1-2 sentences","keyEvidence":["3-4 factors"],"redFlags":["2-3 flags"],"recommendedTests":["2-3 tests"]}]}

Rules:
- Return exactly 4-5 differentials ranked by probability (highest first)
- probability and confidence are numbers 0-100 (NOT 0-1 fractions)
- Top differential: 40-80% probability with 70-90% confidence
- Be concise. Reasoning: 1-2 sentences only.
- Use real ICD-10 codes (e.g. I21.9, J18.9, A41.9, I63.9, E11.9)
- keyEvidence: 3-4 short factors specific to THIS patient
- redFlags: 2-3 critical features to exclude
- Output ONLY the JSON object, nothing else`;

  const userPrompt = `Analyze and return JSON differentials:\n\n${patientContext}`;

  const raw = await llmCallWithTimeout([
    { role: "assistant", content: systemPrompt },
    { role: "user", content: userPrompt },
  ], 0.3);

  if (!raw) {
    console.warn("[generateDifferentials] LLM returned null/empty response");
    return null;
  }

  const parsed = parseJSONResponse(raw);
  if (!parsed?.differentials || !Array.isArray(parsed.differentials)) {
    console.warn("[generateDifferentials] Failed to parse JSON after repair. Raw length:", raw.length);
    console.warn("[generateDifferentials] RAW RESPONSE WAS:", raw);
    return null;
  }

  return parsed.differentials.slice(0, 6);
}

async function generateNarrative(patientContext: string, patient: PatientInput): Promise<string | null> {
  const systemPrompt = `You are MediSync AI. Write a concise 2-3 paragraph clinical reasoning narrative for this patient. Reference relevant guidelines (ACC/AHA, ESC, ATS/IDSA, ADA, KDIGO, AHA/ASA, SSC). Plain text only, no markdown headers.`;

  const userPrompt = `Write a 2-3 paragraph clinical narrative summarizing the most likely diagnosis, key evidence, alternative considerations, and recommended next steps. Be specific to this patient's values.\n\n${patientContext}`;

  const raw = await llmCallWithTimeout([
    { role: "assistant", content: systemPrompt },
    { role: "user", content: userPrompt },
  ], 0.4);

  return raw;
}

export interface ChatResponse {
  content: string;
  reasoning: string;
  citations: { source: string; snippet: string }[];
}

export async function generateChatResponse(
  question: string,
  patient: PatientInput,
  analysis: ClinicalAnalysis | null,
  conversationHistory: { role: "user" | "assistant"; content: string }[]
): Promise<ChatResponse> {
  const patientContext = buildPatientContext(patient);

  const topDDx = analysis?.differentials[0];
  const analysisSummary = analysis
    ? `AI ANALYSIS: Top differential: ${topDDx?.disease || "—"} (${topDDx?.probability || 0}% probability). Triage: ${analysis.triage.level.toUpperCase()} (score ${analysis.triage.score}/100). Disposition: ${analysis.triage.disposition} within ${analysis.triage.timeFrame}. Critical findings: ${analysis.triage.criticalFindings.join("; ") || "None"}.`
    : "No AI analysis available.";

  const guidelinesContext = KNOWLEDGE_CORPUS
    .map((k, i) => `[${i + 1}] ${k.source} (${k.year}) — Evidence Level ${k.evidenceLevel}\n${k.content}`)
    .join("\n\n");

  const systemPrompt = `You are MediSync AI Assistant, an expert clinical reasoning partner. You assist Dr. Reyes.

Rules:
- Reference the patient's actual clinical data
- Apply evidence-based medicine and current guidelines
- Cite specific guidelines by name and year (ACC/AHA, ESC, ATS/IDSA, ADA, KDIGO, AHA/ASA, SSC)
- Be concise but complete (3-6 short paragraphs max)
- Use **bold** for key terms
- Be honest about uncertainty
- You are decision support, NOT a replacement for clinical judgment
- Never fabricate guidelines or studies

${patientContext}

${analysisSummary}

REFERENCE GUIDELINES:
${guidelinesContext}

End your response with:
REASONING: <1-2 sentences on how you arrived at the answer>
SOURCES:
- <source name and year>
- <source name and year>`;

  const messages: { role: "assistant" | "user"; content: string }[] = [
    { role: "assistant", content: systemPrompt },
    ...conversationHistory.slice(-4).map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: question },
  ];

  const raw = await llmCallWithTimeout(messages, 0.4);

  if (!raw) {
    return {
      content: "I apologize — the AI service timed out or encountered an error. Please try your question again. The clinical reasoning engine is still available via the AI Clinical Reasoning tab.",
      reasoning: "LLM call failed or timed out",
      citations: [],
    };
  }

  const { content, reasoning, citations } = parseChatResponse(raw);
  return { content, reasoning, citations };
}

function parseChatResponse(raw: string): { content: string; reasoning: string; citations: { source: string; snippet: string }[] } {
  let content = raw;
  let reasoning = "";
  const citations: { source: string; snippet: string }[] = [];

  const reasoningMatch = raw.match(/(?:^|\n)REASONING:?\s*(.+?)(?=\n\s*SOURCES?:|\n$|$)/is);
  if (reasoningMatch) {
    reasoning = reasoningMatch[1].trim();
    content = raw.replace(/(?:^|\n)REASONING:?\s*.+?(?=\n\s*SOURCES?:|\n$|$)/is, "").trim();
  }

  const sourcesMatch = content.match(/(?:^|\n)SOURCES?:?\s*(.+?)$/is);
  if (sourcesMatch) {
    const sourcesText = sourcesMatch[1].trim();
    content = content.replace(/(?:^|\n)SOURCES?:?\s*.+?$/is, "").trim();

    const sourceLines = sourcesText.split(/\n[-•*\d\.\)]*\s*/).filter(s => s.trim());
    for (const line of sourceLines.slice(0, 3)) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const matched = KNOWLEDGE_CORPUS.find(k =>
        trimmed.toLowerCase().includes(k.source.toLowerCase().split(/[\/\s]/)[0]) ||
        k.source.toLowerCase().includes(trimmed.toLowerCase().split(/[\/\s(]/)[0])
      );
      if (matched) {
        citations.push({
          source: `${matched.source} (${matched.year})`,
          snippet: matched.content.slice(0, 220) + (matched.content.length > 220 ? "..." : ""),
        });
      } else {
        citations.push({ source: trimmed, snippet: "Referenced in clinical literature" });
      }
    }
  }

  return { content, reasoning, citations };
}

export async function generateSOAPNote(
  patient: PatientInput,
  analysis: ClinicalAnalysis | null,
  llmDifferentials?: LLMDifferential[]
): Promise<{
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
} | null> {
  const patientContext = buildPatientContext(patient);

  const analysisSummary = analysis
    ? `AI ANALYSIS: Top differential: ${analysis.differentials[0]?.disease || "—"} (${analysis.differentials[0]?.probability || 0}%). Triage: ${analysis.triage.level.toUpperCase()}. Critical findings: ${analysis.triage.criticalFindings.join("; ") || "None"}.`
    : "";

  const llmDDxContext = llmDifferentials && llmDifferentials.length > 0
    ? `\nDIFFERENTIALS:\n${llmDifferentials.map((d, i) => `${i + 1}. ${d.disease} (${d.probability}%, ICD-10 ${d.icd10})`).join("\n")}`
    : "";

  const systemPrompt = `You are MediSync AI Documentation Assistant. Generate a concise SOAP note as JSON only.

Schema:
{"subjective":"3-4 sentences: chief complaint, HPI, PMH, meds, allergies, social","objective":"3-4 sentences: vitals, labs, exam. Use specific values.","assessment":"2-3 sentences: diagnostic impression, leading differential with ICD-10","plan":"5-7 numbered items: workup, therapeutics, monitoring, disposition, follow-up"}

Be specific to this patient. JSON only, no markdown.

${patientContext}

${analysisSummary}
${llmDDxContext}`;

  const raw = await llmCallWithTimeout([
    { role: "assistant", content: systemPrompt },
    { role: "user", content: "Generate the SOAP note JSON now." },
  ], 0.3);

  if (!raw) return null;

  const parsed = parseJSONResponse(raw);
  if (!parsed?.subjective) return null;
  return parsed;
}

function parseJSONResponse(raw: string): any | null {
  let cleaned = raw.trim();

  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]+?)```/i);
  if (codeBlockMatch) {
    cleaned = codeBlockMatch[1].trim();
  } else {
    const openBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]+)/i);
    if (openBlockMatch) {
      cleaned = openBlockMatch[1].trim();
    }
  }

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  try { return JSON.parse(cleaned); } catch {}

  const repaired = repairLLMJSON(cleaned);
  try { return JSON.parse(repaired); } catch {}

  const noTrailingCommas = repaired.replace(/,(\s*[}\]])/g, "$1");
  try { return JSON.parse(noTrailingCommas); } catch {}

  return null;
}

function repairLLMJSON(json: string): string {
  let repaired = json;

  repaired = repaired.replace(/"(\w+)\[/g, '"$1":[');
  repaired = repaired.replace(/"(\w+)\{/g, '"$1":{');

  repaired = repaired.replace(/"(\w+)"(\s*)([\[\{])/g, '"$1"$2:$3');

  repaired = repaired.replace(/\}(\s*)\{/g, "},$1{");

  repaired = repaired.replace(/\](\s*)\[/g, "],$1[");

  repaired = repaired.replace(/'/g, '"');

  repaired = repaired.replace(/,(\s*[}\]])/g, "$1");

  return repaired;
}

export function mapLLMToDifferentials(
  llmDDx: LLMDifferential[],
  patient: PatientInput
): DifferentialDiagnosis[] {
  return llmDDx.map((d, i) => {
    const diseaseRecord = DISEASES.find(db => db.name === d.disease || db.name.includes(d.disease) || d.disease.includes(db.name));

    return {
      id: `llm-ddx-${i}`,
      disease: d.disease,
      icd10: d.icd10 || diseaseRecord?.icd10 || "R69",

      probability: normalizePercent(d.probability),
      confidence: normalizePercent(d.confidence, 50),
      severity: diseaseRecord ? determineSeverity(diseaseRecord, patient) : "moderate",
      likelihood: d.probability >= 70 ? "very likely" : d.probability >= 45 ? "likely" : d.probability >= 25 ? "possible" : "unlikely",
      bodySystem: diseaseRecord?.bodySystem || "Multi-system",
      evidence: d.keyEvidence.slice(0, 6).map((factor, idx) => ({
        factor,
        weight: idx === 0 ? 0.85 : 0.7 - idx * 0.08,
        source: "LLM clinical reasoning",
      })),
      reasoning: d.reasoning,
      redFlags: d.redFlags.length > 0 ? d.redFlags : (diseaseRecord?.redFlags || []),
      prerequisitesMet: true,
    };
  }).sort((a, b) => b.probability - a.probability);
}

function determineSeverity(disease: typeof DISEASES[0], patient: PatientInput): DifferentialDiagnosis["severity"] {
  if (disease.redFlags.some(rf => rf.toLowerCase().includes("shock") || rf.toLowerCase().includes("unstable"))) {
    return "life-threatening";
  }
  if (patient.vitals.spo2 < 90 || patient.vitals.systolicBP < 90) return "life-threatening";
  if (patient.severity === "severe") return "severe";
  if (patient.vitals.temperature >= 39 || patient.vitals.heartRate > 120) return "severe";
  return "moderate";
}
