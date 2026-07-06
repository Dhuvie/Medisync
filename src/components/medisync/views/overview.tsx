"use client";

import { useMediSync } from "../store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, ArrowRight, Stethoscope, FlaskConical, FileText, AlertTriangle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { TRIAGE_COLORS } from "../shared";
import { VitalsRadar } from "../vitals-radar";
import type { PatientInput, ClinicalAnalysis } from "@/lib/medical/types";

export function OverviewView({ patient, analysis }: { patient: PatientInput; analysis: ClinicalAnalysis | null }) {
  const { isAnalyzing, llmPowered, setZone } = useMediSync();

  if (!analysis) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          {isAnalyzing ? (
            <>
              <Brain className="mx-auto h-8 w-8 text-[#7107E7] animate-pulse" />
              <p className="mt-3 label text-[#5A6BB8]">ANALYZING PATIENT...</p>
            </>
          ) : (
            <p className="text-[#5A6BB8]">No analysis available</p>
          )}
        </div>
      </div>
    );
  }

  const top = analysis.differentials[0];
  const triage = analysis.triage;
  const triageColor = TRIAGE_COLORS[triage.level];
  const abnormalVitals = analysis.vitalAnalysis.filter(v => v.status !== "normal").length;

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="space-y-4">

          <div className="block-tetris p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="label text-[#5A6BB8] mb-1">PATIENT</p>
                <h2 className="font-display text-3xl text-[#1C202B]">{patient.name}</h2>
                <p className="text-sm text-[#1C398E] mt-1">{patient.age}y {patient.gender} · {patient.id}</p>
              </div>
              <div className={cn("flex h-14 w-14 items-center justify-center border-2", triageColor.bg, triageColor.border)} style={{ boxShadow: "3px 3px 0 #1C202B" }}>
                <span className={cn("font-display text-2xl", triageColor.text)}>{triage.level[0].toUpperCase()}</span>
              </div>
            </div>
            <div className="pt-3 border-t-2 border-[#B8C8F0]">
              <p className={cn("label", triageColor.text)}>{triageColor.label}</p>
              <p className="text-xs text-[#1C398E] mt-1">{triage.disposition} · within {triage.timeFrame.toLowerCase()}</p>
            </div>
            {triage.criticalFindings.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {triage.criticalFindings.slice(0, 3).map((cf) => (
                  <span key={cf} className="inline-flex items-center gap-1 bg-[#DC2626]/10 border border-[#DC2626] px-2 py-1 text-xs text-[#DC2626]">
                    <AlertTriangle className="h-3 w-3" />
                    {cf.length > 40 ? cf.slice(0, 40) + "…" : cf}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="block-purple p-6">
            <div className="flex items-baseline justify-between mb-2">
              <p className="label text-[#5A6BB8]">LEADING DIAGNOSIS</p>
              {llmPowered && (
                <Badge className="bg-[#7107E7] text-white border-2 border-[#1C202B] text-[10px] gap-1" style={{ boxShadow: "2px 2px 0 #1C202B" }}>
                  <Sparkles className="h-2.5 w-2.5" /> LLM
                </Badge>
              )}
            </div>
            <h3 className="font-display text-2xl text-[#1C202B]">{top?.disease}</h3>
            <p className="label text-[#5A6BB8] mt-1">{top?.icd10} · {top?.bodySystem}</p>
            <div className="mt-4 flex flex-wrap items-end gap-4 sm:gap-6">
              <div>
                <p className="label text-[#5A6BB8] mb-1">PROBABILITY</p>
                <p className="stat-num text-2xl sm:text-3xl text-[#7107E7]">{top?.probability}%</p>
              </div>
              <div>
                <p className="label text-[#5A6BB8] mb-1">CONFIDENCE</p>
                <p className="stat-num text-2xl sm:text-3xl text-[#1C202B]">{top?.confidence}%</p>
              </div>
              <div className="flex-1" />
              <Button onClick={() => setZone("reasoning")} className="bg-[#1C202B] text-[#DFE7FF] border-2 border-[#1C202B] hover:bg-[#7107E7] hover:border-[#7107E7] gap-1.5 label text-[10px]" style={{ boxShadow: "2px 2px 0 #7107E7" }}>
                REASONING <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="text-sm text-[#1C398E] mt-4 leading-relaxed line-clamp-2">{top?.reasoning}</p>
          </div>
        </div>

        <div className="block-tetris p-4 sm:p-6 flex flex-col items-center justify-center">
          <div className="flex items-center justify-between w-full mb-2">
            <p className="label text-[#5A6BB8]">VITALS RADAR</p>
            {abnormalVitals > 0 && (
              <span className="inline-flex items-center gap-1 bg-[#D97706]/10 border border-[#D97706] px-2 py-0.5 text-xs text-[#D97706]">
                <AlertTriangle className="h-3 w-3" /> {abnormalVitals} ABNORMAL
              </span>
            )}
          </div>
          <div className="w-full max-w-[280px] sm:max-w-[300px]">
            <VitalsRadar vitals={analysis.vitalAnalysis} size={300} />
          </div>
          <p className="text-xs text-[#5A6BB8] mt-2 text-center italic">
            Shape distorts with abnormalities · green = normal · orange = abnormal · red = critical
          </p>
        </div>
      </div>

      <div>
        <p className="label text-[#5A6BB8] mb-3">QUICK ACTIONS</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: Brain, label: "VIEW REASONING", desc: `${analysis.differentials.length} differentials`, zone: "reasoning" as const },
            { icon: Stethoscope, label: "EDIT PATIENT", desc: "Update clinical data", zone: "patient" as const },
            { icon: FlaskConical, label: "TESTS", desc: `${analysis.recommendedTests.length} recommended`, zone: "reasoning" as const },
            { icon: FileText, label: "GENERATE SOAP", desc: "AI documentation", zone: "tools" as const },
          ].map((a, i) => {
            const Icon = a.icon;
            return (
              <button key={a.label} onClick={() => setZone(a.zone)} className="block-tetris card-hover p-4 text-left group">
                <div className="flex items-start justify-between mb-3">
                  <span className="font-display text-lg text-[#7107E7]">0{i + 1}</span>
                  <Icon className="h-4 w-4 text-[#5A6BB8] group-hover:text-[#7107E7] transition-colors" />
                </div>
                <p className="label text-[#1C202B]">{a.label}</p>
                <p className="text-xs text-[#5A6BB8] mt-0.5">{a.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {analysis.riskScores.slice(0, 4).map((r) => (
          <div key={r.condition} className="block-tetris p-4">
            <p className="label text-[#5A6BB8] mb-1 truncate">{r.condition}</p>
            <p className={cn("stat-num text-3xl", r.riskLevel === "low" ? "text-[#16A34A]" : r.riskLevel === "moderate" ? "text-[#D97706]" : "text-[#DC2626]")}>
              {r.score}
            </p>
            <p className="label text-[#5A6BB8] mt-0.5">{r.riskLevel.toUpperCase()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
