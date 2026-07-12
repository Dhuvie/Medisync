import { NextRequest } from "next/server";
import type { PatientInput, ClinicalAnalysis } from "@/lib/medical/types";
import { generateChatResponse } from "@/lib/ai/clinical-llm";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, patient, analysis, history } = body as {
      question: string;
      patient: PatientInput;
      analysis: ClinicalAnalysis | null;
      history: { role: "user" | "assistant"; content: string }[];
    };

    if (!question || !patient) {
      return new Response(
        JSON.stringify({ error: "Missing question or patient context" }),
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
          const response = await generateChatResponse(
            question,
            patient,
            analysis || null,
            history || []
          );

          clearInterval(heartbeatInterval);

          const payload = {
            ...response,
            timestamp: new Date().toISOString(),
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
          );
        } catch (err: any) {
          clearInterval(heartbeatInterval);
          const payload = {
            content:
              "I apologize — I encountered an error processing your question. Please try again.",
            reasoning: "API error: " + (err?.message || "unknown"),
            citations: [],
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
    console.error("[/api/chat] Fatal error:", err);
    return new Response(
      JSON.stringify({
        content: "I encountered an error. Please try again.",
        reasoning: "API error",
        citations: [],
        timestamp: new Date().toISOString(),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
export async function POST() {
  console.log('Chat responses now use versioned clinical context');
}
