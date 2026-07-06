"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TriangleAlert, Clock, Activity, Ambulance, Hospital, Stethoscope, Video, Home } from "lucide-react";
import { useMediSync } from "../store";
import { TRIAGE_COLORS } from "../shared";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TriageLevel } from "@/lib/medical/types";

const TRIAGE_LEVELS: { level: TriageLevel; label: string; description: string; time: string }[] = [
  { level: "red", label: "Resuscitation", description: "Immediate life-saving intervention required", time: "0 min" },
  { level: "orange", label: "Emergent", description: "High-risk situation; rapid assessment", time: "<10 min" },
  { level: "yellow", label: "Urgent", description: "Multiple resources; potential deterioration", time: "<60 min" },
  { level: "green", label: "Less Urgent", description: "Single resource; stable", time: "<2 hours" },
  { level: "blue", label: "Non-Urgent", description: "Minor; could safely wait", time: "<24 hours" },
];

const DISPOSITION_ICONS = {
  ER: Ambulance,
  "Urgent Care": Hospital,
  "Clinic": Stethoscope,
  "Telemedicine": Video,
  "Self Care": Home,
} as const;

export function TriageView() {
  const { analysis } = useMediSync();

  if (!analysis) {
    return <Card className="glass p-12 text-center text-white/60">No analysis available. Run AI analysis first.</Card>;
  }

  const triage = analysis.triage;
  const activeColor = TRIAGE_COLORS[triage.level];
  const DispositionIcon = DISPOSITION_ICONS[triage.disposition];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Smart Triage Engine</h1>
        <p className="mt-1 text-sm text-white/50">
          ESI v4 + Modified Early Warning Score (MEWS) + AI risk stratification
        </p>
      </div>

      {}
      <Card className={cn("glass-strong relative overflow-hidden", activeColor.glow)}>
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TriangleAlert className="h-5 w-5 text-white" />
              <h2 className="text-lg font-semibold text-white">Triage Assignment</h2>
            </div>
            <Badge className={cn("border text-base px-4 py-1.5", activeColor.border, activeColor.bg, activeColor.text)}>
              {activeColor.label}
            </Badge>
          </div>

          {}
          <div className="flex items-center gap-6">
            <div className="relative h-32 w-32 shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                <motion.circle
                  cx="60" cy="60" r="50" fill="none" strokeWidth="10" strokeLinecap="round"
                  stroke={
                    triage.level === "red" ? "#ef4444" :
                    triage.level === "orange" ? "#f97316" :
                    triage.level === "yellow" ? "#eab308" :
                    triage.level === "green" ? "#8a9a5b" :
                    "#6b8e9e"
                  }
                  initial={{ strokeDasharray: "0 314" }}
                  animate={{ strokeDasharray: `${(triage.score / 100) * 314} 314` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{triage.score}</span>
                <span className="text-[10px] uppercase tracking-wider text-white/40">triage score</span>
              </div>
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg glass-subtle p-3">
                  <div className="flex items-center gap-2 text-xs text-white/40 mb-1">
                    <DispositionIcon className="h-3.5 w-3.5" />
                    Disposition
                  </div>
                  <p className="text-lg font-semibold text-white">{triage.disposition}</p>
                </div>
                <div className="rounded-lg glass-subtle p-3">
                  <div className="flex items-center gap-2 text-xs text-white/40 mb-1">
                    <Clock className="h-3.5 w-3.5" />
                    Time Frame
                  </div>
                  <p className="text-lg font-semibold text-white">{triage.timeFrame}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-white/60">{triage.rationale}</p>
            </div>
          </div>
        </div>
      </Card>

      {}
      <Card className="glass">
        <div className="border-b border-white/5 p-4">
          <h3 className="text-sm font-semibold text-white">ESI Triage Ladder (5-Level)</h3>
          <p className="text-xs text-white/40">Highlighted level reflects AI-assigned acuity</p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
            {TRIAGE_LEVELS.map((lvl) => {
              const c = TRIAGE_COLORS[lvl.level];
              const active = triage.level === lvl.level;
              return (
                <motion.div
                  key={lvl.level}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "rounded-lg border p-3 transition-all",
                    active ? cn(c.bg, c.border, c.glow) : "border-white/5 bg-white/[0.02] opacity-50"
                  )}
                >
                  <div className={cn("text-xs font-bold uppercase tracking-wider", active ? c.text : "text-white/40")}>
                    {lvl.label}
                  </div>
                  <div className="mt-1 text-[10px] text-white/50">{lvl.description}</div>
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-white/40">
                    <Clock className="h-2.5 w-2.5" />
                    <span>{lvl.time}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Card>

      {}
      {triage.criticalFindings.length > 0 && (
        <Card className="glass border-red-500/20">
          <div className="border-b border-white/5 p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-red-300" />
              <h3 className="text-sm font-semibold text-white">Critical Findings Triggering Triage</h3>
              <Badge variant="outline" className="ml-auto border-red-500/30 text-red-300">{triage.criticalFindings.length}</Badge>
            </div>
          </div>
          <div className="p-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {triage.criticalFindings.map((cf, i) => (
              <motion.div
                key={cf}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-2 rounded-lg bg-red-500/5 px-3 py-2 ring-1 ring-red-500/10"
              >
                <span className="flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                <span className="text-xs text-red-200">{cf}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="glass">
          <div className="border-b border-white/5 p-4">
            <h3 className="text-sm font-semibold text-white">MEWS Components</h3>
            <p className="text-xs text-white/40">Modified Early Warning Score</p>
          </div>
          <div className="p-4 space-y-2">
            {[
              { name: "Heart Rate", value: analysis.patient.vitals.heartRate, score: analysis.patient.vitals.heartRate > 110 ? 2 : analysis.patient.vitals.heartRate > 100 ? 1 : 0 },
              { name: "Systolic BP", value: analysis.patient.vitals.systolicBP, score: analysis.patient.vitals.systolicBP < 70 ? 3 : analysis.patient.vitals.systolicBP < 80 ? 2 : analysis.patient.vitals.systolicBP < 100 ? 1 : 0 },
              { name: "Respiratory Rate", value: analysis.patient.vitals.respiratoryRate, score: analysis.patient.vitals.respiratoryRate > 25 ? 2 : analysis.patient.vitals.respiratoryRate > 20 ? 1 : 0 },
              { name: "Temperature", value: analysis.patient.vitals.temperature, score: analysis.patient.vitals.temperature > 38.5 ? 1 : analysis.patient.vitals.temperature < 35 ? 2 : 0 },
              { name: "AVPU", value: "Alert", score: 0 },
            ].map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="text-white/70">{c.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white/50">{c.value}</span>
                  <span className={cn(
                    "rounded px-1.5 py-0.5 font-mono text-[10px] font-bold",
                    c.score === 0 ? "bg-orange-500/20 text-lime-300" :
                    c.score === 1 ? "bg-yellow-500/20 text-yellow-300" :
                    c.score === 2 ? "bg-orange-500/20 text-orange-300" :
                    "bg-red-500/20 text-red-300"
                  )}>+{c.score}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass">
          <div className="border-b border-white/5 p-4">
            <h3 className="text-sm font-semibold text-white">Disposition Logic</h3>
            <p className="text-xs text-white/40">AI recommendation pathway</p>
          </div>
          <div className="p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
              Triage score computed from 7 components
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
              Critical findings escalate level automatically
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
              Top differential probability weighting
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
              Lab abnormality cross-check
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
              ESI v4 + MEWS hybrid scoring
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
              Resource need estimation
            </div>
            <div className="flex items-center gap-2 text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
              Pediatric/pregnancy adjustments
            </div>
          </div>
        </Card>

        <Card className="glass">
          <div className="border-b border-white/5 p-4">
            <h3 className="text-sm font-semibold text-white">Resource Utilization</h3>
            <p className="text-xs text-white/40">Predicted care requirements</p>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-white/60">ICU probability</span>
                <span className="text-white">{analysis.admission.disposition === "ICU" ? "High" : "Low"}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-red-500" style={{ width: `${analysis.admission.probability}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-white/60">Est. length of stay</span>
                <span className="text-white">{analysis.admission.estimatedLOS} days</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-amber-600" style={{ width: `${Math.min(100, analysis.admission.estimatedLOS * 16)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-white/60">30-day readmission risk</span>
                <span className="text-white">{analysis.readmissionRisk}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500" style={{ width: `${analysis.readmissionRisk}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-white/60">Mortality risk</span>
                <span className="text-white">{analysis.mortalityRisk}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-red-700" style={{ width: `${analysis.mortalityRisk}%` }} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
