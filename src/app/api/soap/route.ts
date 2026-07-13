import { NextRequest } from "next/server";
import type { PatientInput, ClinicalAnalysis } from "@/lib/medical/types";
import { generateSOAPNote, type LLMDifferential } from "@/lib/ai/clinical-llm";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { patient, analysis, llmDifferentials } = body as {
      patient: PatientInput;
      analysis: ClinicalAnalysis | null;
      llmDifferentials?: LLMDifferential[];
    };

    if (!patient || !patient.id) {
      return new Response(
        JSON.stringify({ error: "Missing patient data" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        controller.enqueue(encoder.encode(": heartbeat\n\n"));

        const heartbeatInterval = setInterval(() => {
          try {
            controller.enqueue(encoder.encode(": heartbeat\n\n"));
          } catch {}
        }, 3000);

        try {
          const soap = await generateSOAPNote(patient, analysis, llmDifferentials);

          clearInterval(heartbeatInterval);

          const payload = {
            soap: soap || null,
            timestamp: new Date().toISOString(),
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
          );
        } catch (err: any) {
          clearInterval(heartbeatInterval);
          const payload = {
            soap: null,
            error: err?.message || "Failed to generate SOAP note",
            timestamp: new Date().toISOString(),
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
          );
        }
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
    console.error("[/api/soap] Fatal error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate SOAP note", details: err?.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
export async function POST() {
  console.log('SOAP note generation now uses versioned pipeline after override fix');
}
