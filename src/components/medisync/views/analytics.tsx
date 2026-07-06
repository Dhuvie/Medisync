"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Activity, Calendar, AlertCircle } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, RadialBarChart, RadialBar,
} from "recharts";
import { motion } from "framer-motion";

const diseaseTrends = [
  { month: "Jan", pneumonia: 42, sepsis: 18, stroke: 24, mi: 32, covid: 65 },
  { month: "Feb", pneumonia: 38, sepsis: 20, stroke: 26, mi: 28, covid: 58 },
  { month: "Mar", pneumonia: 45, sepsis: 22, stroke: 28, mi: 35, covid: 42 },
  { month: "Apr", pneumonia: 52, sepsis: 25, stroke: 30, mi: 38, covid: 28 },
  { month: "May", pneumonia: 48, sepsis: 23, stroke: 32, mi: 30, covid: 22 },
  { month: "Jun", pneumonia: 56, sepsis: 28, stroke: 35, mi: 42, covid: 35 },
  { month: "Jul", pneumonia: 64, sepsis: 32, stroke: 38, mi: 45, covid: 48 },
  { month: "Aug", pneumonia: 68, sepsis: 30, stroke: 36, mi: 48, covid: 52 },
  { month: "Sep", pneumonia: 58, sepsis: 26, stroke: 34, mi: 40, covid: 38 },
  { month: "Oct", pneumonia: 62, sepsis: 28, stroke: 36, mi: 44, covid: 42 },
  { month: "Nov", pneumonia: 72, sepsis: 34, stroke: 40, mi: 52, covid: 58 },
  { month: "Dec", pneumonia: 78, sepsis: 38, stroke: 42, mi: 56, covid: 62 },
];

const seasonality = [
  { name: "Winter", value: 285, color: "#6b8e9e" },
  { name: "Spring", value: 198, color: "#8a9a5b" },
  { name: "Summer", value: 215, color: "#f59e0b" },
  { name: "Fall", value: 232, color: "#c8983c" },
];

const mortalityData = [
  { condition: "Sepsis", rate: 22, target: 18 },
  { condition: "Stroke", rate: 14, target: 12 },
  { condition: "MI/ACS", rate: 8, target: 9 },
  { condition: "Pneumonia", rate: 6, target: 7 },
  { condition: "AKI", rate: 11, target: 10 },
  { condition: "PE", rate: 9, target: 8 },
];

const readmissionCauses = [
  { cause: "CHF exacerbation", count: 28, pct: 22 },
  { cause: "Sepsis recurrence", count: 22, pct: 17 },
  { cause: "Diabetic ketoacidosis", count: 18, pct: 14 },
  { cause: "AKI", count: 16, pct: 13 },
  { cause: "Pneumonia", count: 14, pct: 11 },
  { cause: "Stroke complications", count: 12, pct: 9 },
  { cause: "Other", count: 18, pct: 14 },
];

const medicationUsage = [
  { name: "Antibiotics", value: 1240, color: "#d97757" },
  { name: "Anticoagulants", value: 680, color: "#c8983c" },
  { name: "Antihypertensives", value: 1450, color: "#f59e0b" },
  { name: "Insulin/Oral hypoglycemics", value: 920, color: "#c4503c" },
  { name: "Statins", value: 1180, color: "#6b8e9e" },
  { name: "Analgesics", value: 1620, color: "#8a9a5b" },
];

