import React, { useState, useRef } from "react";
import { Globe2, Flag, BarChart3, ChevronDown } from "lucide-react";
import { motion, useInView } from "framer-motion";
import Card from "./Card";
import { mockData } from "../data/mockData";

const IS_FIRST = !sessionStorage.getItem("portfolio-booted");

function RankStat({ icon: Icon, label, value, prefix }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="group min-w-0 rounded-xl border border-ink-650 bg-ink-950/40 p-3 sm:p-4 transition-[border-color,box-shadow] duration-200 hover:border-accent-400/30 hover-accent-glow"
    >
      <p className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
        <motion.span
          className="flex"
          whileHover={{ rotate: 15 }}
          transition={{ duration: 0.2 }}
        >
          <Icon size={14} className="text-accent-300 transition-colors duration-200 group-hover:text-accent-200" />
        </motion.span>
        {label}
      </p>
      <p className="truncate text-base font-bold text-white sm:text-xl">
        {prefix && <span className="mr-2">{prefix}</span>}
        {value}
      </p>
    </motion.div>
  );
}

function LineChart() {
  const [tooltip, setTooltip] = useState(null);
  const chartRef = useRef(null);
  const inView = useInView(chartRef, { once: true });
  const chartDelay = IS_FIRST ? 3.55 : 0.25;
  const points = mockData.ranks.points;
  const labels = mockData.ranks.labels;
  const width = 680;
  const height = 220;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const coords = points.map((point, index) => {
    const x = 32 + (index * (width - 64)) / (points.length - 1);
    const y = 22 + ((point - min) / (max - min)) * (height - 74);
    return [x, y];
  });
  const path = coords.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");
  const fillPath = `${path} L ${coords.at(-1)[0]} ${height - 36} L ${coords[0][0]} ${height - 36} Z`;

  return (
    <div ref={chartRef} className="chart-shell">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Rank progression chart">
        <defs>
          <linearGradient id="line" x1="0" x2="1">
            <stop offset="0%" style={{ stopColor: "rgb(var(--accent-300))" }} />
            <stop offset="100%" style={{ stopColor: "rgb(var(--accent-600))" }} />
          </linearGradient>
          <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" style={{ stopColor: "rgb(var(--accent-500))", stopOpacity: 0.28 }} />
            <stop offset="100%" style={{ stopColor: "rgb(var(--accent-500))", stopOpacity: 0 }} />
          </linearGradient>
          <filter id="chartGlow">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="dotGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {[0, 1, 2, 3].map((line) => (
          <line
            key={line}
            x1="32"
            x2={width - 32}
            y1={30 + line * 42}
            y2={30 + line * 42}
            stroke="rgb(var(--ink-650))"
            strokeDasharray="5 8"
          />
        ))}

        {/* Vertical hover indicator */}
        {tooltip && (
          <line
            x1={coords[tooltip.index][0]}
            x2={coords[tooltip.index][0]}
            y1="22"
            y2={height - 36}
            stroke="rgb(var(--accent-300))"
            strokeOpacity="0.25"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        )}

        <motion.path
          d={fillPath}
          fill="url(#area)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: chartDelay + 0.9, duration: 0.7 }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke="url(#line)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="5"
          filter="url(#chartGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{
            pathLength: { duration: 1.4, ease: "easeInOut", delay: chartDelay },
            opacity: { duration: 0.1, delay: chartDelay },
          }}
        />

        {/* Data points */}
        {coords.map(([x, y], index) => (
          <g key={`point-${index}`}>
            <circle
              cx={x}
              cy={y}
              r={tooltip?.index === index ? 7 : 5}
              fill="#0d0d0f"
              stroke={tooltip?.index === index ? "rgb(var(--accent-200))" : "rgb(var(--accent-300))"}
              strokeWidth="3"
              filter={tooltip?.index === index ? "url(#dotGlow)" : undefined}
              style={{ transition: "r 0.15s ease, stroke 0.15s ease" }}
            />
            {/* Transparent hit area */}
            <circle
              cx={x}
              cy={y}
              r="18"
              fill="transparent"
              style={{ cursor: "crosshair" }}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltip({
                  index,
                  x: rect.left + rect.width / 2,
                  y: rect.top,
                  value: points[index],
                  label: labels[index],
                });
              }}
              onMouseLeave={() => setTooltip(null)}
            />
          </g>
        ))}

        {labels.map((label, index) => (
          <text
            key={label}
            x={32 + (index * (width - 64)) / (labels.length - 1)}
            y={height - 10}
            textAnchor="middle"
            fill={tooltip?.index === index ? "rgb(var(--accent-300))" : "#a1a1aa"}
            fontSize="13"
            style={{ transition: "fill 0.15s ease" }}
          >
            {label}
          </text>
        ))}
      </svg>

      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-lg border border-accent-400/30 bg-ink-800 px-3 py-2 text-xs shadow-xl shadow-black/40"
          style={{ left: tooltip.x, top: tooltip.y - 12 }}
        >
          <p className="font-semibold text-accent-300">{tooltip.label}</p>
          <p className="mt-0.5 text-white">
            Rank{" "}
            <span className="font-bold">#{tooltip.value.toLocaleString()}</span>
          </p>
          <div
            className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent"
            style={{ borderTopColor: "#1a1a1e" }}
          />
        </div>
      )}
    </div>
  );
}

export default function RankingCard() {
  return (
    <Card className="p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <RankStat icon={Globe2} label="Global Rank" value={mockData.ranks.global} />
          <RankStat icon={Flag} label="Country Rank" value={mockData.ranks.country} prefix="🇮🇳" />
          <RankStat icon={BarChart3} label="Percentile" value={mockData.ranks.percentile} />
        </div>
        <button className="flex w-max items-center gap-2 rounded-full border border-ink-650 bg-ink-950/60 px-4 py-2 text-sm text-zinc-300">
          30 Days
          <ChevronDown size={15} />
        </button>
      </div>
      <LineChart />
    </Card>
  );
}
