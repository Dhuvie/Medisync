"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Copy, DollarSign, Tag, Sparkles, Loader2 } from "lucide-react";
import { useMediSync } from "../store";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function SoapView() {
  const { analysis, patient, soapNote, isGeneratingSOAP, generateSOAP } = useMediSync();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (analysis && !soapNote && !isGeneratingSOAP) {
      generateSOAP();
    }
  }, [analysis, soapNote, isGeneratingSOAP, generateSOAP]);

  if (!analysis) return <Card className="glass p-12 text-center text-white/60">No analysis available.</Card>;

  const soap = soapNote || analysis.soapNote;

  const copyToClipboard = () => {
    const text = `SOAP NOTE — ${patient.name} (${patient.id})
Generated: ${new Date().toLocaleString()}

S (Subjective):
${soap.subjective}

O (Objective):
${soap.objective}

A (Assessment):
${soap.assessment}

P (Plan):
${soap.plan}

ICD-10 Codes:
${analysis.soapNote.icd10Codes.map(c => `${c.code} — ${c.description}`).join("\n")}

CPT Codes:
${analysis.soapNote.cptCodes.map(c => `${c.code} — ${c.description} (${c.rvu} RVU)`).join("\n")}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("SOAP note copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadNote = () => {
    const text = `SOAP NOTE — ${patient.name} (${patient.id})
Generated: ${new Date().toLocaleString()}

S (Subjective):
${soap.subjective}

O (Objective):
${soap.objective}

A (Assessment):
${soap.assessment}

P (Plan):
${soap.plan}

ICD-10 Codes:
${analysis.soapNote.icd10Codes.map(c => `${c.code} — ${c.description}`).join("\n")}

CPT Codes:
${analysis.soapNote.cptCodes.map(c => `${c.code} — ${c.description} (${c.rvu} RVU)`).join("\n")}
`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SOAP_${patient.name.replace(/\s/g, "_")}_${patient.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("SOAP note downloaded");
  };

  const totalRVU = analysis.soapNote.cptCodes.reduce((sum, c) => sum + c.rvu, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">AI-Generated Clinical Documentation</h1>
          <p className="mt-1 text-sm text-white/50">
            Real LLM-generated SOAP note · ICD-10 coding · CPT billing · FHIR R4 export
          </p>
        </div>
        <div className="flex gap-2 items-center">
          {isGeneratingSOAP && (
            <Badge className="border-amber-600/30 bg-amber-600/10 text-amber-300 gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              LLM generating...
            </Badge>
          )}
          {soapNote && !isGeneratingSOAP && (
            <Badge className="border-orange-500/30 bg-orange-500/10 text-lime-300 gap-1">
              <Sparkles className="h-3 w-3" />
              LLM-generated
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-2 border-white/10 bg-white/5" disabled={isGeneratingSOAP}>
            <Copy className="h-3.5 w-3.5" /> {copied ? "Copied!" : "Copy"}
          </Button>
          <Button size="sm" onClick={downloadNote} className="gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white" disabled={isGeneratingSOAP}>
            <Download className="h-3.5 w-3.5" /> Download
          </Button>
        </div>
      </div>

      {}
      {isGeneratingSOAP && !soapNote && (
        <Card className="glass p-12">
          <div className="mx-auto max-w-md text-center">
            <div className="relative mx-auto h-16 w-16">
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-amber-600"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <FileText className="absolute inset-0 m-auto h-7 w-7 text-white" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">Generating Clinical Documentation</h3>
            <p className="mt-1 text-sm text-white/50">Real LLM composing SOAP note from patient data + analysis</p>
            <div className="mt-4 space-y-2 text-left">
              {["Reading patient context...", "Synthesizing assessment...", "Formulating plan...", "Generating JSON..."].map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.3 }}
                  className="flex items-center gap-2 text-xs text-white/60"
                >
                  <Loader2 className="h-3 w-3 animate-spin text-amber-300" />
                  <span>{s}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {}
      {(!isGeneratingSOAP || soapNote) && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {}
          <Card className="glass">
            <div className="border-b border-white/5 p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-600/20 text-amber-300 font-bold text-sm">S</span>
                <h3 className="text-sm font-semibold text-white">Subjective</h3>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm leading-relaxed text-white/80 whitespace-pre-line">{soap.subjective}</p>
            </div>
          </Card>

          {}
          <Card className="glass">
            <div className="border-b border-white/5 p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-500/20 text-orange-300 font-bold text-sm">O</span>
                <h3 className="text-sm font-semibold text-white">Objective</h3>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm leading-relaxed text-white/80 whitespace-pre-line">{soap.objective}</p>
            </div>
          </Card>

          {}
          <Card className="glass">
            <div className="border-b border-white/5 p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/20 text-amber-300 font-bold text-sm">A</span>
                <h3 className="text-sm font-semibold text-white">Assessment</h3>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm leading-relaxed text-white/80 whitespace-pre-line">{soap.assessment}</p>
            </div>
          </Card>

          {}
          <Card className="glass">
            <div className="border-b border-white/5 p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-500/20 text-lime-300 font-bold text-sm">P</span>
                <h3 className="text-sm font-semibold text-white">Plan</h3>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm leading-relaxed text-white/80 whitespace-pre-line">{soap.plan}</p>
            </div>
          </Card>
        </div>
      )}

      {}
      <Card className="glass">
        <div className="border-b border-white/5 p-4">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-amber-300" />
            <h3 className="text-sm font-semibold text-white">Automatic ICD-10 Coding</h3>
            <Badge variant="outline" className="ml-auto border-amber-600/30 text-amber-300">{analysis.soapNote.icd10Codes.length} codes</Badge>
          </div>
        </div>
        <div className="p-4 space-y-2">
          {analysis.soapNote.icd10Codes.map((code, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg bg-white/[0.03] p-3 hover:bg-white/[0.05]">
              <Badge className="bg-amber-600/15 text-amber-300 border border-amber-600/30 font-mono">
                {code.code}
              </Badge>
              <span className="text-sm text-white/80">{code.description}</span>
              <Badge variant="outline" className="ml-auto border-orange-500/30 text-lime-300 text-[10px]">Auto-coded</Badge>
            </div>
          ))}
        </div>
      </Card>

      {}
      <Card className="glass">
        <div className="border-b border-white/5 p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-lime-300" />
            <h3 className="text-sm font-semibold text-white">CPT Code Suggestions (Billing)</h3>
            <Badge variant="outline" className="ml-auto border-orange-500/30 text-lime-300">{analysis.soapNote.cptCodes.length} codes · {totalRVU.toFixed(2)} total RVU</Badge>
          </div>
        </div>
        <div className="p-4 space-y-2">
          {analysis.soapNote.cptCodes.map((code, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg bg-white/[0.03] p-3 hover:bg-white/[0.05]">
              <Badge className="bg-orange-500/15 text-lime-300 border border-orange-500/30 font-mono">
                {code.code}
              </Badge>
              <span className="text-sm text-white/80 flex-1">{code.description}</span>
              <span className="text-xs text-white/40 font-mono">{code.rvu} RVU</span>
              <Badge variant="outline" className="border-white/10 text-white/60 text-[10px]">Suggested</Badge>
            </div>
          ))}
        </div>
      </Card>

      {}
      <Card className="glass">
        <div className="border-b border-white/5 p-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-sky-300" />
            <h3 className="text-sm font-semibold text-white">HL7 / FHIR Interoperability</h3>
            <Badge variant="outline" className="ml-auto border-sky-500/30 text-sky-300">FHIR R4</Badge>
          </div>
        </div>
        <div className="p-4">
          <pre className="rounded-lg bg-black/30 p-4 text-[11px] font-mono text-emerald-200/80 overflow-x-auto scrollbar-thin">
{`{
  "resourceType": "DiagnosticReport",
  "status": "preliminary",
  "category": [{
    "coding": [{ "system": "http://hl7.org/fhir/ValueSet/diagnostic-service-sections", "code": "MED" }]
  }],
  "code": { "coding": [{ "system": "http://hl7.org/fhir/sid/icd-10", "code": "${analysis.soapNote.icd10Codes[0]?.code || "R69"}" }] },
  "subject": { "reference": "Patient/${patient.id}", "display": "${patient.name}" },
  "effectiveDateTime": "${new Date().toISOString()}",
  "performer": [{ "display": "Dr. Reyes (MediSync AI-assisted)" }],
  "conclusion": "${analysis.differentials[0]?.disease || "Diagnostic evaluation"} (${analysis.differentials[0]?.probability || 0}% probability)",
  "conclusionCode": [{ "coding": [{ "system": "http://hl7.org/fhir/sid/icd-10", "code": "${analysis.soapNote.icd10Codes[0]?.code || ""}" }] }]
}`}
          </pre>
        </div>
      </Card>
    </div>
  );
}
