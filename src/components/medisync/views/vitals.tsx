"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeartPulse, Activity, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";
import { useMediSync } from "../store";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Area, AreaChart,
} from "recharts";

export function VitalsView() {
  const { analysis, patient } = useMediSync();

  if (!analysis) return <Card className="glass p-12 text-center text-white/60">No analysis available.</Card>;

  const abnormal = analysis.vitalAnalysis.filter(v => v.status !== "normal");
  const critical = analysis.vitalAnalysis.filter(v => v.status.includes("critical"));

  const trendData = ["6h", "5h", "4h", "3h", "2h", "1h", "now"].map((t, i) => ({
    time: t,
    hr: patient.vitals.heartRate + (Math.sin(i) * 4) - i,
    sbp: patient.vitals.systolicBP + (Math.cos(i) * 6),
    spo2: patient.vitals.spo2 - Math.abs(i - 3) + (Math.random() * 1),
    temp: patient.vitals.temperature + (Math.sin(i) * 0.2),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Vital Sign Analysis</h1>
          <p className="mt-1 text-sm text-white/50">Continuous monitoring with abnormality detection</p>
        </div>
        {critical.length > 0 && (
          <Badge className="border-red-500/30 bg-red-500/10 text-red-300 pulse-critical">
            <AlertTriangle className="mr-1 h-3 w-3" />
            {critical.length} critical
          </Badge>
        )}
      </div>

      {}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {analysis.vitalAnalysis.map((v, i) => {
          const isCritical = v.status.includes("critical");
          const isAbnormal = v.status !== "normal";
          const isLow = v.status === "low" || v.status === "critical-low";

          return (
            <motion.div
              key={v.metric}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className={cn(
                "glass overflow-hidden",
                isCritical && "border-red-500/30 pulse-critical",
                isAbnormal && !isCritical && "border-amber-500/20"
              )}>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-wider text-white/40">{v.metric}</p>
                    {isCritical ? (
                      <AlertTriangle className="h-3 w-3 text-red-400" />
                    ) : isAbnormal ? (
                      isLow ? <TrendingDown className="h-3 w-3 text-amber-400" /> : <TrendingUp className="h-3 w-3 text-amber-400" />
                    ) : (
                      <Activity className="h-3 w-3 text-amber-400" />
                    )}
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className={cn(
                      "text-2xl font-bold",
                      isCritical ? "text-red-300" : isAbnormal ? "text-amber-300" : "text-white"
                    )}>
                      {v.value}
                    </span>
                    <span className="text-[10px] text-white/40">{v.unit}</span>
                  </div>
                  <p className="text-[10px] text-white/40 mt-0.5">Normal: {v.normalRange}</p>
                  <div className={cn(
                    "mt-2 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                    isCritical ? "bg-red-500/20 text-red-300" :
                    isAbnormal ? "bg-amber-500/20 text-amber-300" :
                    "bg-orange-500/20 text-lime-300"
                  )}>
                    {v.status}
                  </div>
                  <p className="mt-1.5 text-[10px] text-white/50">{v.interpretation}</p>
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
            <HeartPulse className="h-4 w-4 text-red-300" />
            <h3 className="text-sm font-semibold text-white">Vital Sign Trends (6 hours)</h3>
            <Badge variant="outline" className="ml-auto border-orange-500/30 text-lime-300">Live monitoring</Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <div>
            <p className="text-xs text-white/60 mb-2">Heart Rate & Blood Pressure</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" fontSize={10} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: "rgba(20, 20, 35, 0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                <ReferenceLine y={100} stroke="rgba(255,200,100,0.3)" strokeDasharray="3 3" label={{ value: "Tachy", fontSize: 9, fill: "rgba(255,200,100,0.5)" }} />
                <Line type="monotone" dataKey="hr" stroke="#ef4444" strokeWidth={2} dot={false} name="HR" />
                <Line type="monotone" dataKey="sbp" stroke="#d97757" strokeWidth={2} dot={false} name="SBP" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p className="text-xs text-white/60 mb-2">SpO2 & Temperature</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" fontSize={10} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: "rgba(20, 20, 35, 0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                <ReferenceLine y={92} stroke="rgba(255,100,100,0.3)" strokeDasharray="3 3" />
                <defs>
                  <linearGradient id="spo2grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c8983c" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#c8983c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="spo2" stroke="#c8983c" strokeWidth={2} fill="url(#spo2grad)" name="SpO2" />
                <Line type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} dot={false} name="Temp" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {}
      <Card className="glass">
        <div className="border-b border-white/5 p-4">
          <h3 className="text-sm font-semibold text-white">Laboratory Value Analysis</h3>
          <p className="text-xs text-white/40">Reference range comparison with flagging</p>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-wider text-white/40">
                <th className="p-3 text-left">Test</th>
                <th className="p-3 text-left">Value</th>
                <th className="p-3 text-left">Reference Range</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Interpretation</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Hemoglobin", value: patient.labs.hemoglobin, unit: "g/dL", range: "13.5–17.5", low: 13.5, high: 17.5, critLow: 7, critHigh: 20 },
                { name: "WBC", value: patient.labs.whiteBloodCells, unit: "K/µL", range: "4.0–11.0", low: 4, high: 11, critLow: 1.5, critHigh: 30 },
                { name: "Platelets", value: patient.labs.platelets, unit: "K/µL", range: "150–400", low: 150, high: 400, critLow: 50, critHigh: 1000 },
                { name: "Sodium", value: patient.labs.sodium, unit: "mEq/L", range: "135–145", low: 135, high: 145, critLow: 120, critHigh: 160 },
                { name: "Potassium", value: patient.labs.potassium, unit: "mEq/L", range: "3.5–5.0", low: 3.5, high: 5.0, critLow: 2.5, critHigh: 6.5 },
                { name: "Creatinine", value: patient.labs.creatinine, unit: "mg/dL", range: "0.6–1.3", low: 0.6, high: 1.3, critLow: 0, critHigh: 5 },
                { name: "BUN", value: patient.labs.bun, unit: "mg/dL", range: "7–20", low: 7, high: 20, critLow: 0, critHigh: 100 },
                { name: "Glucose", value: patient.labs.glucose, unit: "mg/dL", range: "70–99", low: 70, high: 99, critLow: 40, critHigh: 500 },
                { name: "ALT", value: patient.labs.alt, unit: "U/L", range: "7–56", low: 7, high: 56, critLow: 0, critHigh: 1000 },
                { name: "AST", value: patient.labs.ast, unit: "U/L", range: "10–40", low: 10, high: 40, critLow: 0, critHigh: 1000 },
                { name: "Troponin", value: patient.labs.troponin, unit: "ng/mL", range: "0–0.04", low: 0, high: 0.04, critLow: 0, critHigh: 1 },
                { name: "CRP", value: patient.labs.crp, unit: "mg/L", range: "0–3", low: 0, high: 3, critLow: 0, critHigh: 100 },
                { name: "HbA1c", value: patient.labs.hemoglobinA1c, unit: "%", range: "4.0–5.6", low: 4, high: 5.6, critLow: 0, critHigh: 14 },
                { name: "INR", value: patient.labs.inr, unit: "", range: "0.8–1.2", low: 0.8, high: 1.2, critLow: 0, critHigh: 5 },
              ].map((lab) => {
                let status = "normal";
                let statusColor = "bg-orange-500/20 text-lime-300";
                if (lab.value < lab.critLow || lab.value > lab.critHigh) {
                  status = "critical";
                  statusColor = "bg-red-500/20 text-red-300";
                } else if (lab.value < lab.low) {
                  status = "low";
                  statusColor = "bg-amber-500/20 text-amber-300";
                } else if (lab.value > lab.high) {
                  status = "high";
                  statusColor = "bg-amber-500/20 text-amber-300";
                }
                return (
                  <tr key={lab.name} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                    <td className="p-3 text-white/80">{lab.name}</td>
                    <td className="p-3 font-mono text-white">
                      {lab.value} <span className="text-[10px] text-white/40">{lab.unit}</span>
                    </td>
                    <td className="p-3 text-white/50 text-xs font-mono">{lab.range} {lab.unit}</td>
                    <td className="p-3">
                      <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium uppercase", statusColor)}>
                        {status}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-white/50">
                      {status === "critical" ? "Immediate intervention required" :
                       status === "high" ? "Above reference range" :
                       status === "low" ? "Below reference range" :
                       "Within normal limits"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
