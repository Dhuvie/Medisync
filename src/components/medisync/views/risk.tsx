"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShieldAlert, TrendingUp, Heart, Brain, Activity, Droplet, Clock } from "lucide-react";
import { useMediSync } from "../store";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer,
} from "recharts";

const RISK_ICONS = {
  "Cardiovascular Disease (10-yr ASCVD)": Heart,
  "Ischemic Stroke": Brain,
  "Sepsis (in-hospital)": Activity,
  "Type 2 Diabetes Mellitus": Droplet,
  "Acute Kidney Injury": Droplet,
  "30-Day Mortality": Clock,
} as const;

const RISK_LEVEL_STYLES = {
  "low": { bg: "bg-orange-500/15", text: "text-lime-300", border: "border-orange-500/30" },
  "moderate": { bg: "bg-yellow-500/15", text: "text-yellow-300", border: "border-yellow-500/30" },
  "high": { bg: "bg-orange-500/15", text: "text-orange-300", border: "border-orange-500/30" },
  "very high": { bg: "bg-red-500/15", text: "text-red-300", border: "border-red-500/30" },
} as const;

export function RiskView() {
  const { analysis } = useMediSync();

  if (!analysis) return <Card className="glass p-12 text-center text-white/60">No analysis available.</Card>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Multi-Condition Risk Prediction</h1>
        <p className="mt-1 text-sm text-white/50">
          Validated clinical scores + ML ensemble predictions across {analysis.riskScores.length} conditions
        </p>
      </div>

      {}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {analysis.riskScores.map((risk, i) => {
          const Icon = RISK_ICONS[risk.condition as keyof typeof RISK_ICONS] || ShieldAlert;
          const style = RISK_LEVEL_STYLES[risk.riskLevel];
          return (
            <motion.div
              key={risk.condition}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={cn("glass overflow-hidden border", style.border)}>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", style.bg, style.text)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{risk.condition}</p>
                        <p className="text-[10px] text-white/40">{risk.model} · {risk.timeframe}</p>
                      </div>
                    </div>
                    <Badge className={cn("border", style.border, style.bg, style.text, "uppercase text-[10px]")}>
                      {risk.riskLevel}
                    </Badge>
                  </div>

                  <div className="mt-4 flex items-center gap-4">
                    {}
                    <div className="relative h-20 w-20 shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                          innerRadius="70%"
                          outerRadius="100%"
                          data={[{ value: risk.score, fill: risk.riskLevel === "low" ? "#8a9a5b" : risk.riskLevel === "moderate" ? "#eab308" : risk.riskLevel === "high" ? "#f97316" : "#ef4444" }]}
                          startAngle={90}
                          endAngle={-270}
                        >
                          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                          <RadialBar background={{ fill: "rgba(255,255,255,0.05)" }} dataKey="value" cornerRadius={8} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-white">{risk.score}</span>
                        <span className="text-[8px] uppercase tracking-wider text-white/40">/100</span>
                      </div>
                    </div>

                    {}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1.5">Top contributors</p>
                      <div className="space-y-1">
                        {risk.contributors.slice(0, 4).map((c, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px]">
                            <TrendingUp className="h-2.5 w-2.5 text-amber-400" />
                            <span className="text-white/70 flex-1 truncate">{c.factor}</span>
                            <span className="font-mono text-white/40">+{c.contribution}</span>
                          </div>
                        ))}
                        {risk.contributors.length === 0 && (
                          <p className="text-[11px] text-white/40">No significant contributors</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-md bg-white/[0.03] px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Recommendation</p>
                    <p className="text-[11px] text-white/70">{risk.recommendation}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {}
      <Card className="glass">
        <div className="border-b border-white/5 p-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-300" />
            <h3 className="text-sm font-semibold text-white">Admission & Resource Prediction</h3>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/40 mb-2">Predicted disposition</p>
              <div className="space-y-2">
                {(["Discharge", "Observation", "Admission", "ICU"] as const).map((d) => {
                  const active = analysis.admission.disposition === d;
                  return (
                    <div key={d} className={cn(
                      "flex items-center justify-between rounded-lg border px-3 py-2",
                      active ? "border-orange-500/40 bg-orange-500/10" : "border-white/5 bg-white/[0.02] opacity-60"
                    )}>
                      <span className={cn("text-sm", active ? "text-white font-medium" : "text-white/60")}>{d}</span>
                      {active && (
                        <Badge className="bg-orange-500/20 text-orange-300 border border-orange-500/30">
                          {analysis.admission.probability}%
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/40 mb-2">Decision drivers</p>
              <div className="space-y-1.5">
                {analysis.admission.contributors.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-md bg-white/[0.03] px-3 py-1.5 text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span className="text-white/70">{c}</span>
                  </div>
                ))}
                {analysis.admission.contributors.length === 0 && (
                  <p className="text-xs text-white/40">No significant drivers</p>
                )}
              </div>
            </div>

            {}
            <div className="space-y-3">
              <div className="rounded-lg bg-white/[0.03] p-3">
                <p className="text-[10px] uppercase tracking-wider text-white/40">Est. length of stay</p>
                <p className="text-2xl font-bold text-white">{analysis.admission.estimatedLOS} <span className="text-xs text-white/40">days</span></p>
              </div>
              <div className="rounded-lg bg-white/[0.03] p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] uppercase tracking-wider text-white/40">30-day readmission risk</p>
                  <span className="text-sm font-bold text-amber-300">{analysis.readmissionRisk}%</span>
                </div>
                <Progress value={analysis.readmissionRisk} className="h-1.5 bg-white/5" indicatorClassName="bg-gradient-to-r from-yellow-500 to-orange-500" />
              </div>
              <div className="rounded-lg bg-white/[0.03] p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] uppercase tracking-wider text-white/40">Mortality risk (30d)</p>
                  <span className={cn("text-sm font-bold", analysis.mortalityRisk > 20 ? "text-red-300" : "text-orange-300")}>{analysis.mortalityRisk}%</span>
                </div>
                <Progress value={analysis.mortalityRisk} className="h-1.5 bg-white/5" indicatorClassName="bg-gradient-to-r from-red-500 to-red-700" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
