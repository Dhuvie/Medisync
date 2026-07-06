"use client";

import { useState } from "react";
import { useMediSync } from "./store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Activity, Sparkles, ArrowRight, Heart, FlaskConical, Pill, AlertCircle } from "lucide-react";
import type { PatientInput, Gender, Severity } from "@/lib/medical/types";
import { cn } from "@/lib/utils";

const QUICK_SYMPTOMS = ["Chest pain", "Shortness of breath", "Fever", "Cough", "Headache", "Fatigue", "Nausea", "Dizziness", "Palpitations", "Syncope", "Weakness", "Confusion"];

function newPatient(): PatientInput {
  return {
    id: `PT-${Date.now().toString(36).toUpperCase()}`,
    name: "",
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

export function Onboarding() {
  const { addPatient } = useMediSync();
  const [patient, setPatient] = useState<PatientInput>(newPatient);
  const [symptomInput, setSymptomInput] = useState("");
  const [medInput, setMedInput] = useState("");
  const [allergyInput, setAllergyInput] = useState("");
  const [historyInput, setHistoryInput] = useState("");

  const update = <K extends keyof PatientInput>(key: K, value: PatientInput[K]) => setPatient(p => ({ ...p, [key]: value }));
  const updateVital = (key: keyof PatientInput["vitals"], value: number) => setPatient(p => ({ ...p, vitals: { ...p.vitals, [key]: value } }));
  const updateLab = (key: keyof PatientInput["labs"], value: number) => setPatient(p => ({ ...p, labs: { ...p.labs, [key]: value } }));

  const addSymptom = (s?: string) => {
    const val = (s ?? symptomInput).trim();
    if (val && !patient.symptoms.includes(val)) { update("symptoms", [...patient.symptoms, val]); setSymptomInput(""); }
  };
  const addMed = () => { const v = medInput.trim(); if (v && !patient.currentMedications.includes(v)) { update("currentMedications", [...patient.currentMedications, v]); setMedInput(""); } };
  const addAllergy = () => { const v = allergyInput.trim(); if (v && !patient.allergies.includes(v)) { update("allergies", [...patient.allergies, v]); setAllergyInput(""); } };
  const addHistory = () => { const v = historyInput.trim(); if (v && !patient.medicalHistory.includes(v)) { update("medicalHistory", [...patient.medicalHistory, v]); setHistoryInput(""); } };

  const canSubmit = patient.name.trim().length > 0 && patient.symptoms.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    addPatient(patient);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-8">
      <div className="w-full max-w-5xl">

        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center bg-[#7107E7] mb-3 sm:mb-4" style={{ boxShadow: "4px 4px 0 #1C202B" }}>
            <Activity className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
          </div>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl text-[#1C202B]">WELCOME TO MEDISYNC</h1>
          <p className="label text-[#5A6BB8] mt-2 sm:mt-3 text-[10px] sm:text-xs">ADD YOUR FIRST PATIENT TO BEGIN CLINICAL ANALYSIS</p>
        </div>

        <div className="block-tetris p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">

          <section>
            <p className="label text-[#7107E7] mb-3 sm:mb-4">PATIENT DEMOGRAPHICS</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="col-span-2">
                <Label className="label text-[#5A6BB8]">FULL NAME *</Label>
                <Input value={patient.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Robert Chen" className="bg-white border-2 border-[#B8C8F0] mt-1 font-mono text-sm" />
              </div>
              <div>
                <Label className="label text-[#5A6BB8]">AGE</Label>
                <Input type="number" value={patient.age} onChange={(e) => update("age", parseInt(e.target.value) || 0)} className="bg-white border-2 border-[#B8C8F0] mt-1 font-mono text-sm" />
              </div>
              <div>
                <Label className="label text-[#5A6BB8]">GENDER</Label>
                <Select value={patient.gender} onValueChange={(v) => update("gender", v as Gender)}>
                  <SelectTrigger className="bg-white border-2 border-[#B8C8F0] mt-1 font-mono text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <section>
            <p className="label text-[#7107E7] mb-4">PRESENTING SYMPTOMS *</p>
            <div className="flex gap-2 mb-3">
              <Input value={symptomInput} onChange={(e) => setSymptomInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSymptom()} placeholder="Type symptom, press Enter…" className="bg-white border-2 border-[#B8C8F0] font-mono text-sm" />
              <Button size="sm" onClick={() => addSymptom()} className="bg-[#7107E7] text-white border-2 border-[#7107E7] px-3" style={{ boxShadow: "2px 2px 0 #1C202B" }}><Plus className="h-4 w-4" /></Button>
            </div>
            {patient.symptoms.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {patient.symptoms.map((s) => (
                  <Badge key={s} className="bg-[#7107E7]/10 text-[#7107E7] border-2 border-[#7107E7] gap-1 pr-1 text-xs">
                    {s}
                    <button onClick={() => update("symptoms", patient.symptoms.filter(x => x !== s))} className="rounded p-0.5 hover:bg-[#7107E7] hover:text-white"><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-1.5">
              {QUICK_SYMPTOMS.filter(s => !patient.symptoms.includes(s)).map((s) => (
                <button key={s} onClick={() => addSymptom(s)} className="text-xs text-[#5A6BB8] hover:text-[#7107E7] px-2 py-1 border-2 border-[#B8C8F0] hover:border-[#7107E7] bg-white">+ {s}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label className="label text-[#5A6BB8]">DURATION</Label>
                <Input value={patient.symptomDuration} onChange={(e) => update("symptomDuration", e.target.value)} placeholder="e.g. 2 hours" className="bg-white border-2 border-[#B8C8F0] mt-1 font-mono text-sm" />
              </div>
              <div>
                <Label className="label text-[#5A6BB8]">SEVERITY</Label>
                <Select value={patient.severity} onValueChange={(v) => update("severity", v as Severity)}>
                  <SelectTrigger className="bg-white border-2 border-[#B8C8F0] mt-1 font-mono text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                    <SelectItem value="life-threatening">Life-threatening</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Heart className="h-4 w-4 text-[#7107E7]" />
                <p className="label text-[#7107E7]">VITAL SIGNS</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "heartRate", label: "HR", unit: "bpm" },
                  { key: "systolicBP", label: "SBP", unit: "mmHg" },
                  { key: "diastolicBP", label: "DBP", unit: "mmHg" },
                  { key: "temperature", label: "TEMP", unit: "°C" },
                  { key: "respiratoryRate", label: "RR", unit: "/min" },
                  { key: "spo2", label: "SpO₂", unit: "%" },
                ].map((v) => (
                  <div key={v.key}>
                    <Label className="label text-[#5A6BB8]">{v.label}</Label>
                    <Input type="number" value={(patient.vitals as any)[v.key]} onChange={(e) => updateVital(v.key as any, parseFloat(e.target.value) || 0)} className="bg-white border-2 border-[#B8C8F0] mt-1 font-mono text-sm" />
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <FlaskConical className="h-4 w-4 text-[#7107E7]" />
                <p className="label text-[#7107E7]">KEY LABS</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "troponin", label: "TROPONIN" },
                  { key: "whiteBloodCells", label: "WBC" },
                  { key: "creatinine", label: "CREATININE" },
                  { key: "potassium", label: "POTASSIUM" },
                  { key: "hemoglobinA1c", label: "HbA1c" },
                  { key: "crp", label: "CRP" },
                ].map((l) => (
                  <div key={l.key}>
                    <Label className="label text-[#5A6BB8]">{l.label}</Label>
                    <Input type="number" value={(patient.labs as any)[l.key]} onChange={(e) => updateLab(l.key as any, parseFloat(e.target.value) || 0)} step={0.01} className="bg-white border-2 border-[#B8C8F0] mt-1 font-mono text-sm" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Pill className="h-4 w-4 text-[#7107E7]" />
                <p className="label text-[#7107E7]">MEDICATIONS</p>
              </div>
              <div className="flex gap-2 mb-2">
                <Input value={medInput} onChange={(e) => setMedInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addMed()} placeholder="Add…" className="bg-white border-2 border-[#B8C8F0] font-mono text-sm h-8" />
                <Button size="sm" variant="outline" onClick={addMed} className="border-2 border-[#1C202B] px-2"><Plus className="h-3 w-3" /></Button>
              </div>
              <div className="space-y-1">
                {patient.currentMedications.map((m) => (
                  <div key={m} className="flex items-center justify-between text-xs py-1 border-b border-[#B8C8F0] last:border-0">
                    <span className="text-[#1C202B]">{m}</span>
                    <button onClick={() => update("currentMedications", patient.currentMedications.filter(x => x !== m))} className="text-[#5A6BB8] hover:text-[#DC2626]"><X className="h-3 w-3" /></button>
                  </div>
                ))}
                {patient.currentMedications.length === 0 && <p className="text-xs text-[#5A6BB8]">None</p>}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-4 w-4 text-[#DC2626]" />
                <p className="label text-[#DC2626]">ALLERGIES</p>
              </div>
              <div className="flex gap-2 mb-2">
                <Input value={allergyInput} onChange={(e) => setAllergyInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addAllergy()} placeholder="Add…" className="bg-white border-2 border-[#B8C8F0] font-mono text-sm h-8" />
                <Button size="sm" variant="outline" onClick={addAllergy} className="border-2 border-[#1C202B] px-2"><Plus className="h-3 w-3" /></Button>
              </div>
              <div className="space-y-1">
                {patient.allergies.map((a) => (
                  <div key={a} className="flex items-center justify-between text-xs py-1 border-b border-[#B8C8F0] last:border-0">
                    <span className="text-[#DC2626]">{a}</span>
                    <button onClick={() => update("allergies", patient.allergies.filter(x => x !== a))} className="text-[#5A6BB8] hover:text-[#DC2626]"><X className="h-3 w-3" /></button>
                  </div>
                ))}
                {patient.allergies.length === 0 && <p className="text-xs text-[#5A6BB8]">NKA</p>}
              </div>
            </section>

            <section>
              <p className="label text-[#7107E7] mb-3">MEDICAL HISTORY</p>
              <div className="flex gap-2 mb-2">
                <Input value={historyInput} onChange={(e) => setHistoryInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addHistory()} placeholder="Add…" className="bg-white border-2 border-[#B8C8F0] font-mono text-sm h-8" />
                <Button size="sm" variant="outline" onClick={addHistory} className="border-2 border-[#1C202B] px-2"><Plus className="h-3 w-3" /></Button>
              </div>
              <div className="space-y-1">
                {patient.medicalHistory.map((h) => (
                  <div key={h} className="flex items-center justify-between text-xs py-1 border-b border-[#B8C8F0] last:border-0">
                    <span className="text-[#1C202B]">{h}</span>
                    <button onClick={() => update("medicalHistory", patient.medicalHistory.filter(x => x !== h))} className="text-[#5A6BB8] hover:text-[#DC2626]"><X className="h-3 w-3" /></button>
                  </div>
                ))}
                {patient.medicalHistory.length === 0 && <p className="text-xs text-[#5A6BB8]">None</p>}
              </div>
            </section>
          </div>

          <section className="flex items-center gap-3">
            <Switch checked={patient.lifestyle.smoking} onCheckedChange={(c) => update("lifestyle", { ...patient.lifestyle, smoking: c })} />
            <Label className="label text-[#5A6BB8]">SMOKING HISTORY</Label>
          </section>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6">
          <p className="text-xs text-[#5A6BB8] order-2 sm:order-1">
            {canSubmit ? "Ready to analyze" : "Name and at least one symptom required"}
          </p>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-[#7107E7] text-white border-2 border-[#7107E7] hover:bg-[#1C202B] hover:border-[#1C202B] gap-2 label text-xs px-4 sm:px-6 py-3 order-1 sm:order-2 w-full sm:w-auto"
            style={{ boxShadow: "3px 3px 0 #1C202B" }}
          >
            START ANALYSIS <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
