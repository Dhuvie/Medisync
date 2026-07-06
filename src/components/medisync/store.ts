"use client";

import { create } from "zustand";
import type { PatientInput, ClinicalAnalysis, ChatMessage } from "@/lib/medical/types";
import { analyzePatient, DEFAULT_PATIENT, generateSyntheticPatient } from "@/lib/medical/engine";

export type Zone = "overview" | "patient" | "reasoning" | "tools";
export type ToolTab = "chat" | "soap" | "whatif" | "knowledge";

interface MediSyncStore {

  patients: PatientInput[];
  activePatientId: string | null;

  onboarding: boolean;

  analyses: Record<string, ClinicalAnalysis | null>;
  isAnalyzing: boolean;
  llmPowered: boolean;
  llmError: string | null;

  zone: Zone;
  toolTab: ToolTab;

  chatMessages: ChatMessage[];
  isChatThinking: boolean;

  soapNote: { subjective: string; objective: string; assessment: string; plan: string } | null;
  isGeneratingSOAP: boolean;

  setZone: (z: Zone) => void;
  setToolTab: (t: ToolTab) => void;
  addPatient: (p: PatientInput) => void;
  updateActivePatient: (p: PatientInput) => void;
  setActivePatient: (id: string) => void;
  deletePatient: (id: string) => void;
  analyze: () => Promise<void>;
  sendChatMessage: (question: string) => Promise<void>;
  generateSOAP: () => Promise<void>;
}

const STORAGE_KEY = "medisync-patients";

