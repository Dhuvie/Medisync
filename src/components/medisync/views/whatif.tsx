"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal, RotateCcw, Play, ArrowRight, Sparkles } from "lucide-react";
import { useMediSync } from "../store";
import { analyzePatient, type PatientInput } from "@/lib/medical/engine";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TRIAGE_COLORS } from "../shared";

export function WhatIfView() {
  const { patient, analysis } = useMediSync();
  const [simPatient, setSimPatient] = useState<PatientInput>(() => ({
    ...patient,
    vitals: { ...patient.vitals },
    labs: { ...patient.labs },
  }));

  const simAnalysis = useMemo(() => analyzePatient(simPatient), [simPatient]);

  const updateVital = (key: keyof PatientInput["vitals"], value: number) => {
    setSimPatient((p) => ({ ...p, vitals: { ...p.vitals, [key]: value } }));
  };

  const updateLab = (key: keyof PatientInput["labs"], value: number) => {
    setSimPatient((p) => ({ ...p, labs: { ...p.labs, [key]: value } }));
  };

  const resetSim = () => {
    setSimPatient({
      ...patient,
      vitals: { ...patient.vitals },
      labs: { ...patient.labs },
    });
  };

  const sliders: { key: keyof PatientInput["vitals"]; label: string; min: number; max: number; step: number; unit: string }[] = [
    { key: "heartRate", label: "Heart Rate", min: 30, max: 180, step: 1, unit: "bpm" },
    { key: "systolicBP", label: "Systolic BP", min: 60, max: 220, step: 1, unit: "mmHg" },
    { key: "diastolicBP", label: "Diastolic BP", min: 40, max: 130, step: 1, unit: "mmHg" },
    { key: "temperature", label: "Temperature", min: 34, max: 42, step: 0.1, unit: "°C" },
    { key: "respiratoryRate", label: "Respiratory Rate", min: 6, max: 40, step: 1, unit: "/min" },
    { key: "spo2", label: "SpO2", min: 70, max: 100, step: 1, unit: "%" },
  ];

  const labSliders: { key: keyof PatientInput["labs"]; label: string; min: number; max: number; step: number; unit: string }[] = [
    { key: "troponin", label: "Troponin", min: 0, max: 5, step: 0.01, unit: "ng/mL" },
    { key: "whiteBloodCells", label: "WBC", min: 1, max: 40, step: 0.1, unit: "K/µL" },
    { key: "creatinine", label: "Creatinine", min: 0.3, max: 5, step: 0.1, unit: "mg/dL" },
    { key: "potassium", label: "Potassium", min: 2.5, max: 7, step: 0.1, unit: "mEq/L" },
    { key: "hemoglobinA1c", label: "HbA1c", min: 4, max: 14, step: 0.1, unit: "%" },
    { key: "crp", label: "CRP", min: 0, max: 200, step: 1, unit: "mg/L" },
  ];

  const origTop = analysis?.differentials[0];
  const simTop = simAnalysis.differentials[0];
  const probDelta = (simTop?.probability || 0) - (origTop?.probability || 0);
  const triageChanged = analysis?.triage.level !== simAnalysis.triage.level;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">What-if Simulator</h1>
          <p className="mt-1 text-sm text-white/50">
            Adjust vitals & labs in real-time to observe how AI predictions change · Counterfactual exploration
          </p>
        </div>
        <Button variant="outline" onClick={resetSim} className="gap-2 border-white/10 bg-white/5">
          <RotateCcw className="h-3.5 w-3.5" /> Reset to baseline
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {}
        <Card className="glass">
          <div className="border-b border-white/5 p-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-amber-300" />
              <h3 className="text-sm font-semibold text-white">Patient Parameters</h3>
              <Badge variant="outline" className="ml-auto border-white/10 text-white/60">Adjustable</Badge>
            </div>
          </div>
          <div className="p-4 space-y-5">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/40 mb-3">Vital Signs</p>
              <div className="space-y-3">
                {sliders.map((s) => (
                  <div key={s.key}>
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-xs text-white/70">{s.label}</Label>
                      <span className="text-xs font-mono text-white">
                        {(simPatient.vitals as any)[s.key]}<span className="text-white/40 ml-1">{s.unit}</span>
                      </span>
                    </div>
                    <Slider
                      value={[(simPatient.vitals as any)[s.key]]}
                      onValueChange={(v) => updateVital(s.key, v[0])}
                      min={s.min}
                      max={s.max}
                      step={s.step}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/40 mb-3">Lab Values</p>
              <div className="space-y-3">
                {labSliders.map((s) => (
                  <div key={s.key}>
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-xs text-white/70">{s.label}</Label>
                      <span className="text-xs font-mono text-white">
                        {(simPatient.labs as any)[s.key]}<span className="text-white/40 ml-1">{s.unit}</span>
                      </span>
                    </div>
                    <Slider
                      value={[(simPatient.labs as any)[s.key]]}
                      onValueChange={(v) => updateLab(s.key, v[0])}
                      min={s.min}
                      max={s.max}
                      step={s.step}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {}
        <div className="space-y-4">
          {}
          <Card className="glass">
            <div className="border-b border-white/5 p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-orange-300" />
                <h3 className="text-sm font-semibold text-white">Live Prediction Comparison</h3>
              </div>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              {}
              <div className="rounded-lg bg-white/[0.03] p-3 ring-1 ring-white/5">
                <p className="text-[10px] uppercase tracking-wider text-white/40">Baseline</p>
                <p className="text-sm font-semibold text-white mt-1">{origTop?.disease || "—"}</p>
                <p className="text-2xl font-bold text-orange-300 mt-1">{origTop?.probability || 0}%</p>
                <Badge className={cn("mt-2 border", TRIAGE_COLORS[analysis!.triage.level].border, TRIAGE_COLORS[analysis!.triage.level].bg, TRIAGE_COLORS[analysis!.triage.level].text)}>
                  {analysis!.triage.level.toUpperCase()}
                </Badge>
              </div>

              {}
              <div className={cn(
                "rounded-lg p-3 ring-1 transition-all",
                triageChanged ? "bg-amber-600/5 ring-amber-600/20" : "bg-white/[0.03] ring-white/5"
              )}>
                <p className="text-[10px] uppercase tracking-wider text-white/40">Simulated</p>
                <p className="text-sm font-semibold text-white mt-1">{simTop?.disease || "—"}</p>
                <p className={cn("text-2xl font-bold mt-1", probDelta > 0 ? "text-red-300" : probDelta < 0 ? "text-lime-300" : "text-orange-300")}>
                  {simTop?.probability || 0}%
                  {probDelta !== 0 && (
                    <span className="ml-1 text-xs">
                      ({probDelta > 0 ? "+" : ""}{probDelta})
                    </span>
                  )}
                </p>
                <Badge className={cn("mt-2 border", TRIAGE_COLORS[simAnalysis.triage.level].border, TRIAGE_COLORS[simAnalysis.triage.level].bg, TRIAGE_COLORS[simAnalysis.triage.level].text)}>
                  {simAnalysis.triage.level.toUpperCase()}
                </Badge>
              </div>
            </div>

            {triageChanged && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-4 mb-4 rounded-lg bg-amber-600/10 p-3 ring-1 ring-amber-600/20"
              >
                <p className="flex items-center gap-2 text-xs text-amber-200">
                  <ArrowRight className="h-3 w-3" />
                  <strong>Triage changed:</strong> {analysis!.triage.level.toUpperCase()} → {simAnalysis.triage.level.toUpperCase()}
                </p>
                <p className="mt-1 text-[11px] text-white/60">New disposition: {simAnalysis.triage.disposition} within {simAnalysis.triage.timeFrame.toLowerCase()}</p>
              </motion.div>
            )}
          </Card>

          {}
          <Card className="glass">
            <div className="border-b border-white/5 p-4">
              <h3 className="text-sm font-semibold text-white">Differential Diagnosis Shift</h3>
              <p className="text-xs text-white/40">Top 5 diagnoses — baseline vs simulated</p>
            </div>
            <div className="p-4 space-y-2">
              {simAnalysis.differentials.slice(0, 5).map((sim, i) => {
                const orig = analysis?.differentials.find(d => d.disease === sim.disease);
                const origProb = orig?.probability || 0;
                const delta = sim.probability - origProb;
                return (
                  <div key={sim.disease} className="flex items-center gap-3 text-xs">
                    <div className="w-40 truncate text-white/80">{sim.disease}</div>
                    <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden relative">
                      <div
                        className="absolute h-full bg-orange-500/30 rounded-full"
                        style={{ width: `${origProb}%` }}
                      />
                      <div
                        className={cn(
                          "absolute h-full rounded-full",
                          delta > 0 ? "bg-amber-600" : delta < 0 ? "bg-orange-500" : "bg-orange-500"
                        )}
                        style={{ width: `${sim.probability}%` }}
                      />
                    </div>
                    <div className="w-16 text-right">
                      <span className="font-mono text-white">{sim.probability}%</span>
                      {delta !== 0 && (
                        <span className={cn("ml-1 text-[10px]", delta > 0 ? "text-amber-300" : "text-lime-300")}>
                          ({delta > 0 ? "+" : ""}{delta})
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {}
          <Card className="glass">
            <div className="border-b border-white/5 p-4">
              <h3 className="text-sm font-semibold text-white">Risk Score Changes</h3>
            </div>
            <div className="p-4 space-y-2">
              {simAnalysis.riskScores.slice(0, 4).map((sim) => {
                const orig = analysis?.riskScores.find(r => r.condition === sim.condition);
                const delta = sim.score - (orig?.score || 0);
                return (
                  <div key={sim.condition} className="flex items-center gap-3 text-xs">
                    <div className="w-44 truncate text-white/70">{sim.condition}</div>
                    <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", sim.riskLevel === "low" ? "bg-orange-500" : sim.riskLevel === "moderate" ? "bg-yellow-500" : sim.riskLevel === "high" ? "bg-orange-500" : "bg-red-500")}
                        style={{ width: `${sim.score}%` }}
                      />
                    </div>
                    <span className="font-mono text-white w-10 text-right">{sim.score}</span>
                    {delta !== 0 && (
                      <span className={cn("w-10 text-[10px] text-right", delta > 0 ? "text-red-300" : "text-lime-300")}>
                        {delta > 0 ? "+" : ""}{delta}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
