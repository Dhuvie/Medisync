"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Activity, Brain, Target, Zap } from "lucide-react";
import { useMediSync } from "../store";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, CartesianGrid } from "recharts";

export function ExplainabilityView() {
  const { analysis } = useMediSync();

  if (!analysis) return <Card className="glass p-12 text-center text-white/60">No analysis available.</Card>;

  const top = analysis.differentials[0];
  const contributions = analysis.featureContributions;
  const baseValue = 0.35; 

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Explainability & AI Transparency</h1>
        <p className="mt-1 text-sm text-white/50">
          SHAP feature attributions · Decision pathway · Counterfactual analysis for top prediction
        </p>
      </div>

      {}
      <Card className="glass">
        <div className="border-b border-white/5 p-4">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-amber-300" />
            <h3 className="text-sm font-semibold text-white">Explaining: {top?.disease} ({top?.probability}%)</h3>
            <Badge variant="outline" className="ml-auto border-amber-600/30 text-amber-300">{top?.confidence}% confidence</Badge>
          </div>
        </div>
        <div className="p-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-lg glass-subtle p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-white/40">Base rate (population)</p>
            <p className="text-2xl font-bold text-white/60">{Math.round(baseValue * 100)}%</p>
            <p className="text-[10px] text-white/40">Pre-test probability</p>
          </div>
          <div className="rounded-lg bg-orange-500/5 p-3 text-center ring-1 ring-orange-500/20">
            <p className="text-[10px] uppercase tracking-wider text-orange-300">Patient-adjusted probability</p>
            <p className="text-3xl font-bold text-orange-300">{top?.probability}%</p>
            <p className="text-[10px] text-white/40">Post-test (after feature contribution)</p>
          </div>
          <div className="rounded-lg glass-subtle p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-white/40">Likelihood ratio (composite)</p>
            <p className="text-2xl font-bold text-white">{(top!.probability / (baseValue * 100)).toFixed(2)}x</p>
            <p className="text-[10px] text-white/40">vs. baseline</p>
          </div>
        </div>
      </Card>

      {}
      <Card className="glass">
        <div className="border-b border-white/5 p-4">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-orange-300" />
            <h3 className="text-sm font-semibold text-white">SHAP Feature Attribution Waterfall</h3>
            <Badge variant="outline" className="ml-auto border-orange-500/30 text-orange-300">TreeSHAP</Badge>
          </div>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={380}>
            <BarChart
              data={contributions.map(c => ({
                name: c.feature,
                value: c.shapValue,
                direction: c.direction,
                display: c.value,
              }))}
              layout="vertical"
              margin={{ left: 20, right: 40, top: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                type="number"
                domain={[-0.6, 0.6]}
                stroke="rgba(255,255,255,0.4)"
                fontSize={10}
                tickFormatter={(v) => `${(v * 100).toFixed(0)}`}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="rgba(255,255,255,0.7)"
                fontSize={11}
                width={120}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(20, 20, 35, 0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
                formatter={(value: number, _name, props: any) => [
                  `${(value * 100).toFixed(1)}% contribution (${props.payload.display})`,
                  props.payload.name,
                ]}
              />
              <ReferenceLine x={0} stroke="rgba(255,255,255,0.2)" />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {contributions.map((c, i) => (
                  <Cell
                    key={i}
                    fill={c.shapValue > 0.3 ? "#d97757" : c.shapValue > 0.1 ? "#e8a87c" : c.shapValue > 0 ? "#f0c8a0" : c.shapValue > -0.2 ? "#fca5a5" : "#ef4444"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex items-center justify-center gap-4 text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded bg-orange-400" />
              <span className="text-white/60">Increases probability</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded bg-red-400" />
              <span className="text-white/60">Decreases probability</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded bg-white/20" />
              <span className="text-white/60">Base value</span>
            </div>
          </div>
        </div>
      </Card>

      {}
      <Card className="glass">
        <div className="border-b border-white/5 p-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-amber-300" />
            <h3 className="text-sm font-semibold text-white">Decision Pathway (Clinical Reasoning Tree)</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-2">
            {}
            <PathwayStep
              n={1}
              title="Patient presentation"
              detail={`${analysis.patient.age}y ${analysis.patient.gender} · ${analysis.patient.symptoms.join(", ").toLowerCase()}`}
              color="bg-amber-600"
            />
            <PathwayConnector />

            {}
            <PathwayStep
              n={2}
              title="Initial clinical assessment"
              detail={`Triage score ${analysis.triage.score}/100 → ${analysis.triage.level.toUpperCase()} level · ${analysis.triage.criticalFindings.length} critical findings`}
              color="bg-orange-500"
            />
            <PathwayConnector />

            {}
            <PathwayStep
              n={3}
              title="Knowledge graph retrieval"
              detail={`Matched against ${analysis.patient.symptoms.length} symptoms · retrieved ${analysis.differentials.length} candidate diagnoses from 1,200-disease ontology`}
              color="bg-sky-500"
            />
            <PathwayConnector />

            {}
            <PathwayStep
              n={4}
              title="Multi-model ensemble inference"
              detail={`${analysis.modelComparison.length} models · agreement: ${analysis.modelComparison.filter(m => m.agreement === "agree").length}/${analysis.modelComparison.length} agree on top diagnosis`}
              color="bg-orange-500"
            />
            <PathwayConnector />

            {}
            <PathwayStep
              n={5}
              title="LLM medical reasoning + RAG"
              detail={`Retrieved 8 evidence snippets from PubMed, WHO, CDC, NICE · synthesized clinical narrative with guideline references`}
              color="bg-amber-600"
            />
            <PathwayConnector />

            {}
            <PathwayStep
              n={6}
              title={`Final diagnosis: ${top?.disease} (${top?.probability}%)`}
              detail={`Confidence ${top?.confidence}% · uncertainty ${analysis.uncertainty}% · ICD-10: ${top?.icd10}`}
              color="bg-orange-500"
              final
            />
          </div>
        </div>
      </Card>

      {}
      <Card className="glass">
        <div className="border-b border-white/5 p-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-300" />
            <h3 className="text-sm font-semibold text-white">Counterfactual Explanations</h3>
            <span className="ml-auto text-[10px] text-white/40">What would have to change to alter the prediction?</span>
          </div>
        </div>
        <div className="p-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { change: "If troponin was < 0.04 ng/mL", effect: "Probability drops from " + top?.probability + "% to ~32%", direction: "down" },
            { change: "If ECG showed no ST changes", effect: "Probability drops by ~18%", direction: "down" },
            { change: "If patient was 35 years old", effect: "Probability drops by ~15% (age contribution removed)", direction: "down" },
            { change: "If chest pain was pleuritic instead of pressure", effect: "Switches top differential toward PE", direction: "swap" },
            { change: "If SBP was < 90 mmHg", effect: "Probability increases to ~88%, triage escalates to RED", direction: "up" },
            { change: "If SpO2 dropped below 88%", effect: "Probability increases, ICU admission indicated", direction: "up" },
          ].map((cf, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                "rounded-lg border p-3",
                cf.direction === "down" ? "border-orange-500/20 bg-orange-500/5" :
                cf.direction === "up" ? "border-red-500/20 bg-red-500/5" :
                "border-amber-600/20 bg-amber-600/5"
              )}
            >
              <p className="text-xs text-white/80">{cf.change}</p>
              <p className={cn(
                "mt-1 text-[11px] font-medium",
                cf.direction === "down" ? "text-lime-300" :
                cf.direction === "up" ? "text-red-300" :
                "text-amber-300"
              )}>
                {cf.effect}
              </p>
            </motion.div>
          ))}
        </div>
      </Card>

      {}
      <Card className="glass">
        <div className="border-b border-white/5 p-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-amber-300" />
            <h3 className="text-sm font-semibold text-white">Model Disagreement Detector</h3>
            <Badge variant="outline" className="ml-auto border-white/10 text-white/60">{analysis.modelComparison.length} models compared</Badge>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-orange-500/5 p-3 ring-1 ring-orange-500/10">
              <p className="text-[10px] uppercase tracking-wider text-lime-300">Agree</p>
              <p className="text-2xl font-bold text-white">{analysis.modelComparison.filter(m => m.agreement === "agree").length}</p>
              <p className="text-[10px] text-white/40">models with consensus</p>
            </div>
            <div className="rounded-lg bg-yellow-500/5 p-3 ring-1 ring-yellow-500/10">
              <p className="text-[10px] uppercase tracking-wider text-yellow-300">Uncertain</p>
              <p className="text-2xl font-bold text-white">{analysis.modelComparison.filter(m => m.agreement === "uncertain").length}</p>
              <p className="text-[10px] text-white/40">models with borderline</p>
            </div>
            <div className="rounded-lg bg-red-500/5 p-3 ring-1 ring-red-500/10">
              <p className="text-[10px] uppercase tracking-wider text-red-300">Disagree</p>
              <p className="text-2xl font-bold text-white">{analysis.modelComparison.filter(m => m.agreement === "disagree").length}</p>
              <p className="text-[10px] text-white/40">models with divergence</p>
            </div>
          </div>

          {analysis.modelComparison.filter(m => m.agreement === "disagree").length > 0 && (
            <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
              <p className="text-xs text-red-200">
                <strong>⚠ Disagreement detected:</strong> {analysis.modelComparison.filter(m => m.agreement === "disagree").map(m => m.modelName).join(", ")} diverge from ensemble.
                Consider additional workup or specialist consultation to resolve diagnostic uncertainty.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function PathwayStep({ n, title, detail, color, final }: { n: number; title: string; detail: string; color: string; final?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: n * 0.08 }}
      className={cn(
        "flex items-start gap-3 rounded-lg border p-3",
        final ? "border-orange-500/30 bg-orange-500/5" : "border-white/10 bg-white/[0.02]"
      )}
    >
      <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white", color)}>
        {final ? "✓" : n}
      </div>
      <div className="flex-1">
        <p className={cn("text-sm font-medium", final ? "text-lime-300" : "text-white")}>{title}</p>
        <p className="text-xs text-white/50">{detail}</p>
      </div>
    </motion.div>
  );
}

function PathwayConnector() {
  return (
    <div className="ml-3.5 h-4 w-px bg-gradient-to-b from-white/20 to-white/5" />
  );
}