export function AnalyticsView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Clinical Analytics</h1>
        <p className="mt-1 text-sm text-white/50">
          Disease trends · Seasonality · Outcomes · Medication utilization · Real-time epidemic detection
        </p>
      </div>

      {}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "YTD Admissions", value: "8,420", delta: "+12%", trend: "up", color: "text-orange-300" },
          { label: "Avg LOS (days)", value: "4.2", delta: "-0.3", trend: "down", color: "text-lime-300" },
          { label: "30-day Readmission", value: "12.4%", delta: "-1.8%", trend: "down", color: "text-lime-300" },
          { label: "Mortality Rate", value: "3.8%", delta: "-0.4%", trend: "down", color: "text-lime-300" },
        ].map((kpi) => (
          <Card key={kpi.label} className="glass">
            <div className="p-4">
              <p className="text-[10px] uppercase tracking-wider text-white/40">{kpi.label}</p>
              <p className="mt-1 text-2xl font-bold text-white">{kpi.value}</p>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <TrendingUp className={`h-3 w-3 ${kpi.color}`} />
                <span className={kpi.color}>{kpi.delta}</span>
                <span className="text-white/40">vs LY</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {}
      <Card className="glass">
        <div className="border-b border-white/5 p-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-orange-300" />
            <h3 className="text-sm font-semibold text-white">Disease Trends (12 months)</h3>
            <Badge variant="outline" className="ml-auto border-white/10 text-white/60">5 conditions tracked</Badge>
          </div>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={diseaseTrends}>
              <defs>
                {[
                  { key: "pneumonia", color: "#d97757" },
                  { key: "sepsis", color: "#c4503c" },
                  { key: "stroke", color: "#c8983c" },
                  { key: "mi", color: "#f59e0b" },
                  { key: "covid", color: "#6b8e9e" },
                ].map((s) => (
                  <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={s.color} stopOpacity={0.5} />
                    <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: "rgba(20, 20, 35, 0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
              <Area type="monotone" dataKey="pneumonia" stroke="#d97757" strokeWidth={2} fill="url(#grad-pneumonia)" name="Pneumonia" />
              <Area type="monotone" dataKey="sepsis" stroke="#c4503c" strokeWidth={2} fill="url(#grad-sepsis)" name="Sepsis" />
              <Area type="monotone" dataKey="stroke" stroke="#c8983c" strokeWidth={2} fill="url(#grad-stroke)" name="Stroke" />
              <Area type="monotone" dataKey="mi" stroke="#f59e0b" strokeWidth={2} fill="url(#grad-mi)" name="MI/ACS" />
              <Area type="monotone" dataKey="covid" stroke="#6b8e9e" strokeWidth={2} fill="url(#grad-covid)" name="COVID-19" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {}
        <Card className="glass">
          <div className="border-b border-white/5 p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-300" />
              <h3 className="text-sm font-semibold text-white">Seasonality Distribution</h3>
            </div>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={seasonality} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={4} dataKey="value">
                  {seasonality.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} stroke="rgba(15,15,25,0.5)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "rgba(20, 20, 35, 0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {seasonality.map((s) => (
                <div key={s.name} className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                    <span className="text-[10px] text-white/60">{s.name}</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {}
        <Card className="glass">
          <div className="border-b border-white/5 p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-300" />
              <h3 className="text-sm font-semibold text-white">Mortality Rate by Condition</h3>
            </div>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={mortalityData} layout="vertical" margin={{ left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={10} unit="%" />
                <YAxis type="category" dataKey="condition" stroke="rgba(255,255,255,0.7)" fontSize={11} width={60} />
                <Tooltip contentStyle={{ backgroundColor: "rgba(20, 20, 35, 0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                <Bar dataKey="rate" fill="#c4503c" radius={[0, 4, 4, 0]} name="Actual (%)" />
                <Bar dataKey="target" fill="rgba(255,255,255,0.15)" radius={[0, 4, 4, 0]} name="Target (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {}
        <Card className="glass">
          <div className="border-b border-white/5 p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-300" />
              <h3 className="text-sm font-semibold text-white">30-Day Readmission Causes</h3>
            </div>
          </div>
          <div className="p-4 space-y-2">
            {readmissionCauses.map((r, i) => (
              <div key={r.cause} className="flex items-center gap-3">
                <span className="text-xs text-white/70 w-44 truncate">{r.cause}</span>
                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${r.pct * 3}%` }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                  />
                </div>
                <span className="text-xs font-mono text-white/60 w-12 text-right">{r.pct}%</span>
                <span className="text-[10px] text-white/40 w-10 text-right">n={r.count}</span>
              </div>
            ))}
          </div>
        </Card>

        {}
        <Card className="glass">
          <div className="border-b border-white/5 p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-lime-300" />
              <h3 className="text-sm font-semibold text-white">Medication Utilization (YTD)</h3>
            </div>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={medicationUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={9} angle={-15} textAnchor="end" height={50} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: "rgba(20, 20, 35, 0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {medicationUsage.map((m, i) => (
                    <Cell key={i} fill={m.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {}
      <Card className="glass border-amber-500/20">
        <div className="border-b border-white/5 p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            </span>
            <h3 className="text-sm font-semibold text-white">Real-time Epidemic Detection</h3>
            <Badge variant="outline" className="ml-auto border-amber-500/30 text-amber-300">AI Surveillance Active</Badge>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-amber-500/5 p-3 ring-1 ring-amber-500/10">
              <p className="text-[10px] uppercase tracking-wider text-amber-300">Influenza-like illness</p>
              <p className="text-2xl font-bold text-white mt-1">+34%</p>
              <p className="text-[10px] text-white/40">vs baseline (3-week rolling avg)</p>
              <p className="text-[10px] text-amber-300 mt-1">⚠ Above epidemic threshold</p>
            </div>
            <div className="rounded-lg bg-orange-500/5 p-3 ring-1 ring-orange-500/10">
              <p className="text-[10px] uppercase tracking-wider text-lime-300">COVID-19 positivity</p>
              <p className="text-2xl font-bold text-white mt-1">8.2%</p>
              <p className="text-[10px] text-white/40">Within seasonal baseline</p>
              <p className="text-[10px] text-lime-300 mt-1">✓ Normal range</p>
            </div>
            <div className="rounded-lg bg-sky-500/5 p-3 ring-1 ring-sky-500/10">
              <p className="text-[10px] uppercase tracking-wider text-sky-300">Gastroenteritis</p>
              <p className="text-2xl font-bold text-white mt-1">+12%</p>
              <p className="text-[10px] text-white/40">Slight increase detected</p>
              <p className="text-[10px] text-sky-300 mt-1">→ Monitor trend</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
