"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Sparkles, Brain, Quote, User, Zap } from "lucide-react";
import { useMediSync } from "../store";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const SUGGESTED_QUESTIONS = [
  "What supports the leading diagnosis?",
  "Why was an ECG recommended?",
  "What are the red flags for this patient?",
  "What's the latest guideline for this condition?",
  "Could this be a pulmonary embolism instead?",
  "What treatments should I consider?",
];

export function ChatView() {
  const {
    analysis,
    patient,
    chatMessages,
    isChatThinking,
    sendChatMessage,
  } = useMediSync();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatMessages.length === 0 && analysis) {
      const top = analysis.differentials[0];
      const initMsg = {
        id: "init",
        role: "assistant" as const,
        content: `Hello Dr. Reyes. I've analyzed ${patient.name}'s case in real-time using the GLM-4 clinical LLM. The leading differential is **${top?.disease || "—"}** (${top?.probability || 0}% probability, ${top?.confidence || 0}% confidence). Triage level: **${analysis.triage.level.toUpperCase()}** with disposition ${analysis.triage.disposition}.\n\nAsk me anything about the diagnosis, recommended tests, evidence, or guidelines — I'll reference the patient's actual data and current medical literature.`,
        timestamp: new Date().toISOString(),
      };
      useMediSync.setState({ chatMessages: [initMsg] });
    }
  }, [analysis, patient, chatMessages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chatMessages, isChatThinking]);

  const sendMessage = (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || isChatThinking) return;
    sendChatMessage(msg);
    setInput("");
  };

  return (
    <div className="space-y-6 h-[calc(100vh-7rem)] flex flex-col">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">AI Clinical Assistant</h1>
        <p className="mt-1 text-sm text-white/50">
          Real-time LLM (GLM-4) · Patient-specific reasoning · RAG with 8 guideline sources · Live medical citations
        </p>
      </div>

      <Card className="glass flex-1 flex flex-col overflow-hidden">
        {}
        <div className="border-b border-white/5 p-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-amber-300" />
            <h3 className="text-sm font-semibold text-white">Clinical Conversation</h3>
            <Badge variant="outline" className="ml-auto border-amber-600/30 text-amber-300 gap-1">
              <Zap className="h-3 w-3" />
              Real LLM
            </Badge>
          </div>
        </div>

        {}
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          {chatMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-3", msg.role === "user" && "flex-row-reverse")}
            >
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                msg.role === "user"
                  ? "bg-gradient-to-br from-amber-600 to-orange-500 text-white"
                  : "bg-gradient-to-br from-amber-600/30 to-orange-500/30 text-amber-300 ring-1 ring-amber-600/30"
              )}>
                {msg.role === "user" ? <User className="h-4 w-4" /> : <Brain className="h-4 w-4" />}
              </div>
              <div className={cn("flex-1 min-w-0 max-w-[80%]", msg.role === "user" && "flex justify-end")}>
                <div className={cn(
                  "rounded-2xl px-4 py-3 text-sm",
                  msg.role === "user"
                    ? "bg-amber-600/15 text-white ring-1 ring-amber-600/20"
                    : "bg-white/[0.03] text-white/90 ring-1 ring-white/5"
                )}>
                  <div className="whitespace-pre-wrap leading-relaxed">{formatMessage(msg.content)}</div>

                  {}
                  {msg.reasoning && (
                    <div className="mt-3 rounded-lg bg-amber-600/5 p-2 ring-1 ring-amber-600/10">
                      <p className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-amber-300 mb-1">
                        <Sparkles className="h-2.5 w-2.5" />
                        LLM Reasoning Trace
                      </p>
                      <p className="text-[11px] text-white/60">{msg.reasoning}</p>
                    </div>
                  )}

                  {}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      <p className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/40">
                        <Quote className="h-2.5 w-2.5" />
                        Evidence Citations
                      </p>
                      {msg.citations.map((c, i) => (
                        <div key={i} className="rounded-md bg-amber-500/5 px-2 py-1 ring-1 ring-amber-500/10">
                          <p className="text-[10px] text-amber-300 font-medium">{c.source}</p>
                          <p className="text-[11px] text-white/60 italic">"{c.snippet}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="mt-1 text-[10px] text-white/30 px-2">
                  {new Date(msg.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </motion.div>
          ))}

          {isChatThinking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-600/30 to-orange-500/30 text-amber-300 ring-1 ring-amber-600/30">
                <Brain className="h-4 w-4" />
              </div>
              <div className="rounded-2xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/5">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-2 w-2 rounded-full bg-amber-400"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-white/40 mt-1.5">GLM-4 reasoning · retrieving evidence · synthesizing response...</p>
              </div>
            </motion.div>
          )}
        </div>

        {}
        {chatMessages.length <= 1 && (
          <div className="border-t border-white/5 p-3">
            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-2">Try asking the LLM</p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  disabled={isChatThinking}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70 hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {}
        <div className="border-t border-white/5 p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask the LLM about diagnosis, evidence, guidelines..."
              className="bg-white/5 border-white/10 text-white"
              disabled={isChatThinking}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isChatThinking}
              className="bg-gradient-to-r from-amber-600 to-orange-500 text-white hover:from-amber-700 hover:to-orange-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function formatMessage(content: string): React.ReactNode {

  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-orange-300">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}
