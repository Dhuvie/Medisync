import type { TriageLevel, Severity } from "@/lib/medical/types";

export const TRIAGE_COLORS: Record<TriageLevel, {
  bg: string; border: string; text: string; label: string; piece: string;
}> = {
  red: {
    bg: "bg-[#DC2626]/10",
    border: "border-[#DC2626]",
    text: "text-[#DC2626]",
    label: "RED — RESUSCITATE",
    piece: "piece-red",
  },
  orange: {
    bg: "bg-[#D97706]/10",
    border: "border-[#D97706]",
    text: "text-[#D97706]",
    label: "ORANGE — EMERGENT",
    piece: "piece-orange",
  },
  yellow: {
    bg: "bg-[#D97706]/10",
    border: "border-[#D97706]",
    text: "text-[#D97706]",
    label: "YELLOW — URGENT",
    piece: "piece-orange",
  },
  green: {
    bg: "bg-[#16A34A]/10",
    border: "border-[#16A34A]",
    text: "text-[#16A34A]",
    label: "GREEN — LESS URGENT",
    piece: "piece-green",
  },
  blue: {
    bg: "bg-[#7107E7]/10",
    border: "border-[#7107E7]",
    text: "text-[#7107E7]",
    label: "BLUE — NON-URGENT",
    piece: "piece-purple",
  },
};

export const SEVERITY_COLORS: Record<Severity, string> = {
  "mild": "text-[#16A34A] bg-[#16A34A]/10 border-[#16A34A]",
  "moderate": "text-[#D97706] bg-[#D97706]/10 border-[#D97706]",
  "severe": "text-[#D97706] bg-[#D97706]/10 border-[#D97706]",
  "life-threatening": "text-[#DC2626] bg-[#DC2626]/10 border-[#DC2626]",
};

export function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffH = Math.round(diffMs / 3600000);
  const diffMin = Math.round(diffMs / 60000);
  if (Math.abs(diffMin) < 60) {
    return diffMin > 0 ? `+${diffMin}m` : diffMin === 0 ? "NOW" : `${Math.abs(diffMin)}m AGO`;
  }
  if (Math.abs(diffH) < 24) {
    return diffH > 0 ? `+${diffH}h` : `${Math.abs(diffH)}h AGO`;
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}
