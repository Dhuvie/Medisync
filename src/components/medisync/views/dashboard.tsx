"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Activity, Users, BedDouble, AlertTriangle, Clock, TrendingUp,
  Heart, Brain, Stethoscope, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, RadialBarChart, RadialBar,
  LineChart, Line, CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

const criticalPatients = [
  { id: "PT-2847", name: "Robert Chen", age: 67, complaint: "Chest pain, diaphoretic", triage: "red", wait: "0m", loS: "2h", risk: 87 },
  { id: "PT-2845", name: "James Wilson", age: 72, complaint: "Confusion, fever, hypoxic", triage: "red", wait: "8m", loS: "1h", risk: 92 },
  { id: "PT-2841", name: "Maria Gonzalez", age: 54, complaint: "SOB, fever, cough", triage: "orange", wait: "23m", loS: "3h", risk: 64 },
  { id: "PT-2838", name: "David Kim", age: 58, complaint: "Weakness, slurred speech", triage: "orange", wait: "41m", loS: "5h", risk: 71 },
  { id: "PT-2832", name: "Aisha Patel", age: 34, complaint: "Polyuria, weight loss", triage: "yellow", wait: "1h 12m", loS: "8h", risk: 28 },
];

const triageDistribution = [
  { name: "Red", value: 4, color: "#c4503c" },
  { name: "Orange", value: 8, color: "#d97757" },
  { name: "Yellow", value: 17, color: "#c8983c" },
  { name: "Green", value: 26, color: "#8a9a5b" },
  { name: "Blue", value: 14, color: "#6b8e9e" },
];

const hourlyArrivals = [
  { hour: "00", arrivals: 6, dispositions: 4 },
  { hour: "02", arrivals: 4, dispositions: 5 },
  { hour: "04", arrivals: 3, dispositions: 3 },
  { hour: "06", arrivals: 5, dispositions: 4 },
  { hour: "08", arrivals: 12, dispositions: 6 },
  { hour: "10", arrivals: 18, dispositions: 10 },
  { hour: "12", arrivals: 22, dispositions: 14 },
  { hour: "14", arrivals: 19, dispositions: 16 },
  { hour: "16", arrivals: 17, dispositions: 18 },
  { hour: "18", arrivals: 14, dispositions: 15 },
  { hour: "20", arrivals: 9, dispositions: 12 },
  { hour: "22", arrivals: 7, dispositions: 8 },
];

const bedOccupancy = [
  { unit: "ED", occupied: 38, capacity: 42, pct: 90 },
  { unit: "ICU", occupied: 18, capacity: 24, pct: 75 },
  { unit: "CCU", occupied: 12, capacity: 14, pct: 86 },
  { unit: "Med-Surg", occupied: 124, capacity: 180, pct: 69 },
  { unit: "Tele", occupied: 32, capacity: 40, pct: 80 },
  { unit: "Obs", occupied: 8, capacity: 12, pct: 67 },
];

const losData = [
  { day: "Mon", los: 4.2, target: 4.0 },
  { day: "Tue", los: 3.8, target: 4.0 },
  { day: "Wed", los: 4.5, target: 4.0 },
  { day: "Thu", los: 4.1, target: 4.0 },
  { day: "Fri", los: 4.7, target: 4.0 },
  { day: "Sat", los: 4.3, target: 4.0 },
  { day: "Sun", los: 3.9, target: 4.0 },
];

const statCards = [
  { label: "Active Patients", value: "69", delta: "+12%", trend: "up", icon: Users, color: "from-orange-500/20 to-orange-500/5", text: "text-orange-300" },
  { label: "Critical (Red)", value: "4", delta: "+2", trend: "up", icon: AlertTriangle, color: "from-red-500/20 to-red-500/5", text: "text-red-300" },
  { label: "Avg Wait Time", value: "47m", delta: "-8m", trend: "down", icon: Clock, color: "from-amber-500/20 to-amber-500/5", text: "text-amber-300" },
  { label: "Bed Occupancy", value: "78%", delta: "+5%", trend: "up", icon: BedDouble, color: "from-yellow-500/20 to-yellow-500/5", text: "text-yellow-300" },
];

const TERRACOTTA_CHART = "#d97757";
const AMBER_CHART = "#c8983c";
const CLAY_CHART = "#b8693d";

const tooltipStyle = {
  backgroundColor: "rgba(28, 22, 18, 0.92)",
  border: "1px solid rgba(217, 119, 87, 0.25)",
  borderRadius: "8px",
  color: "#f5e6d3",
};

