"use client";

import { useEffect } from "react";
import { AppShell } from "@/components/medisync/app-shell";
import { useMediSync, initializeStore } from "@/components/medisync/store";
import { Onboarding } from "@/components/medisync/onboarding";
import { OverviewView } from "@/components/medisync/views/overview";
import { PatientView } from "@/components/medisync/views/patient";
import { ReasoningView } from "@/components/medisync/views/reasoning";
import { ToolsView } from "@/components/medisync/views/tools";

export default function Home() {
  const { zone, onboarding, patients, activePatientId, analyses } = useMediSync();

  useEffect(() => {
    initializeStore();
  }, []);

  if (onboarding || patients.length === 0) {
    return <Onboarding />;
  }

  const activePatient = patients.find(p => p.id === activePatientId) || patients[0];
  const analysis = activePatientId ? analyses[activePatientId] : null;

  return (
    <AppShell>
      {zone === "overview" && <OverviewView patient={activePatient} analysis={analysis} />}
      {zone === "patient" && <PatientView patient={activePatient} />}
      {zone === "reasoning" && <ReasoningView analysis={analysis} />}
      {zone === "tools" && <ToolsView patient={activePatient} analysis={analysis} />}
    </AppShell>
  );
}
