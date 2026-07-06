"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Activity, Sparkles, Menu, X, LayoutGrid, Stethoscope, Brain, Wrench } from "lucide-react";
import { useMediSync, initializeStore, type Zone } from "./store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { PatientInput } from "@/lib/medical/types";

const ZONES: { key: Zone; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "patient", label: "Patient", icon: Stethoscope },
  { key: "reasoning", label: "Reasoning", icon: Brain },
  { key: "tools", label: "Tools", icon: Wrench },
];

const INITIAL_COLORS = [
  { bg: "#7107E7", fg: "#FFFFFF" },
  { bg: "#1C202B", fg: "#DFE7FF" },
  { bg: "#16A34A", fg: "#FFFFFF" },
  { bg: "#D97706", fg: "#FFFFFF" },
  { bg: "#DC2626", fg: "#FFFFFF" },
  { bg: "#1C398E", fg: "#FFFFFF" },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
  return "?";
}

function getColorIndex(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  return Math.abs(hash) % INITIAL_COLORS.length;
}

function newPatientTemplate(): PatientInput {
  return {
    id: `PT-${Date.now().toString(36).toUpperCase()}`,
    name: "New Patient",
    age: 50, gender: "male", pregnant: false,
    symptoms: [], symptomDuration: "", severity: "moderate",
    medicalHistory: [], currentMedications: [], allergies: [],
    vitals: { heartRate: 80, systolicBP: 120, diastolicBP: 80, temperature: 37, respiratoryRate: 16, spo2: 98, bloodGlucose: 100, weightKg: 70, heightCm: 170, painScore: 0 },
    labs: { hemoglobin: 14, whiteBloodCells: 7, platelets: 250, sodium: 140, potassium: 4, creatinine: 1, bun: 15, glucose: 100, alt: 25, ast: 25, troponin: 0.02, crp: 2, esr: 10, inr: 1, hemoglobinA1c: 5.4 },
    lifestyle: { smoking: false, alcohol: "None", exercise: "Regular", diet: "Balanced" },
    travelHistory: "None", riskFactors: [], imagingSummary: "", notes: "",
  };
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const {
    zone, setZone, onboarding, patients, activePatientId, analyses, isAnalyzing,
    llmPowered, addPatient, setActivePatient, deletePatient,
  } = useMediSync();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => { initializeStore(); }, []);

  if (onboarding || patients.length === 0) return <>{children}</>;

  const activePatient = patients.find(p => p.id === activePatientId);
  const analysis = activePatientId ? analyses[activePatientId] : null;

  const handleAddPatient = () => {
    addPatient(newPatientTemplate());
    setSidebarOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      deletePatient(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <>

      <aside className={cn("sidebar", sidebarOpen && "open")}>

        <div className="flex items-center gap-2.5 px-4 py-4 border-b-2 border-[#2A2F3D]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#7107E7]" style={{ boxShadow: "2px 2px 0 #DFE7FF" }}>
            <Activity className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-lg text-[#DFE7FF]">MEDISYNC</span>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto md:hidden text-[#DFE7FF]/60 hover:text-[#DFE7FF]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-3">
          <button
            onClick={handleAddPatient}
            className="w-full flex items-center justify-center gap-2 p-2.5 bg-[#7107E7] text-white border-2 border-[#7107E7] hover:bg-[#DFE7FF] hover:text-[#7107E7] transition-colors"
            style={{ boxShadow: "2px 2px 0 #DFE7FF" }}
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span className="label text-[10px]">ADD PATIENT</span>
          </button>
        </div>

        <div className="px-2 pb-2 flex-1">
          <p className="label text-[#DFE7FF]/40 px-2 mb-2">PATIENTS ({patients.length})</p>
          <div className="space-y-1.5">
            {patients.map((p) => {
              const initials = getInitials(p.name);
              const colorIdx = getColorIndex(p.id);
              const color = INITIAL_COLORS[colorIdx];
              const isActive = p.id === activePatientId;
              const analyzingThis = isActive && isAnalyzing;

              return (
                <div
                  key={p.id}
                  className={cn(
                    "group flex items-center gap-2.5 p-2 border-2 transition-all cursor-pointer",
                    isActive ? "bg-[#2A2F3D] border-[#7107E7]" : "bg-transparent border-transparent hover:bg-[#2A2F3D]/50"
                  )}
                  onClick={() => { setActivePatient(p.id); setSidebarOpen(false); }}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center font-display text-sm"
                    style={{ background: color.bg, color: color.fg, boxShadow: "2px 2px 0 rgba(0,0,0,0.3)" }}
                  >
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm truncate font-medium", isActive ? "text-[#DFE7FF]" : "text-[#DFE7FF]/70")}>
                      {p.name || "Unnamed"}
                    </p>
                    <p className="text-[10px] text-[#DFE7FF]/40 font-mono">
                      {p.age}y {p.gender}{analyzingThis ? " · analyzing..." : ""}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                    className={cn(
                      "shrink-0 p-1 transition-all",
                      confirmDelete === p.id ? "bg-[#DC2626] text-white" : "text-[#DFE7FF]/30 hover:text-[#DC2626] opacity-0 group-hover:opacity-100"
                    )}
                    title={confirmDelete === p.id ? "Click again to confirm" : "Delete"}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-4 py-2 border-t-2 border-[#2A2F3D]">
          <p className="label text-[9px] text-[#DFE7FF]/40">DECISION SUPPORT ONLY</p>
        </div>
      </aside>

      {sidebarOpen && <div className="drawer-overlay md:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="main-content">

        <header className="app-header">
          <div className="px-3 sm:px-4 md:px-6">
            <div className="flex h-14 items-center justify-between gap-2">

              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden text-[#DFE7FF] p-1.5 hover:bg-white/5"
                  title="Open patient list"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div className="flex items-baseline gap-2 min-w-0">
                  <span className="font-display text-base sm:text-lg text-[#DFE7FF] truncate">{activePatient?.name}</span>
                  <span className="label text-[#DFE7FF]/30 hidden lg:inline shrink-0">{activePatient?.id}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {(isAnalyzing || (analysis && llmPowered)) && (
                  <div className={cn(
                    "flex items-center gap-1.5 px-2 py-1 border-2",
                    isAnalyzing ? "bg-[#7107E7]/20 border-[#7107E7]" : "bg-[#16A34A]/20 border-[#16A34A]"
                  )}>
                    <span className={cn("piece", isAnalyzing ? "piece-purple" : "piece-green")} style={{ width: 8, height: 8 }} />
                    <span className="label text-[8px] sm:text-[9px] text-[#DFE7FF] hidden sm:inline">{isAnalyzing ? "ANALYZING" : "LLM DONE"}</span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { useMediSync.getState().analyze(); toast.success("RE-ANALYZING..."); }}
                  disabled={isAnalyzing}
                  className="text-[#DFE7FF] hover:text-[#7107E7] hover:bg-white/5 gap-1.5 px-2"
                >
                  <Sparkles className={cn("h-3.5 w-3.5", isAnalyzing && "animate-pulse")} />
                  <span className="hidden sm:inline label text-[10px]">{isAnalyzing ? "ANALYZING" : "RE-ANALYZE"}</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 pb-24">
          <motion.div
            key={zone + (activePatientId || "")}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="zone-transition"
          >
            {children}
          </motion.div>
        </main>
      </div>

      <div className="dock">
        {ZONES.map((z) => {
          const Icon = z.icon;
          const active = zone === z.key;
          return (
            <button
              key={z.key}
              onClick={() => setZone(z.key)}
              className={cn("dock-item", active && "active")}
              title={z.label}
            >
              <Icon className="dock-icon h-5 w-5 sm:h-6 sm:w-6" />
              <span className="dock-label">{z.label}</span>
              <span className="dock-dot" />
            </button>
          );
        })}
      </div>
    </>
  );
}
