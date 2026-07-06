"use client";

import { useState } from "react";
import { useMediSync } from "../store";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Sparkles, AlertCircle, Target, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { TRIAGE_COLORS, SEVERITY_COLORS } from "../shared";
import { motion, AnimatePresence } from "framer-motion";
import type { ClinicalAnalysis } from "@/lib/medical/types";

export function ReasoningView({ analysis }: { analysis: ClinicalAnalysis | null }) {
  const { isAnalyzing, llmPowered } = useMediSync();
  const [selectedDDx, setSelectedDDx] = useState(0);

  if (isAnalyzing && !analysis) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <Brain className="mx-auto h-8 w-8 text-[#7107E7] animate-pulse" />
          <p className="mt-3 label text-[#5A6BB8]">AI REASONING IN PROGRESS...</p>
          <p className="text-xs text-[#5A6BB8] mt-1">Real LLM analyzing patient data</p>
        </div>
      </div>
    );
  }
  if (!analysis) return <div className="py-32 text-center text-[#5A6BB8]">No analysis available</div>;

  const top = analysis.differentials[selectedDDx];
  const triage = analysis.triage;
  const triageColor = TRIAGE_COLORS[triage.level];

  return (
    <div className="space-y-6">

      <div className="flex items-baseline justify-between">
        <div>
          <p className="label text-[#5A6BB8]">SECTION 03</p>
          <h1 className="font-display text-4xl sm:text-5xl text-[#1C202B] mt-1">CLINICAL REASONING</h1>
        </div>
        {llmPowered ? (
          <Badge className="bg-[#7107E7] text-white border-2 border-[#1C202B] gap-1" style={{ boxShadow: "2px 2px 0 #1C202B" }}>
            <Sparkles className="h-3 w-3" /> REAL LLM
          </Badge>
        ) : (
          <Badge className="bg-[#D97706] text-white border-2 border-[#1C202B]" style={{ boxShadow: "2px 2px 0 #1C202B" }}>RULE-BASED</Badge>
        )}
      </div>

      <div className={cn("block-tetris p-4 flex items-center gap-4", triageColor.border)} style={{ boxShadow: `3px 3px 0 #1C202B` }}>
        <div className={cn("flex h-10 w-10 items-center justify-center border-2", triageColor.bg, triageColor.border)}>
          <span className={cn("font-display text-lg", triageColor.text)}>{triage.level[0].toUpperCase()}</span>
        </div>
        <div className="flex-1">
          <p className={cn("label", triageColor.text)}>{triageColor.label}</p>
          <p className="text-xs text-[#1C398E]">{triage.disposition} · {triage.timeFrame}</p>
        </div>
        {triage.criticalFindings.length > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#DC2626]">
            <AlertCircle className="h-3 w-3" /> {triage.criticalFindings.length} CRITICAL
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        <div className="lg:col-span-2 space-y-2">
          <p className="label text-[#5A6BB8] mb-3">DIFFERENTIALS · RANKED</p>
          {analysis.differentials.map((ddx, i) => (
            <button
              key={ddx.id}
              onClick={() => setSelectedDDx(i)}
              className={cn(
                "w-full text-left p-4 border-2 transition-all",
                i === selectedDDx ? "bg-[#7107E7]/5 border-[#7107E7]" : "bg-white border-[#B8C8F0] hover:border-[#7107E7]"
              )}
              style={i === selectedDDx ? { boxShadow: "3px 3px 0 #7107E7" } : { boxShadow: "2px 2px 0 #1C202B" }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm text-[#7107E7]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sm font-semibold text-[#1C202B]">{ddx.disease}</span>
                </div>
                <span className="stat-num text-lg text-[#7107E7]">{ddx.probability}%</span>
              </div>
              <Progress value={ddx.probability} className="h-1.5" indicatorClassName="bg-[#7107E7]" />
              <div className="flex items-center justify-between mt-2 label text-[10px] text-[#5A6BB8]">
                <span className="font-mono">{ddx.icd10}</span>
                <span>{ddx.confidence}% CONF</span>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div key={selectedDDx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }} className="space-y-4">

              <div className="block-tetris p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="label text-[#5A6BB8]">DIAGNOSIS</p>
                    <h2 className="font-display text-3xl text-[#1C202B] mt-1">{top.disease}</h2>
                    <p className="label text-[#5A6BB8] mt-1 font-mono">{top.icd10} · {top.bodySystem}</p>
                  </div>
                  <Badge className={cn("border-2", SEVERITY_COLORS[top.severity])} style={{ boxShadow: "2px 2px 0 #1C202B" }}>{top.severity}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t-2 border-[#B8C8F0]">
                  <div>
                    <p className="label text-[#5A6BB8] mb-1">PROBABILITY</p>
                    <p className="stat-num text-3xl text-[#7107E7]">{top.probability}%</p>
                  </div>
                  <div>
                    <p className="label text-[#5A6BB8] mb-1">CONFIDENCE</p>
                    <p className="stat-num text-3xl text-[#1C202B]">{top.confidence}%</p>
                  </div>
                  <div>
                    <p className="label text-[#5A6BB8] mb-1">LIKELIHOOD</p>
                    <p className="text-sm font-semibold mt-1 capitalize text-[#1C202B]">{top.likelihood}</p>
                  </div>
                </div>
              </div>

              <div className="block-tetris p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="h-4 w-4 text-[#7107E7]" />
                  <p className="label text-[#5A6BB8]">AI REASONING</p>
                </div>
                <p className="text-sm leading-relaxed text-[#1C398E]">{top.reasoning}</p>
              </div>

              <div className="block-tetris p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-4 w-4 text-[#7107E7]" />
                  <p className="label text-[#5A6BB8]">EVIDENCE</p>
                </div>
                <div className="space-y-2.5">
                  {top.evidence.slice(0, 5).map((ev, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-[#1C398E] font-mono w-32 shrink-0">{ev.factor}</span>
                      <div className="flex-1 h-2 bg-[#B8C8F0] overflow-hidden">
                        <div className={cn("h-full", ev.weight > 0.5 ? "bg-[#7107E7]" : "bg-[#7107E7]/50")} style={{ width: `${Math.abs(ev.weight) * 100}%` }} />
                      </div>
                      <span className="font-mono text-xs text-[#5A6BB8] w-10 text-right">{ev.weight > 0 ? "+" : ""}{ev.weight.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {top.redFlags.length > 0 && (
                <div className="block-tetris p-6 border-[#DC2626]" style={{ boxShadow: "3px 3px 0 #DC2626" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-4 w-4 text-[#DC2626]" />
                    <p className="label text-[#DC2626]">RED FLAGS TO EXCLUDE</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {top.redFlags.map((rf) => (
                      <div key={rf} className="flex items-start gap-2 text-sm text-[#1C398E]">
                        <span className="piece piece-red mt-1.5" style={{ width: 8, height: 8 }} />
                        <span>{rf}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="block-tetris p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-[#7107E7]" />
          <p className="label text-[#5A6BB8]">FULL REASONING NARRATIVE</p>
          {llmPowered && <Badge className="bg-[#7107E7] text-white border-2 border-[#1C202B] text-[10px] gap-1 ml-auto" style={{ boxShadow: "2px 2px 0 #1C202B" }}><Sparkles className="h-2.5 w-2.5" /> LLM</Badge>}
        </div>
        <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono text-[#1C398E]">{analysis.aiReasoning}</pre>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="label text-[#5A6BB8]">RECOMMENDED WORKUP</p>
          <span className="label text-[#5A6BB8]">{analysis.recommendedTests.length} TESTS</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {analysis.recommendedTests.slice(0, 9).map((t, i) => (
            <div key={t.test} className="block-tetris p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="font-display text-sm text-[#7107E7]">{String(i + 1).padStart(2, "0")}</span>
                <Badge variant="outline" className={cn("text-[9px] border-2", t.priority === "stat" ? "border-[#DC2626] text-[#DC2626]" : t.priority === "urgent" ? "border-[#D97706] text-[#D97706]" : "border-[#B8C8F0] text-[#5A6BB8]")}>{t.priority}</Badge>
              </div>
              <p className="text-sm font-semibold text-[#1C202B]">{t.test}</p>
              <p className="text-xs text-[#5A6BB8] mt-1 line-clamp-2">{t.rationale}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
