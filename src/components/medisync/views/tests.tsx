"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Microscope, Image as ImageIcon, Activity, DollarSign } from "lucide-react";
import { useMediSync } from "../store";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const PRIORITY_STYLES = {
  stat: { bg: "bg-red-500/15", text: "text-red-300", border: "border-red-500/30", label: "STAT" },
  urgent: { bg: "bg-orange-500/15", text: "text-orange-300", border: "border-orange-500/30", label: "URGENT" },
  routine: { bg: "bg-sky-500/15", text: "text-sky-300", border: "border-sky-500/30", label: "ROUTINE" },
  screening: { bg: "bg-orange-500/15", text: "text-lime-300", border: "border-orange-500/30", label: "SCREENING" },
} as const;

const CATEGORY_ICONS = {
  Lab: FlaskConical,
  Imaging: ImageIcon,
  Cardiac: Activity,
  Microbiology: Microscope,
  Pathology: Microscope,
  Function: Activity,
} as const;

export function TestsView() {
  const { analysis } = useMediSync();

  if (!analysis) return <Card className="glass p-12 text-center text-white/60">No analysis available.</Card>;

  const byPriority = {
    stat: analysis.recommendedTests.filter(t => t.priority === "stat"),
    urgent: analysis.recommendedTests.filter(t => t.priority === "urgent"),
    routine: analysis.recommendedTests.filter(t => t.priority === "routine"),
    screening: analysis.recommendedTests.filter(t => t.priority === "screening"),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Test Recommendation Engine</h1>
        <p className="mt-1 text-sm text-white/50">
          Evidence-based diagnostic workup · {analysis.recommendedTests.length} tests recommended across {Object.keys(byPriority).filter(k => byPriority[k as keyof typeof byPriority].length > 0).length} priority tiers
        </p>
      </div>

      {}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Object.entries(byPriority).map(([priority, tests]) => {
          const style = PRIORITY_STYLES[priority as keyof typeof PRIORITY_STYLES];
          return (
            <Card key={priority} className={cn("glass border", style.border)}>
              <div className="p-4 text-center">
                <div className={cn("inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider", style.bg, style.text)}>
                  {style.label}
                </div>
                <p className="mt-2 text-3xl font-bold text-white">{tests.length}</p>
                <p className="text-[10px] text-white/40">tests</p>
              </div>
            </Card>
          );
        })}
      </div>

      {}
      <Card className="glass">
        <div className="border-b border-white/5 p-4">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-amber-300" />
            <h3 className="text-sm font-semibold text-white">Recommended Diagnostic Workup</h3>
            <Badge variant="outline" className="ml-auto border-white/10 text-white/60">AI-ranked by clinical utility</Badge>
          </div>
        </div>
        <div className="divide-y divide-white/5">
          {analysis.recommendedTests.map((test, i) => {
            const style = PRIORITY_STYLES[test.priority];
            const Icon = CATEGORY_ICONS[test.category] || FlaskConical;
            return (
              <motion.div
                key={test.test}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="p-4 hover:bg-white/[0.02]"
              >
                <div className="flex items-start gap-3">
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", style.bg, style.text)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-white">{test.test}</h4>
                        <Badge className={cn("border", style.border, style.bg, style.text, "text-[9px]")}>
                          {style.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-white/10 text-white/60">{test.category}</Badge>
                        <span className="text-xs text-white/40">{test.costTier}</span>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-white/60">{test.rationale}</p>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div className="rounded-md bg-white/[0.03] px-3 py-1.5">
                        <span className="text-[10px] uppercase tracking-wider text-white/40">Expected finding</span>
                        <p className="text-[11px] text-white/70">{test.expectedFinding}</p>
                      </div>
                      <div className="rounded-md bg-white/[0.03] px-3 py-1.5">
                        <span className="text-[10px] uppercase tracking-wider text-white/40">ICD-10 justification</span>
                        <p className="text-[11px] text-white/70 font-mono">{test.icd10Justification}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {}
      <Card className="glass">
        <div className="border-b border-white/5 p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-lime-300" />
            <h3 className="text-sm font-semibold text-white">Estimated Cost & Resource Impact</h3>
          </div>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider text-white/40">Est. cost</p>
            <p className="text-2xl font-bold text-white">
              ${analysis.recommendedTests.reduce((sum, t) => sum + (t.costTier === "$" ? 50 : t.costTier === "$$" ? 250 : 1200), 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider text-white/40">Lab tests</p>
            <p className="text-2xl font-bold text-white">{analysis.recommendedTests.filter(t => t.category === "Lab").length}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider text-white/40">Imaging</p>
            <p className="text-2xl font-bold text-white">{analysis.recommendedTests.filter(t => t.category === "Imaging").length}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider text-white/40">STAT priority</p>
            <p className="text-2xl font-bold text-red-300">{byPriority.stat.length}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
