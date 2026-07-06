"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, ZoomIn, ZoomOut, Info } from "lucide-react";
import { KNOWLEDGE_NODES, KNOWLEDGE_EDGES } from "@/lib/medical/knowledge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NODE_COLORS = {
  disease: "#c4503c",
  symptom: "#c8983c",
  drug: "#d97757",
  test: "#b8693d",
  bodySystem: "#6b8e9e",
  complication: "#d97757",
  treatment: "#8a9a5b",
} as const;

const NODE_RADII = {
  disease: 22,
  symptom: 12,
  drug: 16,
  test: 14,
  bodySystem: 18,
  complication: 14,
  treatment: 16,
} as const;

interface PositionedNode {
  id: string;
  label: string;
  type: keyof typeof NODE_COLORS;
  x: number;
  y: number;
}

export function KnowledgeGraphView() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [filter, setFilter] = useState<keyof typeof NODE_COLORS | "all">("all");

  const positionedNodes = useMemo<PositionedNode[]>(() => {
    const W = 900, H = 600, CX = W / 2, CY = H / 2;
    const types = Object.keys(NODE_COLORS) as (keyof typeof NODE_COLORS)[];
    const result: PositionedNode[] = [];

    const bodySystems = KNOWLEDGE_NODES.filter(n => n.type === "bodySystem");
    bodySystems.forEach((n, i) => {
      const angle = (i / bodySystems.length) * 2 * Math.PI;
      result.push({
        ...n,
        x: CX + Math.cos(angle) * 80,
        y: CY + Math.sin(angle) * 80,
      });
    });

    types.filter(t => t !== "bodySystem").forEach((type) => {
      const nodes = KNOWLEDGE_NODES.filter(n => n.type === type);
      nodes.forEach((n, i) => {

        const connected = KNOWLEDGE_EDGES.find(e => e.source === n.id && KNOWLEDGE_NODES.find(nn => nn.id === e.target)?.type === "bodySystem");
        const targetId = connected?.target;
        const targetNode = result.find(r => r.id === targetId);

        const baseX = targetNode?.x ?? CX;
        const baseY = targetNode?.y ?? CY;

        const ringRadius = type === "disease" ? 180 : type === "symptom" ? 240 : type === "drug" ? 200 : type === "test" ? 220 : 160;
        const angle = (i / nodes.length) * 2 * Math.PI + types.indexOf(type);
        result.push({
          ...n,
          x: baseX + Math.cos(angle) * ringRadius,
          y: baseY + Math.sin(angle) * ringRadius,
        });
      });
    });

    return result;
  }, []);

  const visibleNodes = filter === "all"
    ? positionedNodes
    : positionedNodes.filter(n => n.type === filter);

  const visibleEdges = KNOWLEDGE_EDGES.filter(e => {
    if (filter !== "all") {
      const src = positionedNodes.find(n => n.id === e.source);
      const tgt = positionedNodes.find(n => n.id === e.target);
      return src?.type === filter || tgt?.type === filter;
    }
    return true;
  });

  const selectedNodeData = selectedNode ? KNOWLEDGE_NODES.find(n => n.id === selectedNode) : null;
  const selectedEdges = selectedNode ? KNOWLEDGE_EDGES.filter(e => e.source === selectedNode || e.target === selectedNode) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Medical Knowledge Graph</h1>
          <p className="mt-1 text-sm text-white/50">
            Interactive graph of {KNOWLEDGE_NODES.length} clinical entities · {KNOWLEDGE_EDGES.length} relationships
          </p>
        </div>
      </div>

      {}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "rounded-full border px-3 py-1 text-xs transition-colors",
            filter === "all" ? "border-white/30 bg-white/10 text-white" : "border-white/10 text-white/60 hover:text-white"
          )}
        >
          All ({KNOWLEDGE_NODES.length})
        </button>
        {(Object.keys(NODE_COLORS) as (keyof typeof NODE_COLORS)[]).map((type) => {
          const count = KNOWLEDGE_NODES.filter(n => n.type === type).length;
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors flex items-center gap-1.5",
                filter === type ? "border-white/30 bg-white/10 text-white" : "border-white/10 text-white/60 hover:text-white"
              )}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: NODE_COLORS[type] }} />
              <span className="capitalize">{type}s</span>
              <span className="text-white/40">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {}
        <Card className="glass lg:col-span-3 overflow-hidden">
          <div className="border-b border-white/5 p-4">
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-amber-300" />
              <h3 className="text-sm font-semibold text-white">Graph Visualization</h3>
              <span className="ml-auto text-[10px] text-white/40">Click nodes to explore · Hover to highlight</span>
            </div>
          </div>
          <div className="relative bg-black/20 grid-bg" style={{ height: 600 }}>
            <svg viewBox="0 0 900 600" className="w-full h-full">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.3)" />
                </marker>
              </defs>

              {}
              {visibleEdges.map((edge, i) => {
                const src = positionedNodes.find(n => n.id === edge.source);
                const tgt = positionedNodes.find(n => n.id === edge.target);
                if (!src || !tgt) return null;
                const isHighlighted = hoveredNode === src.id || hoveredNode === tgt.id || selectedNode === src.id || selectedNode === tgt.id;
                return (
                  <line
                    key={i}
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={isHighlighted ? "rgba(20, 184, 166, 0.6)" : "rgba(255,255,255,0.08)"}
                    strokeWidth={isHighlighted ? 1.5 : 0.8}
                    markerEnd="url(#arrow)"
                  />
                );
              })}

              {}
              {visibleNodes.map((node) => {
                const isHovered = hoveredNode === node.id;
                const isSelected = selectedNode === node.id;
                const isConnected = selectedNode && selectedEdges.some(e => e.source === node.id || e.target === node.id);
                const r = NODE_RADII[node.type];
                const color = NODE_COLORS[node.type];
                const opacity = !selectedNode || isSelected || isConnected ? 1 : 0.25;
                return (
                  <g
                    key={node.id}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setSelectedNode(isSelected ? null : node.id)}
                    style={{ cursor: "pointer", opacity }}
                    className="transition-opacity"
                  >
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={r + (isHovered || isSelected ? 4 : 0)}
                      fill={color}
                      fillOpacity={isSelected ? 0.4 : 0.2}
                      stroke={color}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 100 }}
                    />
                    {(node.type === "disease" || node.type === "bodySystem" || isHovered || isSelected) && (
                      <text
                        x={node.x}
                        y={node.y + r + 14}
                        textAnchor="middle"
                        fontSize={node.type === "disease" || node.type === "bodySystem" ? 11 : 10}
                        fill="white"
                        fontWeight={isSelected ? 600 : 400}
                        style={{ pointerEvents: "none", textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
                      >
                        {node.label.length > 22 ? node.label.slice(0, 22) + "…" : node.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {}
            <div className="absolute bottom-3 left-3 rounded-lg glass-strong p-3">
              <p className="text-[10px] uppercase tracking-wider text-white/40 mb-2">Node Types</p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                {(Object.keys(NODE_COLORS) as (keyof typeof NODE_COLORS)[]).map((type) => (
                  <div key={type} className="flex items-center gap-1.5 text-[10px]">
                    <span className="h-2 w-2 rounded-full" style={{ background: NODE_COLORS[type] }} />
                    <span className="text-white/70 capitalize">{type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {}
        <Card className="glass">
          <div className="border-b border-white/5 p-4">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-orange-300" />
              <h3 className="text-sm font-semibold text-white">Node Details</h3>
            </div>
          </div>
          <div className="p-4">
            {!selectedNodeData ? (
              <div className="text-center py-12">
                <Network className="mx-auto h-8 w-8 text-white/20" />
                <p className="mt-2 text-xs text-white/40">Click a node to see its relationships and clinical context</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-3 w-3 rounded-full" style={{ background: NODE_COLORS[selectedNodeData.type] }} />
                    <span className="text-[10px] uppercase tracking-wider text-white/40">{selectedNodeData.type}</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{selectedNodeData.label}</p>
                  {selectedNodeData.description && (
                    <p className="text-xs text-white/60 mt-1">{selectedNodeData.description}</p>
                  )}
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1.5">Relationships ({selectedEdges.length})</p>
                  <div className="space-y-1.5 max-h-72 overflow-y-auto scrollbar-thin">
                    {selectedEdges.map((e, i) => {
                      const other = e.source === selectedNode ? e.target : e.source;
                      const otherNode = KNOWLEDGE_NODES.find(n => n.id === other);
                      if (!otherNode) return null;
                      return (
                        <div key={i} className="rounded-md bg-white/[0.03] px-2 py-1.5">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full shrink-0" style={{ background: NODE_COLORS[otherNode.type] }} />
                            <span className="text-[11px] text-white/80 truncate">{otherNode.label}</span>
                          </div>
                          <p className="text-[9px] text-white/40 mt-0.5 ml-4">{e.relationship} · weight {e.weight}</p>
                        </div>
                      );
                    })}
                    {selectedEdges.length === 0 && (
                      <p className="text-[11px] text-white/40">No direct relationships</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
