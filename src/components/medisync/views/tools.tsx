"use client";

import { useMediSync, type ToolTab } from "../store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, FileText, SlidersHorizontal, Network, Send, Brain, User, Quote, Sparkles, Loader2, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { KNOWLEDGE_NODES, KNOWLEDGE_EDGES } from "@/lib/medical/knowledge";
import type { PatientInput, ClinicalAnalysis } from "@/lib/medical/types";

const TABS: { key: ToolTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "chat", label: "AI ASSISTANT", icon: MessageSquare },
  { key: "soap", label: "SOAP NOTE", icon: FileText },
  { key: "whatif", label: "WHAT-IF", icon: SlidersHorizontal },
  { key: "knowledge", label: "KNOWLEDGE", icon: Network },
];

const SUGGESTED = [
  "What supports the leading diagnosis?",
  "What are the red flags for this patient?",
  "What tests should I order next?",
  "Could this be something else?",
];

export function ToolsView({ patient, analysis }: { patient: PatientInput; analysis: ClinicalAnalysis | null }) {
  const { toolTab, setToolTab } = useMediSync();
  return (
    <div className="space-y-6">
      <div>
        <p className="label text-[#5A6BB8]">SECTION 04</p>
        <h1 className="font-display text-4xl sm:text-5xl text-[#1C202B] mt-1">CLINICAL TOOLS</h1>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = toolTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setToolTab(t.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 label text-xs border-2 transition-all",
                active ? "bg-[#7107E7] text-white border-[#7107E7]" : "bg-white text-[#1C202B] border-[#B8C8F0] hover:border-[#7107E7]"
              )}
              style={active ? { boxShadow: "3px 3px 0 #1C202B" } : { boxShadow: "2px 2px 0 #1C202B" }}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={toolTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
          {toolTab === "chat" && <ChatTool patient={patient} analysis={analysis} />}
          {toolTab === "soap" && <SOAPTool patient={patient} analysis={analysis} />}
          {toolTab === "whatif" && <WhatIfTool patient={patient} />}
          {toolTab === "knowledge" && <KnowledgeTool />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ChatTool({ patient, analysis }: { patient: PatientInput; analysis: ClinicalAnalysis | null }) {
  const { chatMessages, isChatThinking, sendChatMessage } = useMediSync();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatMessages.length === 0 && analysis) {
      const top = analysis.differentials[0];
      useMediSync.setState({ chatMessages: [{ id: "init", role: "assistant", content: `I've analyzed ${patient.name}'s case. Leading differential: **${top?.disease}** (${top?.probability}% probability). Triage: **${analysis.triage.level.toUpperCase()}**. Ask me anything about the diagnosis, evidence, or guidelines.`, timestamp: new Date().toISOString() }] });
    }
  }, [analysis, patient, chatMessages.length]);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [chatMessages, isChatThinking]);

  const send = (text?: string) => { const msg = (text ?? input).trim(); if (!msg || isChatThinking) return; sendChatMessage(msg); setInput(""); };

  return (
    <div className="block-tetris flex flex-col h-[600px]">
      <div className="flex items-center justify-between border-b-2 border-[#B8C8F0] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-[#7107E7]" />
          <span className="label text-[#1C202B]">CLINICAL ASSISTANT</span>
        </div>
        <Badge className="bg-[#7107E7] text-white border-2 border-[#1C202B] text-[10px] gap-1" style={{ boxShadow: "2px 2px 0 #1C202B" }}><Sparkles className="h-2.5 w-2.5" /> LLM</Badge>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        {chatMessages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-3", msg.role === "user" && "flex-row-reverse")}>
            <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center border-2 border-[#1C202B]", msg.role === "user" ? "bg-[#7107E7] text-white" : "bg-white text-[#7107E7]")} style={{ boxShadow: "2px 2px 0 #1C202B" }}>
              {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : <Brain className="h-3.5 w-3.5" />}
            </div>
            <div className={cn("max-w-[80%]", msg.role === "user" && "text-right")}>
              <div className={cn("border-2 border-[#B8C8F0] px-3.5 py-2.5 text-sm inline-block text-left", msg.role === "user" ? "bg-[#7107E7]/10" : "bg-white")} style={{ boxShadow: "2px 2px 0 #1C202B" }}>
                <div className="whitespace-pre-wrap leading-relaxed">{formatBold(msg.content)}</div>
                {msg.reasoning && <div className="mt-2 pt-2 border-t border-[#B8C8F0] text-xs text-[#5A6BB8] italic">{msg.reasoning}</div>}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {msg.citations.map((c, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-[#5A6BB8]">
                        <Quote className="h-2.5 w-2.5 mt-0.5 shrink-0" />
                        <span><span className="text-[#7107E7]">{c.source}</span>: {c.snippet.slice(0, 100)}…</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="label text-[10px] text-[#5A6BB8] mt-1 px-1">{new Date(msg.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
            </div>
          </div>
        ))}
        {isChatThinking && (
          <div className="flex gap-3">
            <div className="flex h-7 w-7 items-center justify-center bg-white border-2 border-[#1C202B]" style={{ boxShadow: "2px 2px 0 #1C202B" }}><Brain className="h-3.5 w-3.5 text-[#7107E7]" /></div>
            <div className="bg-white border-2 border-[#B8C8F0] px-3.5 py-2.5" style={{ boxShadow: "2px 2px 0 #1C202B" }}>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (<motion.span key={i} className="piece piece-purple" style={{ width: 8, height: 8 }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />))}
              </div>
            </div>
          </div>
        )}
      </div>
      {chatMessages.length <= 1 && (
        <div className="px-4 py-2 border-t-2 border-[#B8C8F0] flex flex-wrap gap-1.5">
          {SUGGESTED.map((q) => (<button key={q} onClick={() => send(q)} disabled={isChatThinking} className="text-xs text-[#5A6BB8] hover:text-[#7107E7] px-2 py-1 border-2 border-[#B8C8F0] hover:border-[#7107E7] bg-white disabled:opacity-50">{q}</button>))}
        </div>
      )}
      <div className="border-t-2 border-[#B8C8F0] p-3 flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask about diagnosis, evidence, guidelines…" className="bg-white border-2 border-[#B8C8F0] font-mono text-sm" disabled={isChatThinking} />
        <Button size="sm" onClick={() => send()} disabled={!input.trim() || isChatThinking} className="bg-[#7107E7] text-white border-2 border-[#7107E7] px-3" style={{ boxShadow: "2px 2px 0 #1C202B" }}><Send className="h-3.5 w-3.5" /></Button>
      </div>
    </div>
  );
}

function formatBold(content: string): React.ReactNode {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i} className="font-semibold text-[#7107E7]">{part.slice(2, -2)}</strong>;
    return <span key={i}>{part}</span>;
  });
}

