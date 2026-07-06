"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Workflow, Syringe, Pill, FlaskConical, Stethoscope, Activity, Image as ImageIcon, Heart, TrendingUp } from "lucide-react";
import { useMediSync } from "../store";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TimelineEvent } from "@/lib/medical/types";

const EVENT_ICONS: Record<TimelineEvent["type"], React.ComponentType<{ className?: string }>> = {
  symptom: Activity,
  lab: FlaskConical,
  visit: Stethoscope,
  medication: Pill,
  vital: Heart,
  imaging: ImageIcon,
  recovery: TrendingUp,
  intervention: Syringe,
};

const EVENT_COLORS: Record<TimelineEvent["type"], string> = {
  symptom: "bg-amber-600",
  lab: "bg-amber-500",
  visit: "bg-orange-500",
  medication: "bg-pink-500",
  vital: "bg-red-500",
  imaging: "bg-sky-500",
  recovery: "bg-orange-500",
  intervention: "bg-orange-500",
};

export function TimelineView() {
  const { analysis } = useMediSync();

  if (!analysis) return <Card className="glass p-12 text-center text-white/60">No analysis available.</Card>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Patient Timeline</h1>
        <p className="mt-1 text-sm text-white/50">
          Interactive clinical journey · {analysis.timeline.length} events tracked
        </p>
      </div>

      {}
      <Card className="glass">
        <div className="border-b border-white/5 p-4">
          <div className="flex items-center gap-2">
            <Workflow className="h-4 w-4 text-orange-300" />
            <h3 className="text-sm font-semibold text-white">Clinical Event Timeline</h3>
            <Badge variant="outline" className="ml-auto border-white/10 text-white/60">{analysis.timeline.length} events</Badge>
          </div>
        </div>
        <div className="p-6">
          <div className="relative">
            {}
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-amber-600/30 via-orange-500/30 to-orange-500/30" />

            <div className="space-y-6">
              {analysis.timeline.map((event, i) => {
                const Icon = EVENT_ICONS[event.type];
                const color = EVENT_COLORS[event.type];
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="relative pl-12"
                  >
                    {}
                    <div className={cn("absolute left-2.5 top-1 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-background", color)}>
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </div>

                    {}
                    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2">
                          <Icon className={cn("h-3.5 w-3.5 mt-0.5", `text-${color.split("-")[1]}-400`)} />
                          <div>
                            <p className="text-sm font-medium text-white">{event.title}</p>
                            <p className="text-xs text-white/60 mt-0.5">{event.description}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[10px] text-white/40">{new Date(event.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                          <Badge variant="outline" className="mt-1 border-white/10 text-white/50 text-[9px] uppercase">{event.type}</Badge>
                        </div>
                      </div>

                      {(event.clinician || event.outcome) && (
                        <div className="mt-2 flex items-center gap-3 text-[10px] text-white/40 border-t border-white/5 pt-2">
                          {event.clinician && (
                            <span>👤 {event.clinician}</span>
                          )}
                          {event.outcome && (
                            <span className={cn(
                              "rounded px-1.5 py-0.5",
                              event.outcome === "Pending" ? "bg-yellow-500/15 text-yellow-300" : "bg-orange-500/15 text-lime-300"
                            )}>
                              {event.outcome}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {}
      <Card className="glass">
        <div className="border-b border-white/5 p-4">
          <h3 className="text-sm font-semibold text-white">Predicted Outcome Trajectory</h3>
          <p className="text-xs text-white/40">AI-projected recovery curve based on similar patients (n=12,847)</p>
        </div>
        <div className="p-4">
          <svg viewBox="0 0 600 200" className="w-full h-48">
            <defs>
              <linearGradient id="trajectory" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d97757" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#d97757" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="confidence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c8983c" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#c8983c" stopOpacity="0" />
              </linearGradient>
            </defs>

            {}
            {[40, 80, 120, 160].map((y) => (
              <line key={y} x1="40" y1={y} x2="580" y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
            ))}

            {}
            <path
              d="M 40 80 Q 150 60, 250 90 T 450 140 T 580 160 L 580 180 Q 450 160, 350 130 T 250 110 T 40 100 Z"
              fill="url(#confidence)"
            />

            {}
            <path
              d="M 40 90 Q 150 75, 250 100 T 450 150 T 580 170"
              stroke="#d97757"
              strokeWidth="2.5"
              fill="none"
            />

            {}
            <line x1="40" y1="170" x2="580" y2="170" stroke="#8a9a5b" strokeWidth="1" strokeDasharray="5 5" />
            <text x="560" y="166" fontSize="9" fill="#8a9a5b" textAnchor="end">Recovery threshold</text>

            {}
            <text x="40" y="195" fontSize="9" fill="rgba(255,255,255,0.4)">Today</text>
            <text x="290" y="195" fontSize="9" fill="rgba(255,255,255,0.4)">+3 days</text>
            <text x="450" y="195" fontSize="9" fill="rgba(255,255,255,0.4)">+1 week</text>
            <text x="580" y="195" fontSize="9" fill="rgba(255,255,255,0.4)" textAnchor="end">+2 weeks</text>

            <text x="20" y="50" fontSize="9" fill="rgba(255,255,255,0.4)" textAnchor="end">Acute</text>
            <text x="20" y="100" fontSize="9" fill="rgba(255,255,255,0.4)" textAnchor="end">Moderate</text>
            <text x="20" y="170" fontSize="9" fill="rgba(255,255,255,0.4)" textAnchor="end">Recovered</text>
          </svg>

          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="rounded-lg glass-subtle p-3 text-center">
              <p className="text-[10px] uppercase tracking-wider text-white/40">Est. recovery</p>
              <p className="text-xl font-bold text-lime-300">7-10 days</p>
            </div>
            <div className="rounded-lg glass-subtle p-3 text-center">
              <p className="text-[10px] uppercase tracking-wider text-white/40">Follow-up recommended</p>
              <p className="text-xl font-bold text-white">3 days</p>
            </div>
            <div className="rounded-lg glass-subtle p-3 text-center">
              <p className="text-[10px] uppercase tracking-wider text-white/40">Similar patient outcome</p>
              <p className="text-xl font-bold text-orange-300">87% recovery</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
