"use client";

import { useState } from "react";
import { useMediSync } from "../store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Sparkles, Heart, FlaskConical, Pill, AlertCircle } from "lucide-react";
import type { PatientInput, Gender, Severity } from "@/lib/medical/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const QUICK_SYMPTOMS = ["Chest pain", "Shortness of breath", "Fever", "Cough", "Headache", "Fatigue", "Nausea", "Dizziness", "Palpitations", "Syncope"];

export function PatientView({ patient }: { patient: PatientInput }) {
  const { updateActivePatient, analyze } = useMediSync();
  const [symptomInput, setSymptomInput] = useState("");
  const [medInput, setMedInput] = useState("");

  const update = <K extends keyof PatientInput>(key: K, value: PatientInput[K]) => updateActivePatient({ ...patient, [key]: value });
  const updateVital = (key: keyof PatientInput["vitals"], value: number) => updateActivePatient({ ...patient, vitals: { ...patient.vitals, [key]: value } });

  const addSymptom = (s?: string) => {
    const val = (s ?? symptomInput).trim();
    if (val && !patient.symptoms.includes(val)) { update("symptoms", [...patient.symptoms, val]); setSymptomInput(""); }
  };

  const handleAnalyze = () => { analyze(); toast.success("AI ANALYSIS INITIATED", { description: "Real LLM reasoning in progress" }); };

  return (
    <div className="space-y-6">

      <div className="flex items-baseline justify-between">
        <div>
          <p className="label text-[#5A6BB8]">SECTION 02</p>
          <h1 className="font-display text-4xl sm:text-5xl text-[#1C202B] mt-1">CLINICAL INTAKE</h1>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleAnalyze} className="bg-[#7107E7] text-white border-2 border-[#7107E7] hover:bg-[#1C202B] hover:border-[#1C202B] gap-1.5 label text-[10px]" style={{ boxShadow: "2px 2px 0 #1C202B" }}>
            <Sparkles className="h-3 w-3" /> RE-ANALYZE
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-6">

          <div className="block-tetris p-6">
            <p className="label text-[#5A6BB8] mb-4">DEMOGRAPHICS</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="col-span-2">
                <Label className="label text-[#5A6BB8]">NAME</Label>
                <Input value={patient.name} onChange={(e) => update("name", e.target.value)} className="bg-white border-2 border-[#B8C8F0] mt-1 font-mono text-sm" />
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
          </div>

          <div className="block-tetris p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="label text-[#5A6BB8]">PRESENTING SYMPTOMS</p>
              <Badge className="bg-[#7107E7] text-white border-2 border-[#1C202B] text-[10px]" style={{ boxShadow: "2px 2px 0 #1C202B" }}>{patient.symptoms.length}</Badge>
            </div>
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
              {QUICK_SYMPTOMS.filter(s => !patient.symptoms.includes(s)).slice(0, 8).map((s) => (
                <button key={s} onClick={() => addSymptom(s)} className="text-xs text-[#5A6BB8] hover:text-[#7107E7] px-2 py-1 border-2 border-[#B8C8F0] hover:border-[#7107E7] bg-white">
                  + {s}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t-2 border-[#B8C8F0]">
              <div>
                <Label className="label text-[#5A6BB8]">DURATION</Label>
                <Input value={patient.symptomDuration} onChange={(e) => update("symptomDuration", e.target.value)} className="bg-white border-2 border-[#B8C8F0] mt-1 font-mono text-sm" />
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="block-tetris p-6">
              <div className="flex items-center gap-2 mb-3">
                <Pill className="h-4 w-4 text-[#7107E7]" />
                <p className="label text-[#5A6BB8]">MEDICATIONS</p>
              </div>
              <div className="flex gap-2 mb-2">
                <Input value={medInput} onChange={(e) => setMedInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (() => { if (medInput.trim()) { update("currentMedications", [...patient.currentMedications, medInput.trim()]); setMedInput(""); } })()} placeholder="Add medication…" className="bg-white border-2 border-[#B8C8F0] font-mono text-sm" />
                <Button size="sm" variant="outline" onClick={() => { if (medInput.trim()) { update("currentMedications", [...patient.currentMedications, medInput.trim()]); setMedInput(""); } }} className="border-2 border-[#1C202B] px-2"><Plus className="h-3.5 w-3.5" /></Button>
              </div>
              <div className="space-y-1">
                {patient.currentMedications.map((m) => (
                  <div key={m} className="flex items-center justify-between text-sm py-1.5 border-b border-[#B8C8F0] last:border-0">
                    <span className="text-[#1C202B]">{m}</span>
                    <button onClick={() => update("currentMedications", patient.currentMedications.filter(x => x !== m))} className="text-[#5A6BB8] hover:text-[#DC2626]"><X className="h-3 w-3" /></button>
                  </div>
                ))}
                {patient.currentMedications.length === 0 && <p className="text-xs text-[#5A6BB8] py-2">None</p>}
              </div>
            </div>
            <div className="block-tetris p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-4 w-4 text-[#DC2626]" />
                <p className="label text-[#5A6BB8]">ALLERGIES</p>
              </div>
              <div className="space-y-1">
                {patient.allergies.length === 0 && <p className="text-xs text-[#5A6BB8] py-2">No known allergies</p>}
                {patient.allergies.map((a) => (
                  <div key={a} className="flex items-center justify-between text-sm py-1.5 border-b border-[#B8C8F0] last:border-0">
                    <span className="text-[#DC2626]">{a}</span>
                    <button onClick={() => update("allergies", patient.allergies.filter(x => x !== a))} className="text-[#5A6BB8] hover:text-[#DC2626]"><X className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#5A6BB8] mt-3">History: {patient.medicalHistory.join(", ") || "None"}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="block-tetris p-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-4 w-4 text-[#7107E7]" />
              <p className="label text-[#5A6BB8]">VITAL SIGNS</p>
            </div>
            <div className="space-y-3">
              {[
                { key: "heartRate", label: "Heart Rate", unit: "bpm" },
                { key: "systolicBP", label: "Systolic BP", unit: "mmHg" },
                { key: "diastolicBP", label: "Diastolic BP", unit: "mmHg" },
                { key: "temperature", label: "Temperature", unit: "°C" },
                { key: "respiratoryRate", label: "Resp Rate", unit: "/min" },
                { key: "spo2", label: "SpO₂", unit: "%" },
              ].map((v) => (
                <div key={v.key}>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="label text-[#5A6BB8]">{v.label}</Label>
                    <span className="font-mono text-sm text-[#1C202B]">{(patient.vitals as any)[v.key]}<span className="text-[#5A6BB8] ml-1 text-xs">{v.unit}</span></span>
                  </div>
                  <Input type="number" value={(patient.vitals as any)[v.key]} onChange={(e) => updateVital(v.key as any, parseFloat(e.target.value) || 0)} className="bg-white border-2 border-[#B8C8F0] h-8 text-xs font-mono" />
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t-2 border-[#B8C8F0]">
              <Label className="label text-[#5A6BB8]">PAIN SCORE: <span className="font-mono text-[#1C202B]">{patient.vitals.painScore}/10</span></Label>
              <Slider value={[patient.vitals.painScore]} onValueChange={(v) => updateVital("painScore", v[0])} min={0} max={10} step={1} className="mt-2" />
            </div>
          </div>

          <div className="block-tetris p-6">
            <div className="flex items-center gap-2 mb-4">
              <FlaskConical className="h-4 w-4 text-[#7107E7]" />
              <p className="label text-[#5A6BB8]">KEY LABS</p>
            </div>
            <div className="space-y-2.5">
              {[
                { key: "troponin", label: "Troponin", unit: "ng/mL", crit: 0.04 },
                { key: "whiteBloodCells", label: "WBC", unit: "K/µL", crit: 11 },
                { key: "creatinine", label: "Creatinine", unit: "mg/dL", crit: 1.3 },
                { key: "potassium", label: "Potassium", unit: "mEq/L", crit: 5 },
                { key: "hemoglobinA1c", label: "HbA1c", unit: "%", crit: 6.5 },
                { key: "crp", label: "CRP", unit: "mg/L", crit: 3 },
              ].map((l) => {
                const val = (patient.labs as any)[l.key];
                const abnormal = val > l.crit;
                return (
                  <div key={l.key} className="flex items-center justify-between">
                    <span className="text-xs text-[#1C398E]">{l.label}</span>
                    <div className="flex items-center gap-2">
                      <span className={cn("font-mono text-sm font-semibold", abnormal && "text-[#DC2626]")}>{val}</span>
                      <span className={cn("piece", abnormal ? "piece-red" : "piece-green")} style={{ width: 10, height: 10 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="block-tetris p-6">
            <p className="label text-[#5A6BB8] mb-3">LIFESTYLE</p>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#1C398E]">Smoking</span>
                <Switch checked={patient.lifestyle.smoking} onCheckedChange={(c) => update("lifestyle", { ...patient.lifestyle, smoking: c })} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#1C398E]">Alcohol</span>
                <span className="text-[#1C202B] font-mono">{patient.lifestyle.alcohol}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#1C398E]">Exercise</span>
                <span className="text-[#1C202B] font-mono">{patient.lifestyle.exercise}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
