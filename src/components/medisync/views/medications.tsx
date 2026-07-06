"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Pill, AlertCircle, ShieldAlert, Ban } from "lucide-react";
import { useMediSync } from "../store";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const SEVERITY_STYLES = {
  contraindicated: { bg: "bg-red-500/15", border: "border-red-500/40", text: "text-red-300", label: "CONTRAINDICATED" },
  major: { bg: "bg-orange-500/15", border: "border-orange-500/40", text: "text-orange-300", label: "MAJOR" },
  moderate: { bg: "bg-yellow-500/15", border: "border-yellow-500/40", text: "text-yellow-300", label: "MODERATE" },
  minor: { bg: "bg-sky-500/15", border: "border-sky-500/40", text: "text-sky-300", label: "MINOR" },
} as const;

export function MedicationsView() {
  const { analysis, patient } = useMediSync();

  if (!analysis) return <Card className="glass p-12 text-center text-white/60">No analysis available.</Card>;

  const hasIssues = analysis.medicationInteractions.length > 0 || analysis.allergyAlerts.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Medication Safety</h1>
          <p className="mt-1 text-sm text-white/50">Drug-drug interaction · Allergy cross-reactivity · Duplicate therapy detection</p>
        </div>
        {hasIssues && (
          <Badge className="border-red-500/30 bg-red-500/10 text-red-300">
            <AlertTriangle className="mr-1 h-3 w-3" />
            {analysis.medicationInteractions.length + analysis.allergyAlerts.length} alerts
          </Badge>
        )}
      </div>

      {}
      <Card className="glass">
        <div className="border-b border-white/5 p-4">
          <div className="flex items-center gap-2">
            <Pill className="h-4 w-4 text-orange-300" />
            <h3 className="text-sm font-semibold text-white">Active Medication List ({patient.currentMedications.length})</h3>
          </div>
        </div>
        <div className="p-4 flex flex-wrap gap-2">
          {patient.currentMedications.length === 0 ? (
            <p className="text-sm text-white/40">No active medications</p>
          ) : (
            patient.currentMedications.map((m) => (
              <Badge key={m} variant="outline" className="border-orange-500/30 bg-orange-500/10 text-orange-200">
                <Pill className="mr-1 h-3 w-3" />
                {m}
              </Badge>
            ))
          )}
        </div>
      </Card>

      {}
      {analysis.allergyAlerts.length > 0 && (
        <Card className="glass border-red-500/30 pulse-critical">
          <div className="border-b border-white/5 p-4">
            <div className="flex items-center gap-2">
              <Ban className="h-4 w-4 text-red-300" />
              <h3 className="text-sm font-semibold text-white">Allergy Alerts — STOP & Reassess</h3>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {analysis.allergyAlerts.map((alert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-lg border border-red-500/30 bg-red-500/5 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <span className="font-semibold text-white">{alert.allergen} allergy → {alert.offendingDrug}</span>
                  </div>
                  <Badge className="bg-red-500/20 text-red-300 border border-red-500/40">
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-xs text-red-200 mb-2">Reaction: {alert.reaction}</p>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Cross-reactive drugs to avoid:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {alert.crossReactivity.map((d) => (
                      <span key={d} className="rounded bg-red-500/10 px-2 py-0.5 text-[10px] text-red-300 ring-1 ring-red-500/20">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {}
      <Card className="glass">
        <div className="border-b border-white/5 p-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-300" />
            <h3 className="text-sm font-semibold text-white">Drug-Drug Interactions ({analysis.medicationInteractions.length})</h3>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {analysis.medicationInteractions.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                <ShieldAlert className="h-5 w-5 text-amber-400" />
              </div>
              <p className="mt-2 text-sm text-lime-300">No drug-drug interactions detected</p>
              <p className="text-xs text-white/40">Current medication regimen is safe</p>
            </div>
          ) : (
            analysis.medicationInteractions.map((int, i) => {
              const style = SEVERITY_STYLES[int.severity];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn("rounded-lg border p-4", style.bg, style.border)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1">
                        <Pill className="h-3 w-3 text-white/60" />
                        <span className="text-sm font-medium text-white">{int.drugA}</span>
                      </div>
                      <span className="text-white/40 text-xs">+</span>
                      <div className="flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1">
                        <Pill className="h-3 w-3 text-white/60" />
                        <span className="text-sm font-medium text-white">{int.drugB}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={cn("border", style.border, style.text)}>{style.label}</Badge>
                      <Badge variant="outline" className="border-white/10 text-white/50">
                        Evidence {int.evidenceLevel}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Mechanism</p>
                      <p className="text-white/70">{int.mechanism}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Clinical Effect</p>
                      <p className="text-white/70">{int.clinicalEffect}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Management</p>
                      <p className="text-lime-300">{int.management}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </Card>

      {}
      <Card className="glass">
        <div className="border-b border-white/5 p-4">
          <h3 className="text-sm font-semibold text-white">Renal & Hepatic Considerations</h3>
        </div>
        <div className="p-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg glass-subtle p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Renal function (eGFR)</span>
              {patient.labs.creatinine > 1.5 ? (
                <Badge className="bg-orange-500/20 text-orange-300 border border-orange-500/30">Adjust dose</Badge>
              ) : (
                <Badge className="bg-orange-500/20 text-lime-300 border border-orange-500/30">Normal</Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-white">Cr: {patient.labs.creatinine} mg/dL · BUN: {patient.labs.bun} mg/dL</p>
            {patient.labs.creatinine > 1.5 && (
              <p className="mt-1 text-[11px] text-orange-200">Renally-cleared medications may need dose adjustment</p>
            )}
          </div>
          <div className="rounded-lg glass-subtle p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Hepatic function</span>
              {patient.labs.alt > 56 || patient.labs.ast > 40 ? (
                <Badge className="bg-orange-500/20 text-orange-300 border border-orange-500/30">Monitor</Badge>
              ) : (
                <Badge className="bg-orange-500/20 text-lime-300 border border-orange-500/30">Normal</Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-white">ALT: {patient.labs.alt} U/L · AST: {patient.labs.ast} U/L</p>
            {(patient.labs.alt > 56 || patient.labs.ast > 40) && (
              <p className="mt-1 text-[11px] text-orange-200">Hepatic-metabolized drugs require monitoring</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
