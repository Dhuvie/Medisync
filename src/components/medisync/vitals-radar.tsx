"use client";

import type { VitalAnalysis } from "@/lib/medical/types";

interface VitalsRadarProps {
  vitals: VitalAnalysis[];
  size?: number;
}

const VITAL_COLORS: Record<string, string> = {
  normal: "#16A34A",
  low: "#D97706",
  high: "#D97706",
  "critical-low": "#DC2626",
  "critical-high": "#DC2626",
};

export function VitalsRadar({ vitals, size = 280 }: VitalsRadarProps) {

  const radarVitals = vitals.slice(0, 6);
  const center = size / 2;
  const maxRadius = size / 2 - 50;
  const numPoints = radarVitals.length;

  const points = radarVitals.map((v, i) => {
    const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
    let radius = maxRadius;

    if (v.status === "normal") radius = maxRadius;
    else if (v.status === "low" || v.status === "high") radius = maxRadius * 0.7;
    else if (v.status.includes("critical")) radius = maxRadius * 0.4;

    const x = center + Math.cos(angle) * radius;
    const y = center + Math.sin(angle) * radius;
    return { x, y, vital: v, angle, radius };
  });

  const polygonPath = points.map(p => `${p.x},${p.y}`).join(" ");

  const rings = [1, 0.75, 0.5, 0.25];

  const axisLines = points.map(p => ({
    x2: center + Math.cos(p.angle) * maxRadius,
    y2: center + Math.sin(p.angle) * maxRadius,
  }));

  const labels = radarVitals.map((v, i) => {
    const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
    const labelRadius = maxRadius + 28;
    return {
      x: center + Math.cos(angle) * labelRadius,
      y: center + Math.sin(angle) * labelRadius,
      vital: v,
      value: v.value,
    };
  });

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="radar-glow" style={{ maxWidth: size, maxHeight: size }}>

      {rings.map((r, i) => (
        <circle
          key={i}
          cx={center}
          cy={center}
          r={maxRadius * r}
          fill="none"
          stroke="#B8C8F0"
          strokeWidth={1}
          strokeDasharray={r === 1 ? "0" : "3 3"}
          opacity={0.5}
        />
      ))}

      {axisLines.map((line, i) => (
        <line
          key={i}
          x1={center}
          y1={center}
          x2={line.x2}
          y2={line.y2}
          stroke="#B8C8F0"
          strokeWidth={1}
          opacity={0.4}
        />
      ))}

      <polygon
        points={radarVitals.map((_, i) => {
          const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
          return `${center + Math.cos(angle) * maxRadius},${center + Math.sin(angle) * maxRadius}`;
        }).join(" ")}
        fill="none"
        stroke="#16A34A"
        strokeWidth={1.5}
        strokeDasharray="4 4"
        opacity={0.3}
      />

      <polygon
        points={polygonPath}
        fill="rgba(113, 7, 231, 0.15)"
        stroke="#7107E7"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />

      {points.map((p, i) => {
        const color = VITAL_COLORS[p.vital.status] || "#7107E7";
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={5} fill={color} stroke="white" strokeWidth={2} />
            {p.vital.status !== "normal" && (
              <circle cx={p.x} cy={p.y} r={9} fill="none" stroke={color} strokeWidth={1.5} opacity={0.4}>
                <animate attributeName="r" values="5;11;5" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0;0.6" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        );
      })}

      <circle cx={center} cy={center} r={4} fill="#1C202B" />

      {labels.map((l, i) => {
        const color = VITAL_COLORS[l.vital.status] || "#1C202B";
        const isAbnormal = l.vital.status !== "normal";
        return (
          <g key={i}>
            <text
              x={l.x}
              y={l.y - 6}
              textAnchor="middle"
              fontSize={9}
              fontFamily="monospace"
              fontWeight="600"
              fill="#5A6BB8"
              style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
            >
              {l.vital.metric.length > 10 ? l.vital.metric.slice(0, 10) : l.vital.metric}
            </text>
            <text
              x={l.x}
              y={l.y + 6}
              textAnchor="middle"
              fontSize={12}
              fontFamily="monospace"
              fontWeight="700"
              fill={color}
            >
              {l.value}
            </text>
            {isAbnormal && (
              <text
                x={l.x}
                y={l.y + 18}
                textAnchor="middle"
                fontSize={8}
                fontFamily="monospace"
                fill={color}
                opacity={0.7}
              >
                {l.vital.status.toUpperCase()}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