function SOAPTool({ analysis }: { patient: PatientInput; analysis: ClinicalAnalysis | null }) {
  const { soapNote, isGeneratingSOAP, generateSOAP } = useMediSync();
  const [copied, setCopied] = useState(false);

  useEffect(() => { if (analysis && !soapNote && !isGeneratingSOAP) generateSOAP(); }, [analysis, soapNote, isGeneratingSOAP, generateSOAP]);
  if (!analysis) return <div className="py-16 text-center text-[#5A6BB8]">No analysis available</div>;

  const soap = soapNote || analysis.soapNote;
  const copy = () => { navigator.clipboard.writeText(`S:\n${soap.subjective}\n\nO:\n${soap.objective}\n\nA:\n${soap.assessment}\n\nP:\n${soap.plan}`); setCopied(true); toast.success("COPIED"); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="label text-[#5A6BB8]">{isGeneratingSOAP ? "GENERATING..." : soapNote ? "LLM-GENERATED" : "RULE-BASED"}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copy} disabled={isGeneratingSOAP} className="border-2 border-[#1C202B] text-[#1C202B] hover:bg-[#1C202B] hover:text-[#DFE7FF] gap-1.5 label text-[10px]" style={{ boxShadow: "2px 2px 0 #7107E7" }}><Copy className="h-3 w-3" /> {copied ? "COPIED" : "COPY"}</Button>
          <Button size="sm" onClick={generateSOAP} disabled={isGeneratingSOAP} className="bg-[#7107E7] text-white border-2 border-[#7107E7] hover:bg-[#1C202B] hover:border-[#1C202B] gap-1.5 label text-[10px]" style={{ boxShadow: "2px 2px 0 #1C202B" }}>{isGeneratingSOAP ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />} REGEN</Button>
        </div>
      </div>
      {isGeneratingSOAP && !soapNote ? (
        <div className="block-tetris p-12 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-[#7107E7]" /><p className="mt-3 label text-[#5A6BB8]">LLM COMPOSING NOTE...</p></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[
            { letter: "S", label: "SUBJECTIVE", text: soap.subjective },
            { letter: "O", label: "OBJECTIVE", text: soap.objective },
            { letter: "A", label: "ASSESSMENT", text: soap.assessment },
            { letter: "P", label: "PLAN", text: soap.plan },
          ].map((s) => (
            <div key={s.letter} className="block-tetris p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-7 w-7 items-center justify-center bg-[#7107E7] text-white font-display text-sm">{s.letter}</span>
                <p className="label text-[#5A6BB8]">{s.label}</p>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-line text-[#1C398E]">{s.text}</p>
            </div>
          ))}
        </div>
      )}
      <div className="block-tetris p-6">
        <p className="label text-[#5A6BB8] mb-3">ICD-10 CODES</p>
        <div className="flex flex-wrap gap-2">
          {analysis.soapNote.icd10Codes.map((c) => (
            <Badge key={c.code} className="font-mono text-xs gap-1.5 bg-[#7107E7]/10 text-[#7107E7] border-2 border-[#7107E7]">{c.code} <span className="text-[#5A6BB8] font-sans">{c.description}</span></Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

function WhatIfTool({ patient }: { patient: PatientInput }) {
  const [simPatient, setSimPatient] = useState(() => ({ ...patient, vitals: { ...patient.vitals } }));
  const updateVital = (key: keyof typeof simPatient.vitals, value: number) => setSimPatient(p => ({ ...p, vitals: { ...p.vitals, [key]: value } }));
  const sliders = [
    { key: "heartRate" as const, label: "HEART RATE", min: 30, max: 180, unit: "bpm" },
    { key: "systolicBP" as const, label: "SYSTOLIC BP", min: 60, max: 220, unit: "mmHg" },
    { key: "spo2" as const, label: "SpO₂", min: 70, max: 100, unit: "%" },
    { key: "temperature" as const, label: "TEMPERATURE", min: 34, max: 42, unit: "°C" },
  ];
  const baseRisk = (patient.vitals.heartRate > 100 ? 20 : 0) + (patient.vitals.spo2 < 92 ? 25 : 0) + (patient.vitals.systolicBP < 90 ? 20 : 0);
  const simRisk = (simPatient.vitals.heartRate > 100 ? 20 : 0) + (simPatient.vitals.spo2 < 92 ? 25 : 0) + (simPatient.vitals.systolicBP < 90 ? 20 : 0);
  const delta = simRisk - baseRisk;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="block-tetris p-6">
        <p className="label text-[#5A6BB8] mb-4">ADJUST VITALS</p>
        <div className="space-y-5">
          {sliders.map((s) => (
            <div key={s.key}>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="label text-[#5A6BB8]">{s.label}</Label>
                <span className="font-mono text-sm text-[#1C202B]">{simPatient.vitals[s.key]}<span className="text-[#5A6BB8] ml-1 text-xs">{s.unit}</span></span>
              </div>
              <input type="range" min={s.min} max={s.max} value={simPatient.vitals[s.key]} onChange={(e) => updateVital(s.key, parseFloat(e.target.value))} className="w-full accent-[#7107E7]" />
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={() => setSimPatient({ ...patient, vitals: { ...patient.vitals } })} className="mt-4 border-2 border-[#1C202B] text-[#1C202B] label text-[10px]" style={{ boxShadow: "2px 2px 0 #7107E7" }}>RESET BASELINE</Button>
      </div>
      <div className="block-tetris p-6">
        <p className="label text-[#5A6BB8] mb-4">PREDICTED IMPACT</p>
        <div className="space-y-4">
          <div>
            <p className="label text-[#5A6BB8] mb-1">RISK DELTA</p>
            <p className={cn("stat-num text-5xl", delta > 0 ? "text-[#DC2626]" : delta < 0 ? "text-[#16A34A]" : "text-[#1C202B]")}>{delta > 0 ? "+" : ""}{delta}</p>
          </div>
          <div className="pt-4 border-t-2 border-[#B8C8F0] space-y-2">
            <div className="flex justify-between text-sm"><span className="label text-[#5A6BB8]">BASELINE</span><span className="font-mono text-[#1C202B]">{baseRisk}</span></div>
            <div className="flex justify-between text-sm"><span className="label text-[#5A6BB8]">SIMULATED</span><span className="font-mono text-[#1C202B]">{simRisk}</span></div>
          </div>
          <p className="text-xs text-[#5A6BB8] italic mt-4">Adjust vitals to see how the AI risk score responds. This is a simplified simulation.</p>
        </div>
      </div>
    </div>
  );
}

function KnowledgeTool() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedNode = selected ? KNOWLEDGE_NODES.find(n => n.id === selected) : null;
  const selectedEdges = selected ? KNOWLEDGE_EDGES.filter(e => e.source === selected || e.target === selected) : [];
  const positioned = KNOWLEDGE_NODES.map((n, i) => {
    const angle = (i / KNOWLEDGE_NODES.length) * Math.PI * 2;
    const r = 180 + (n.type === "disease" ? 0 : 40);
    return { ...n, x: 250 + Math.cos(angle) * r, y: 250 + Math.sin(angle) * r };
  });
  const NODE_COLORS: Record<string, string> = { disease: "#DC2626", symptom: "#D97706", drug: "#7107E7", test: "#1C202B", bodySystem: "#16A34A", complication: "#DC2626", treatment: "#16A34A" };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="block-tetris lg:col-span-2 p-4">
        <svg viewBox="0 0 500 500" className="w-full h-[500px]">
          {KNOWLEDGE_EDGES.map((e, i) => {
            const src = positioned.find(n => n.id === e.source);
            const tgt = positioned.find(n => n.id === e.target);
            if (!src || !tgt) return null;
            const active = selected === src.id || selected === tgt.id;
            return <line key={i} x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y} stroke={active ? "#7107E7" : "#B8C8F0"} strokeWidth={active ? 2 : 1} opacity={active ? 0.8 : 0.4} />;
          })}
          {positioned.map((n) => {
            const color = NODE_COLORS[n.type] || "#5A6BB8";
            const isSelected = selected === n.id;
            const isConnected = selected && selectedEdges.some(e => e.source === n.id || e.target === n.id);
            const opacity = !selected || isSelected || isConnected ? 1 : 0.3;
            const r = n.type === "disease" ? 18 : n.type === "bodySystem" ? 14 : 10;
            return (
              <g key={n.id} onClick={() => setSelected(isSelected ? null : n.id)} style={{ cursor: "pointer", opacity }} className="transition-opacity">
                <circle cx={n.x} cy={n.y} r={r + (isSelected ? 3 : 0)} fill={color} fillOpacity={isSelected ? 0.4 : 0.2} stroke={color} strokeWidth={isSelected ? 2 : 1.5} />
                {(n.type === "disease" || n.type === "bodySystem" || isSelected) && (
                  <text x={n.x} y={n.y + r + 12} textAnchor="middle" fontSize={9} fill="#1C202B" style={{ pointerEvents: "none" }}>{n.label.length > 18 ? n.label.slice(0, 18) + "…" : n.label}</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="block-tetris p-6">
        {selectedNode ? (
          <div>
            <p className="label text-[#5A6BB8] mb-2 capitalize">{selectedNode.type}</p>
            <h3 className="font-display text-2xl text-[#1C202B]">{selectedNode.label}</h3>
            {selectedNode.description && <p className="text-xs text-[#5A6BB8] mt-1">{selectedNode.description}</p>}
            <div className="mt-4 pt-4 border-t-2 border-[#B8C8F0]">
              <p className="label text-[#5A6BB8] mb-2">CONNECTIONS ({selectedEdges.length})</p>
              <div className="space-y-1.5 max-h-64 overflow-y-auto scrollbar-thin">
                {selectedEdges.map((e, i) => {
                  const other = e.source === selectedNode.id ? e.target : e.source;
                  const otherNode = KNOWLEDGE_NODES.find(n => n.id === other);
                  if (!otherNode) return null;
                  return (
                    <button key={i} onClick={() => setSelected(other)} className="flex items-center gap-2 w-full text-left p-1.5 border-2 border-[#B8C8F0] hover:border-[#7107E7] bg-white text-xs">
                      <span className="piece shrink-0" style={{ background: NODE_COLORS[otherNode.type], width: 10, height: 10 }} />
                      <span className="truncate text-[#1C202B]">{otherNode.label}</span>
                      <span className="text-[#5A6BB8] ml-auto text-[10px]">{e.relationship}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Network className="mx-auto h-8 w-8 text-[#B8C8F0]" />
            <p className="mt-3 text-sm text-[#5A6BB8]">Click a node to explore relationships</p>
          </div>
        )}
      </div>
    </div>
  );
}
