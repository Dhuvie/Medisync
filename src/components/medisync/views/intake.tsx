"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  User, Activity, Pill, AlertCircle, FlaskConical, MapPin,
  Sparkles, RotateCcw, X, Plus, HeartPulse,
} from "lucide-react";
import { useMediSync } from "../store";
import { motion } from "framer-motion";
import { SYMPTOMS } from "@/lib/medical/knowledge";
import type { PatientInput, Gender, Severity } from "@/lib/medical/types";
import { toast } from "sonner";

const COMMON_SYMPTOMS = Array.from(SYMPTOMS).slice(0, 30);

export function IntakeView() {
  const { patient, setPatient, analyze, loadSynthetic, resetPatient } = useMediSync();
  const [symptomInput, setSymptomInput] = useState("");
  const [medInput, setMedInput] = useState("");
  const [allergyInput, setAllergyInput] = useState("");
  const [historyInput, setHistoryInput] = useState("");
  const [riskInput, setRiskInput] = useState("");

  const update = <K extends keyof PatientInput>(key: K, value: PatientInput[K]) => {
    setPatient({ ...patient, [key]: value });
  };

  const updateVital = (key: keyof PatientInput["vitals"], value: number) => {
    setPatient({ ...patient, vitals: { ...patient.vitals, [key]: value } });
  };

  const updateLab = (key: keyof PatientInput["labs"], value: number) => {
    setPatient({ ...patient, labs: { ...patient.labs, [key]: value } });
  };

  const addSymptom = (s?: string) => {
    const val = (s ?? symptomInput).trim();
    if (val && !patient.symptoms.includes(val)) {
      update("symptoms", [...patient.symptoms, val]);
      setSymptomInput("");
    }
  };

  const addMedication = () => {
    const val = medInput.trim();
    if (val && !patient.currentMedications.includes(val)) {
      update("currentMedications", [...patient.currentMedications, val]);
      setMedInput("");
    }
  };

  const addAllergy = () => {
    const val = allergyInput.trim();
    if (val && !patient.allergies.includes(val)) {
      update("allergies", [...patient.allergies, val]);
      setAllergyInput("");
    }
  };

  const addHistory = () => {
    const val = historyInput.trim();
    if (val && !patient.medicalHistory.includes(val)) {
      update("medicalHistory", [...patient.medicalHistory, val]);
      setHistoryInput("");
    }
  };

  const addRisk = () => {
    const val = riskInput.trim();
    if (val && !patient.riskFactors.includes(val)) {
      update("riskFactors", [...patient.riskFactors, val]);
      setRiskInput("");
    }
  };

  const handleAnalyze = () => {
    analyze();
    toast.success("AI clinical analysis initiated", {
      description: "Running 7-model ensemble + LLM reasoning + RAG retrieval",
    });
  };

  return (
    <div className="space-y-6">
      {}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Patient Intake</h1>
          <p className="mt-1 text-sm text-white/50">
            Comprehensive clinical data entry for AI-powered decision support
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { resetPatient(); toast("Loaded default demo patient"); }} className="gap-2 border-white/10 bg-white/5 hover:bg-white/10">
            <RotateCcw className="h-3.5 w-3.5" /> Demo
          </Button>
          <Button variant="outline" size="sm" onClick={() => { loadSynthetic(); toast.success("Synthetic patient loaded", { description: "Federated-learning-simulated realistic case" }); }} className="gap-2 border-white/10 bg-white/5 hover:bg-white/10">
            <Sparkles className="h-3.5 w-3.5" /> Random Case
          </Button>
          <Button size="sm" onClick={handleAnalyze} className="gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700">
            <Sparkles className="h-3.5 w-3.5" /> Run AI Analysis
          </Button>
        </div>
      </div>

      {}
      <Card className="glass">
        <div className="border-b border-white/5 p-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-orange-300" />
            <h3 className="text-sm font-semibold text-white">Patient Demographics</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 sm:col-span-2 lg:col-span-2">
            <Label className="text-xs text-white/60">Full Name</Label>
            <Input value={patient.name} onChange={(e) => update("name", e.target.value)} className="bg-white/5 border-white/10 text-white" />
          </div>
          <div>
            <Label className="text-xs text-white/60">Patient ID</Label>
            <Input value={patient.id} onChange={(e) => update("id", e.target.value)} className="bg-white/5 border-white/10 text-white text-xs font-mono" />
          </div>
          <div>
            <Label className="text-xs text-white/60">Age</Label>
            <Input type="number" value={patient.age} onChange={(e) => update("age", parseInt(e.target.value) || 0)} className="bg-white/5 border-white/10 text-white" />
          </div>
          <div>
            <Label className="text-xs text-white/60">Gender</Label>
            <Select value={patient.gender} onValueChange={(v) => update("gender", v as Gender)}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-white/60">Pregnant</Label>
            <div className="flex h-9 items-center gap-2">
              <Switch checked={patient.pregnant} onCheckedChange={(c) => update("pregnant", c)} />
              <span className="text-xs text-white/60">{patient.pregnant ? "Yes" : "No"}</span>
            </div>
          </div>
        </div>
      </Card>

      {}
      <Card className="glass">
        <div className="border-b border-white/5 p-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-amber-300" />
            <h3 className="text-sm font-semibold text-white">Presenting Symptoms</h3>
            <Badge variant="outline" className="ml-auto border-white/10 text-white/60">{patient.symptoms.length} active</Badge>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex gap-2">
            <Input
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSymptom()}
              placeholder="Type symptom and press Enter..."
              className="bg-white/5 border-white/10 text-white"
            />
            <Button size="sm" onClick={() => addSymptom()} className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {patient.symptoms.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {patient.symptoms.map((s) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Badge variant="outline" className="border-amber-600/30 bg-amber-600/10 text-amber-200 gap-1 pr-1">
                    {s}
                    <button onClick={() => update("symptoms", patient.symptoms.filter(x => x !== s))} className="rounded-full p-0.5 hover:bg-white/10">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}

          <div>
            <p className="mb-1.5 text-[10px] uppercase tracking-wider text-white/40">Quick add (common)</p>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SYMPTOMS.filter(s => !patient.symptoms.includes(s)).slice(0, 18).map((s) => (
                <button
                  key={s}
                  onClick={() => addSymptom(s)}
                  className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-white/60 hover:bg-white/[0.06] hover:text-white"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <Label className="text-xs text-white/60">Duration</Label>
              <Input value={patient.symptomDuration} onChange={(e) => update("symptomDuration", e.target.value)} placeholder="e.g., 2 hours" className="bg-white/5 border-white/10 text-white" />
            </div>
            <div>
              <Label className="text-xs text-white/60">Severity</Label>
              <Select value={patient.severity} onValueChange={(v) => update("severity", v as Severity)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mild">Mild</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                  <SelectItem value="life-threatening">Life-threatening</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-white/60">Pain Score: <span className="font-bold text-white">{patient.vitals.painScore}/10</span></Label>
              <Slider
                value={[patient.vitals.painScore]}
                onValueChange={(v) => updateVital("painScore", v[0])}
                min={0}
                max={10}
                step={1}
                className="mt-2.5"
              />
            </div>
          </div>
        </div>
      </Card>

      {}
      <Card className="glass">
        <div className="border-b border-white/5 p-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-red-300" />
            <h3 className="text-sm font-semibold text-white">Vital Signs</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { key: "heartRate", label: "Heart Rate", unit: "bpm", min: 30, max: 200 },
            { key: "systolicBP", label: "Systolic BP", unit: "mmHg", min: 60, max: 250 },
            { key: "diastolicBP", label: "Diastolic BP", unit: "mmHg", min: 30, max: 150 },
            { key: "temperature", label: "Temperature", unit: "°C", min: 30, max: 45, step: 0.1 },
            { key: "respiratoryRate", label: "Resp Rate", unit: "/min", min: 5, max: 40 },
            { key: "spo2", label: "SpO2", unit: "%", min: 50, max: 100 },
            { key: "bloodGlucose", label: "Glucose", unit: "mg/dL", min: 30, max: 500 },
            { key: "weightKg", label: "Weight", unit: "kg", min: 20, max: 200 },
            { key: "heightCm", label: "Height", unit: "cm", min: 100, max: 220 },
          ].map((v) => (
            <div key={v.key}>
              <Label className="text-[11px] text-white/60">{v.label} <span className="text-white/30">({v.unit})</span></Label>
              <Input
                type="number"
                value={(patient.vitals as any)[v.key]}
                onChange={(e) => updateVital(v.key as any, parseFloat(e.target.value) || 0)}
                step={(v as any).step || 1}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          ))}
        </div>
      </Card>

      {}
      <Card className="glass">
        <div className="border-b border-white/5 p-4">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-amber-300" />
            <h3 className="text-sm font-semibold text-white">Laboratory Values</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { key: "hemoglobin", label: "Hemoglobin", unit: "g/dL" },
            { key: "whiteBloodCells", label: "WBC", unit: "K/µL" },
            { key: "platelets", label: "Platelets", unit: "K/µL" },
            { key: "sodium", label: "Sodium", unit: "mEq/L" },
            { key: "potassium", label: "Potassium", unit: "mEq/L" },
            { key: "creatinine", label: "Creatinine", unit: "mg/dL" },
            { key: "bun", label: "BUN", unit: "mg/dL" },
            { key: "glucose", label: "Glucose", unit: "mg/dL" },
            { key: "alt", label: "ALT", unit: "U/L" },
            { key: "ast", label: "AST", unit: "U/L" },
            { key: "troponin", label: "Troponin", unit: "ng/mL" },
            { key: "crp", label: "CRP", unit: "mg/L" },
            { key: "esr", label: "ESR", unit: "mm/hr" },
            { key: "inr", label: "INR", unit: "" },
            { key: "hemoglobinA1c", label: "HbA1c", unit: "%" },
          ].map((l) => (
            <div key={l.key}>
              <Label className="text-[11px] text-white/60">{l.label} <span className="text-white/30">{l.unit}</span></Label>
              <Input
                type="number"
                value={(patient.labs as any)[l.key]}
                onChange={(e) => updateLab(l.key as any, parseFloat(e.target.value) || 0)}
                step={0.01}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          ))}
        </div>
      </Card>

      {}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {}
        <Card className="glass">
          <div className="border-b border-white/5 p-4">
            <div className="flex items-center gap-2">
              <Pill className="h-4 w-4 text-orange-300" />
              <h3 className="text-sm font-semibold text-white">Current Medications</h3>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex gap-2">
              <Input
                value={medInput}
                onChange={(e) => setMedInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addMedication()}
                placeholder="e.g., Metformin 500mg BID"
                className="bg-white/5 border-white/10 text-white"
              />
              <Button size="sm" onClick={addMedication} className="bg-orange-500 hover:bg-orange-600">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1.5">
              {patient.currentMedications.map((m) => (
                <div key={m} className="flex items-center justify-between rounded-md bg-white/[0.03] px-3 py-2 text-sm text-white/80">
                  <span>{m}</span>
                  <button onClick={() => update("currentMedications", patient.currentMedications.filter(x => x !== m))} className="text-white/40 hover:text-red-400">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {patient.currentMedications.length === 0 && <p className="text-xs text-white/30 py-2 text-center">No medications entered</p>}
            </div>
          </div>
        </Card>

        {}
        <Card className="glass">
          <div className="border-b border-white/5 p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-300" />
              <h3 className="text-sm font-semibold text-white">Allergies & Adverse Reactions</h3>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex gap-2">
              <Input
                value={allergyInput}
                onChange={(e) => setAllergyInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addAllergy()}
                placeholder="e.g., Penicillin (rash)"
                className="bg-white/5 border-white/10 text-white"
              />
              <Button size="sm" onClick={addAllergy} className="bg-red-500 hover:bg-red-600">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {patient.allergies.map((a) => (
                <Badge key={a} variant="outline" className="border-red-500/30 bg-red-500/10 text-red-200 gap-1 pr-1">
                  {a}
                  <button onClick={() => update("allergies", patient.allergies.filter(x => x !== a))} className="rounded-full p-0.5 hover:bg-white/10">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {patient.allergies.length === 0 && <p className="text-xs text-white/30 py-2">No known allergies (NKA)</p>}
            </div>
          </div>
        </Card>

        {}
        <Card className="glass">
          <div className="border-b border-white/5 p-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-amber-300" />
              <h3 className="text-sm font-semibold text-white">Medical History</h3>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex gap-2">
              <Input
                value={historyInput}
                onChange={(e) => setHistoryInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addHistory()}
                placeholder="e.g., Type 2 Diabetes, Hypertension"
                className="bg-white/5 border-white/10 text-white"
              />
              <Button size="sm" onClick={addHistory} variant="outline" className="border-white/10 bg-white/5">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1.5">
              {patient.medicalHistory.map((h) => (
                <div key={h} className="flex items-center justify-between rounded-md bg-white/[0.03] px-3 py-2 text-sm text-white/80">
                  <span>{h}</span>
                  <button onClick={() => update("medicalHistory", patient.medicalHistory.filter(x => x !== h))} className="text-white/40 hover:text-red-400">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {}
        <Card className="glass">
          <div className="border-b border-white/5 p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-300" />
              <h3 className="text-sm font-semibold text-white">Risk Factors & Lifestyle</h3>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex gap-2">
              <Input
                value={riskInput}
                onChange={(e) => setRiskInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addRisk()}
                placeholder="e.g., Smoking, Obesity"
                className="bg-white/5 border-white/10 text-white"
              />
              <Button size="sm" onClick={addRisk} variant="outline" className="border-white/10 bg-white/5">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {patient.riskFactors.map((r) => (
                <Badge key={r} variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-200 gap-1 pr-1">
                  {r}
                  <button onClick={() => update("riskFactors", patient.riskFactors.filter(x => x !== r))} className="rounded-full p-0.5 hover:bg-white/10">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <Label className="text-xs text-white/60">Smoking</Label>
                <div className="flex h-9 items-center gap-2">
                  <Switch checked={patient.lifestyle.smoking} onCheckedChange={(c) => update("lifestyle", { ...patient.lifestyle, smoking: c })} />
                  <span className="text-xs text-white/60">{patient.lifestyle.smoking ? "Yes" : "No"}</span>
                </div>
              </div>
              <div>
                <Label className="text-xs text-white/60">Alcohol</Label>
                <Input value={patient.lifestyle.alcohol} onChange={(e) => update("lifestyle", { ...patient.lifestyle, alcohol: e.target.value })} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-xs text-white/60">Exercise</Label>
                <Input value={patient.lifestyle.exercise} onChange={(e) => update("lifestyle", { ...patient.lifestyle, exercise: e.target.value })} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-xs text-white/60">Diet</Label>
                <Input value={patient.lifestyle.diet} onChange={(e) => update("lifestyle", { ...patient.lifestyle, diet: e.target.value })} className="bg-white/5 border-white/10 text-white" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-white/60">Travel History</Label>
              <Input value={patient.travelHistory} onChange={(e) => update("travelHistory", e.target.value)} className="bg-white/5 border-white/10 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {}
      <Card className="glass">
        <div className="border-b border-white/5 p-4">
          <h3 className="text-sm font-semibold text-white">Clinical Notes & Imaging Summary</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2">
          <div>
            <Label className="text-xs text-white/60">Imaging Summary</Label>
            <Textarea
              value={patient.imagingSummary}
              onChange={(e) => update("imagingSummary", e.target.value)}
              placeholder="e.g., CXR shows right lower lobe consolidation..."
              className="bg-white/5 border-white/10 text-white min-h-[100px]"
            />
          </div>
          <div>
            <Label className="text-xs text-white/60">Additional Notes</Label>
            <Textarea
              value={patient.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Free-text clinical observations..."
              className="bg-white/5 border-white/10 text-white min-h-[100px]"
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-2 pb-4">
        <Button variant="outline" onClick={resetPatient} className="border-white/10 bg-white/5">Reset</Button>
        <Button onClick={handleAnalyze} className="gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700">
          <Sparkles className="h-4 w-4" /> Run Full AI Clinical Analysis
        </Button>
      </div>
    </div>
  );
}