export function DashboardView() {
  return (
    <div className="space-y-6">
      {}
      <div className="relative overflow-hidden rounded-2xl glass-strong p-6">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              {}
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              <span className="text-xs font-medium uppercase tracking-widest text-orange-300">Real-time ED Status</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Emergency Department Operations
            </h1>
            <p className="mt-1 text-sm text-white/50">
              St. Marion General Hospital · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <div className="flex gap-3">
            <div className="rounded-xl glass-subtle px-4 py-3 text-center">
              <p className="text-[10px] uppercase tracking-wider text-white/40">Predicted Admissions (24h)</p>
              <p className="text-2xl font-bold text-orange-300">23</p>
              <p className="text-[10px] text-white/40">±3 (95% CI)</p>
            </div>
            <div className="rounded-xl glass-subtle px-4 py-3 text-center">
              <p className="text-[10px] uppercase tracking-wider text-white/40">AI Predicted ICU Need</p>
              <p className="text-2xl font-bold text-amber-300">6</p>
              <p className="text-[10px] text-white/40">ML ensemble · v2.4</p>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`relative overflow-hidden bg-gradient-to-br ${stat.color} backdrop-blur-xl`}>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-white/60">{stat.label}</p>
                      <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className={`rounded-lg p-2 ${stat.text} bg-white/5`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3 text-amber-400" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-amber-400" />
                    )}
                    <span className="text-white/60">{stat.delta} vs last hour</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {}
        <Card className="glass lg:col-span-2">
          <div className="border-b border-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Patient Flow (24h)</h3>
                <p className="text-xs text-white/40">Arrivals vs Dispositions</p>
              </div>
              <Badge variant="outline" className="border-orange-500/30 text-orange-300">Live</Badge>
            </div>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={hourlyArrivals}>
                <defs>
                  <linearGradient id="arrivalsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={TERRACOTTA_CHART} stopOpacity={0.6} />
                    <stop offset="95%" stopColor={TERRACOTTA_CHART} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="dispGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={AMBER_CHART} stopOpacity={0.6} />
                    <stop offset="95%" stopColor={AMBER_CHART} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="hour" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="arrivals" stroke={TERRACOTTA_CHART} strokeWidth={2} fill="url(#arrivalsGrad)" name="Arrivals" />
                <Area type="monotone" dataKey="dispositions" stroke={AMBER_CHART} strokeWidth={2} fill="url(#dispGrad)" name="Dispositions" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {}
        <Card className="glass">
          <div className="border-b border-white/5 p-4">
            <h3 className="text-sm font-semibold text-white">Triage Distribution</h3>
            <p className="text-xs text-white/40">Current ED census</p>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={triageDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {triageDistribution.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} stroke="rgba(28,22,18,0.5)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-5 gap-1">
              {triageDistribution.map((t) => (
                <div key={t.name} className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="h-2 w-2 rounded-full" style={{ background: t.color }} />
                    <span className="text-[10px] text-white/40">{t.name}</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{t.value}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {}
        <Card className="glass">
          <div className="border-b border-white/5 p-4">
            <h3 className="text-sm font-semibold text-white">Bed Occupancy</h3>
            <p className="text-xs text-white/40">By unit</p>
          </div>
          <div className="space-y-3 p-4">
            {bedOccupancy.map((bed) => (
              <div key={bed.unit}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-white/70">{bed.unit}</span>
                  <span className="text-white/50">{bed.occupied}/{bed.capacity} · <span className={bed.pct > 85 ? "text-red-300" : bed.pct > 75 ? "text-amber-300" : "text-lime-300"}>{bed.pct}%</span></span>
                </div>
                <Progress
                  value={bed.pct}
                  className="h-1.5 bg-white/5"
                  // @ts-ignore - style override
                  style={{
                    background: "rgba(255,255,255,0.05)",
                  }}
                  indicatorClassName={bed.pct > 85 ? "bg-red-500" : bed.pct > 75 ? "bg-amber-500" : "bg-orange-500"}
                />
              </div>
            ))}
          </div>
        </Card>

        {}
        <Card className="glass lg:col-span-2">
          <div className="flex items-center justify-between border-b border-white/5 p-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Critical Patients</h3>
              <p className="text-xs text-white/40">AI risk-stratified · sorted by acuity</p>
            </div>
            <Badge variant="outline" className="border-red-500/30 text-red-300">
              <AlertTriangle className="mr-1 h-3 w-3" />
              {criticalPatients.filter(p => p.triage === "red").length} critical
            </Badge>
          </div>
          <div className="max-h-96 overflow-y-auto scrollbar-thin">
            {criticalPatients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center gap-3 border-b border-white/5 p-3 last:border-0 hover:bg-white/[0.02]"
              >
                <div className={`h-9 w-1 rounded-full ${
                  patient.triage === "red" ? "bg-red-500 pulse-critical" :
                  patient.triage === "orange" ? "bg-orange-500" :
                  "bg-amber-500"
                }`} />
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/20 to-amber-700/20 text-xs font-semibold text-white">
                  {patient.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-white">{patient.name}</p>
                    <span className="text-[10px] text-white/40">{patient.age}y</span>
                  </div>
                  <p className="truncate text-xs text-white/50">{patient.complaint}</p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-[10px] uppercase tracking-wider text-white/40">Wait</p>
                  <p className="text-xs font-medium text-white/70">{patient.wait}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-white/40">AI Risk</p>
                  <p className={`text-sm font-bold ${
                    patient.risk > 80 ? "text-red-300" : patient.risk > 60 ? "text-orange-300" : "text-amber-300"
                  }`}>{patient.risk}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="glass">
          <div className="border-b border-white/5 p-4">
            <h3 className="text-sm font-semibold text-white">Length of Stay Trend</h3>
            <p className="text-xs text-white/40">Avg LOS (days) vs target</p>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={losData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="los" stroke={TERRACOTTA_CHART} strokeWidth={2.5} dot={{ fill: TERRACOTTA_CHART, r: 4 }} name="Actual LOS" />
                <Line type="monotone" dataKey="target" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} strokeDasharray="5 5" name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass">
          <div className="border-b border-white/5 p-4">
            <h3 className="text-sm font-semibold text-white">Department Workload</h3>
            <p className="text-xs text-white/40">Real-time capacity utilization</p>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={220}>
              <RadialBarChart
                innerRadius="30%"
                outerRadius="100%"
                data={[
                  { name: "ED", value: 90, fill: "#c4503c" },
                  { name: "ICU", value: 75, fill: "#d97757" },
                  { name: "CCU", value: 86, fill: "#c8983c" },
                  { name: "Med-Surg", value: 69, fill: "#8a9a5b" },
                ]}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar background={{ fill: "rgba(255,255,255,0.05)" }} dataKey="value" cornerRadius={6} />
                <Tooltip contentStyle={tooltipStyle} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
