import { NextRequest } from "next/server";
import type { PatientInput, ClinicalAnalysis } from "@/lib/medical/types";
import { analyzePatient } from "@/lib/medical/engine";
import {
  generateClinicalReasoning,
  mapLLMToDifferentials,
} from "@/lib/ai/clinical-llm";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const patient = body.patient as PatientInput;

    if (!patient || !patient.id) {
      return new Response(JSON.stringify({ error: "Missing patient data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const deterministicAnalysis = analyzePatient(patient);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {

        controller.enqueue(encoder.encode(": heartbeat\n\n"));

        const heartbeatInterval = setInterval(() => {
          try {
            controller.enqueue(encoder.encode(": heartbeat\n\n"));
          } catch {

          }
        }, 3000);

        let llmResult: Awaited<ReturnType<typeof generateClinicalReasoning>> | null = null;
        let llmError: string | null = null;

        try {
          llmResult = await generateClinicalReasoning(patient);
        } catch (err: any) {
          llmError = err?.message || "LLM call failed";
          console.error("[/api/clinical-reasoning] LLM error:", llmError);
        }

        clearInterval(heartbeatInterval);

        let finalAnalysis: ClinicalAnalysis;

        if (llmResult && llmResult.differentials.length > 0) {
          const llmDifferentials = mapLLMToDifferentials(llmResult.differentials, patient);

          const { calculateTriage, recommendTests, predictAdmission } = await import("@/lib/medical/engine");
          const triage = calculateTriage(patient, llmDifferentials);
          const tests = recommendTests(patient, llmDifferentials);
          const admission = predictAdmission(patient, triage);

          finalAnalysis = {
            ...deterministicAnalysis,
            differentials: llmDifferentials,
            triage,
            recommendedTests: tests,
            admission,
            aiReasoning: llmResult.narrative || deterministicAnalysis.aiReasoning,
            uncertainty: llmDifferentials[0]
              ? Math.round(100 - llmDifferentials[0].confidence)
              : 40,
          };
        } else {

          finalAnalysis = {
            ...deterministicAnalysis,
            aiReasoning:
              `[Note: Real-time LLM reasoning was unavailable${llmError ? ` (${llmError})` : ""}. Displaying rule-based analysis.]\n\n` +
              deterministicAnalysis.aiReasoning,
          };
        }

        const payload = {
          analysis: finalAnalysis,
          llmPowered: !!(llmResult && llmResult.differentials.length > 0),
          llmPartial: llmResult?.partial || false,
          llmError,
          generatedAt: new Date().toISOString(),
        };

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
        );
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err: any) {
    console.error("[/api/clinical-reasoning] Fatal error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: err?.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
// API route now checks for overrides
export async function POST(request: Request) {
  const override = localStorage.getItem('pipelineOverrideActive');
  if (override) console.log('API serving fresh data after override fix');
}