function loadPatients(): PatientInput[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

function savePatients(patients: PatientInput[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  } catch {}
}

export const useMediSync = create<MediSyncStore>((set, get) => ({
  patients: [],
  activePatientId: null,
  onboarding: true,
  analyses: {},
  isAnalyzing: false,
  llmPowered: false,
  llmError: null,
  zone: "overview",
  toolTab: "chat",
  chatMessages: [],
  isChatThinking: false,
  soapNote: null,
  isGeneratingSOAP: false,

  setZone: (z) => set({ zone: z }),
  setToolTab: (t) => set({ toolTab: t }),

  addPatient: (p) => {
    const patients = [...get().patients, p];
    savePatients(patients);
    set({
      patients,
      activePatientId: p.id,
      onboarding: false,
      analyses: {},
      chatMessages: [],
      soapNote: null,
      zone: "overview",
    });

    setTimeout(() => get().analyze(), 100);
  },

  updateActivePatient: (p) => {
    const patients = get().patients.map(pt => pt.id === p.id ? p : pt);
    savePatients(patients);
    set({ patients, analyses: { ...get().analyses, [p.id]: null }, chatMessages: [], soapNote: null });
    setTimeout(() => get().analyze(), 100);
  },

  setActivePatient: (id) => {
    set({
      activePatientId: id,
      chatMessages: [],
      soapNote: null,
      zone: "overview",
      isAnalyzing: false,
    });

    if (!get().analyses[id] && !get().isAnalyzing) {
      setTimeout(() => get().analyze(), 100);
    }
  },

  deletePatient: (id) => {
    const patients = get().patients.filter(p => p.id !== id);
    savePatients(patients);
    const remaining = patients.length > 0;
    set({
      patients,
      activePatientId: remaining ? patients[0].id : null,
      onboarding: !remaining,
      analyses: {},
      chatMessages: [],
      soapNote: null,
    });
  },

  analyze: async () => {
    const state = get();
    const patientId = state.activePatientId;
    if (!patientId) return;
    const patient = state.patients.find(p => p.id === patientId);
    if (!patient) return;
    if (state.isAnalyzing) return;

    set({ isAnalyzing: true, llmError: null });

    const instant = analyzePatient(patient);
    set({ analyses: { ...get().analyses, [patientId]: instant } });

    try {
      const res = await fetch("/api/clinical-reasoning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("text/event-stream")) {
        const data = await res.json();
        if (data.analysis) {
          set({
            analyses: { ...get().analyses, [patientId]: data.analysis },
            llmPowered: !!data.llmPowered,
            llmError: data.llmError || null,
          });
        }
      } else {
        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");
        const decoder = new TextDecoder();
        let buffer = "";
        let finalData: any = null;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("data:")) {
              const jsonStr = trimmed.slice(5).trim();
              if (jsonStr) { try { finalData = JSON.parse(jsonStr); } catch {} }
            }
          }
        }
        if (finalData?.analysis) {
          set({
            analyses: { ...get().analyses, [patientId]: finalData.analysis },
            llmPowered: !!finalData.llmPowered,
            llmError: finalData.llmError || null,
          });
        }
      }
    } catch (err: any) {
      set({ llmError: err?.message || "LLM call failed", llmPowered: false });
    } finally {
      set({ isAnalyzing: false });
    }
  },

  sendChatMessage: async (question: string) => {
    const state = get();
    if (state.isChatThinking) return;
    const patient = state.patients.find(p => p.id === state.activePatientId);
    if (!patient) return;
    const analysis = state.analyses[state.activePatientId!] || null;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: question, timestamp: new Date().toISOString() };
    set({ chatMessages: [...state.chatMessages, userMsg], isChatThinking: true });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, patient, analysis, history: state.chatMessages.slice(-6).map(m => ({ role: m.role, content: m.content })) }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const contentType = res.headers.get("content-type") || "";
      let data: any;
      if (contentType.includes("text/event-stream")) {
        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");
        const decoder = new TextDecoder();
        let buffer = "";
        let finalData: any = null;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("data:")) {
              const jsonStr = trimmed.slice(5).trim();
              if (jsonStr) { try { finalData = JSON.parse(jsonStr); } catch {} }
            }
          }
        }
        data = finalData || { content: "No response received.", reasoning: "Empty stream", citations: [] };
      } else {
        data = await res.json();
      }
      const assistantMsg: ChatMessage = { id: `a-${Date.now()}`, role: "assistant", content: data.content, reasoning: data.reasoning, citations: data.citations, timestamp: data.timestamp || new Date().toISOString() };
      set({ chatMessages: [...get().chatMessages, assistantMsg], isChatThinking: false });
    } catch (err: any) {
      const errMsg: ChatMessage = { id: `e-${Date.now()}`, role: "assistant", content: "I encountered an error. Please try again.", reasoning: "API error: " + (err?.message || "unknown"), citations: [], timestamp: new Date().toISOString() };
      set({ chatMessages: [...get().chatMessages, errMsg], isChatThinking: false });
    }
  },

  generateSOAP: async () => {
    const state = get();
    if (state.isGeneratingSOAP) return;
    const patient = state.patients.find(p => p.id === state.activePatientId);
    if (!patient) return;
    const analysis = state.analyses[state.activePatientId!] || null;
    set({ isGeneratingSOAP: true });
    try {
      const res = await fetch("/api/soap", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ patient, analysis }) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const contentType = res.headers.get("content-type") || "";
      let data: any;
      if (contentType.includes("text/event-stream")) {
        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");
        const decoder = new TextDecoder();
        let buffer = "";
        let finalData: any = null;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("data:")) {
              const jsonStr = trimmed.slice(5).trim();
              if (jsonStr) { try { finalData = JSON.parse(jsonStr); } catch {} }
            }
          }
        }
        data = finalData;
      } else {
        data = await res.json();
      }
      if (data?.soap) set({ soapNote: data.soap });
    } catch (err: any) {
      console.error("[generateSOAP] failed:", err);
    } finally {
      set({ isGeneratingSOAP: false });
    }
  },
}));

export function initializeStore() {
  if (typeof window === "undefined") return;
  const patients = loadPatients();
  if (patients.length > 0) {
    useMediSync.setState({
      patients,
      activePatientId: patients[0].id,
      onboarding: false,
    });
    setTimeout(() => useMediSync.getState().analyze(), 200);
  }
}
