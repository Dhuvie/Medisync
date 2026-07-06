"use client";

import { useMediSync } from "./store";
import { Plus, Trash2, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { PatientInput } from "@/lib/medical/types";

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
    age: 50,
    gender: "male",
    pregnant: false,
    symptoms: [],
    symptomDuration: "",
    severity: "moderate",
    medicalHistory: [],
    currentMedications: [],
    allergies: [],
    vitals: { heartRate: 80, systolicBP: 120, diastolicBP: 80, temperature: 37, respiratoryRate: 16, spo2: 98, bloodGlucose: 100, weightKg: 70, heightCm: 170, painScore: 0 },
    labs: { hemoglobin: 14, whiteBloodCells: 7, platelets: 250, sodium: 140, potassium: 4, creatinine: 1, bun: 15, glucose: 100, alt: 25, ast: 25, troponin: 0.02, crp: 2, esr: 10, inr: 1, hemoglobinA1c: 5.4 },
    lifestyle: { smoking: false, alcohol: "None", exercise: "Regular", diet: "Balanced" },
    travelHistory: "None",
    riskFactors: [],
    imagingSummary: "",
    notes: "",
  };
}

export function PatientSidebar() {
  const { patients, activePatientId, setActivePatient, addPatient, deletePatient, analyses, isAnalyzing } = useMediSync();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleAddPatient = () => {
    const p = newPatientTemplate();
    addPatient(p);
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
    <aside className="w-64 shrink-0 bg-[#1C202B] border-r-4 border-[#7107E7] flex flex-col h-screen sticky top-0">
      {}
      <div className="px-4 py-4 border-b-2 border-[#2A2F3D]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center bg-[#7107E7]" style={{ boxShadow: "2px 2px 0 #DFE7FF" }}>
            <Activity className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-xl text-[#DFE7FF]">MEDISYNC</span>
        </div>
      </div>

      {}
      <div className="p-3">
        <Button
          onClick={handleAddPatient}
          className="w-full bg-[#7107E7] text-white border-2 border-[#7107E7] hover:bg-[#DFE7FF] hover:text-[#7107E7] gap-2 label text-[10px]"
          style={{ boxShadow: "3px 3px 0 #DFE7FF" }}
        >
          <Plus className="h-3.5 w-3.5" /> ADD PATIENT
        </Button>
      </div>

      {}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-3">
        <p className="label text-[#DFE7FF]/40 px-2 mb-2">PATIENTS ({patients.length})</p>
        <div className="space-y-1.5">
          {patients.map((p) => {
            const initials = getInitials(p.name);
            const colorIdx = getColorIndex(p.id);
            const color = INITIAL_COLORS[colorIdx];
            const isActive = p.id === activePatientId;
            const analysis = analyses[p.id];
            const analyzingThis = isActive && isAnalyzing;

            return (
              <div
                key={p.id}
                className={cn(
                  "group flex items-center gap-2.5 p-2 border-2 transition-all cursor-pointer",
                  isActive
                    ? "bg-[#2A2F3D] border-[#7107E7]"
                    : "bg-transparent border-transparent hover:bg-[#2A2F3D]/50 hover:border-[#DFE7FF]/10"
                )}
                onClick={() => setActivePatient(p.id)}
              >
                {}
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center font-display text-sm"
                  style={{
                    background: color.bg,
                    color: color.fg,
                    boxShadow: "2px 2px 0 rgba(0,0,0,0.3)",
                  }}
                >
                  {initials}
                </div>

                {}
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm truncate font-medium", isActive ? "text-[#DFE7FF]" : "text-[#DFE7FF]/70")}>
                    {p.name || "Unnamed"}
                  </p>
                  <p className="text-[10px] text-[#DFE7FF]/40 font-mono">
                    {p.age}y {p.gender}
                    {analyzingThis && " · analyzing..."}
                    {!analyzingThis && analysis?.llmPowered === false && " · rule-based"}
                  </p>
                </div>

                {}
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                  className={cn(
                    "shrink-0 p-1 transition-colors",
                    confirmDelete === p.id
                      ? "bg-[#DC2626] text-white"
                      : "text-[#DFE7FF]/30 hover:text-[#DC2626] opacity-0 group-hover:opacity-100"
                  )}
                  title={confirmDelete === p.id ? "Click again to confirm" : "Delete patient"}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {}
      <div className="px-4 py-3 border-t-2 border-[#2A2F3D]">
        <p className="label text-[10px] text-[#DFE7FF]/40">DECISION SUPPORT ONLY</p>
      </div>
    </aside>
  );
}
