import React, { useState, useRef } from "react";
import { Rocket, Boxes, Layers, ChevronDown, TrendingUp, Sparkles } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Card from "./Card";

const IS_FIRST = !sessionStorage.getItem("portfolio-booted");

const TIMEFRAME_DATA = {
  "6 Months": {
    points: [45, 62, 78, 54, 88, 96],
    labels: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"],
    milestones: [
      "Finot ERP Scaffold & DB Schema",
      "Di-Assist AI Drug Search",
      "Finot Multi-Branch RBAC",
      "Di-Assist Interaction Checker",
      "Finot Inventory & Finance Engine",
      "Portfolio RAG Integration & Polish",
    ],
  },
  "90 Days": {
    points: [52, 68, 54, 75, 88, 96],
    labels: ["Dec 1", "Dec 15", "Jan 1", "Jan 15", "Feb 1", "Feb 15"],
    milestones: [
      "Zod API Validation Layer",
      "Di-Assist Next.js 15 Upgrade",
      "Finot HR Module Sprint",
      "Prisma Schema Optimization",
      "Finot Multi-Tenant Auth",
      "Live Production Beta Deployment",
    ],
  },
  "30 Days": {
    points: [65, 72, 80, 84, 91, 96],
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Now"],
    milestones: [
      "ERP Operations Module",
      "Ask AI RAG Pipeline Test",
      "Component Design System",
      "GitHub Live Streak Sync",
      "Header & Mobile UI Refactor",
      "Production Performance Tuning",
    ],
  },
};

function ImpactStat({ icon: Icon, label, value, sub, color = "violet" }) {
  const colorMap = {
    violet: "text-accent-300 bg-accent-500/10 border-accent-400/20",
    emerald: "text-emerald-300 bg-emerald-500/10 border-emerald-400/20",
    blue: "text-blue-300 bg-blue-500/10 border-blue-400/20",
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="group min-w-0 rounded-xl border border-ink-650 bg-ink-950/40 p-3 sm:p-4 transition-[border-color,box-shadow] duration-200 hover:border-accent-400/30"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-xs text-zinc-400">
          <span className={`grid h-6 w-6 place-items-center rounded-lg border ${colorMap[color]}`}>
            <Icon size={13} />
          </span>
          <span className="truncate">{label}</span>
        </p>
      </div>
      <p className="mt-2 truncate text-lg sm:text-xl font-bold text-white">
        {value}
      </p>
      <p className="mt-0.5 text-[11px] text-zinc-500 truncate">{sub}</p>
    </motion.div>
  );
}

function LineChart({ timeframe }) {
  const [tooltip, setTooltip] = useState(null);
  const chartRef = useRef(null);
  const inView = useInView(chartRef, { once: true });
  const chartDelay = IS_FIRST ? 3.55 : 0.25;

  const currentData = TIMEFRAME_DATA[timeframe] || TIMEFRAME_DATA["6 Months"];
  const { points, labels, milestones } = currentData;

  const width = 680;
  const height = 220;
  const max = Math.max(...points, 100);
  const min = Math.min(...points, 0);

  const coords = points.map((point, index) => {
    const x = 36 + (index * (width - 72)) / (points.length - 1);
    const y = 24 + ((max - point) / (max - min)) * (height - 76);
    return [x, y];
  });

  const path = coords.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");
  const fillPath = `${path} L ${coords.at(-1)[0]} ${height - 36} L ${coords[0][0]} ${height - 36} Z`;

  return (
    <div ref={chartRef} className="chart-shell relative select-none w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-ink-700">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-label="Engineering velocity chart">
        <defs>
          <linearGradient id="line" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" style={{ stopColor: "rgb(168, 85, 247)" }} />
            <stop offset="100%" style={{ stopColor: "rgb(34, 197, 94)" }} />
          </linearGradient>
          <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" style={{ stopColor: "rgb(168, 85, 247)", stopOpacity: 0.25 }} />
            <stop offset="100%" style={{ stopColor: "rgb(34, 197, 94)", stopOpacity: 0.01 }} />
          </linearGradient>
          <filter id="chartGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {[0, 1, 2, 3].map((line) => (
          <line
            key={line}
            x1="36"
            x2={width - 36}
            y1={30 + line * 40}
            y2={30 + line * 40}
            stroke="rgb(var(--ink-650))"
            strokeDasharray="4 6"
            strokeOpacity="0.6"
          />
        ))}

        {/* Vertical hover indicator */}
        {tooltip && (
          <line
            x1={coords[tooltip.index][0]}
            x2={coords[tooltip.index][0]}
            y1="24"
            y2={height - 36}
            stroke="rgb(var(--accent-300))"
            strokeOpacity="0.35"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        )}

        {/* Shaded Area */}
        <motion.path
          d={fillPath}
          fill="url(#area)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: chartDelay + 0.3, duration: 0.6 }}
        />

        {/* Line */}
        <motion.path
          d={path}
          fill="none"
          stroke="url(#line)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
          filter="url(#chartGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{
            pathLength: { duration: 1.2, ease: "easeInOut", delay: chartDelay },
            opacity: { duration: 0.1, delay: chartDelay },
          }}
        />

        {/* Data points */}
        {coords.map(([x, y], index) => {
          const isSelected = tooltip?.index === index;
          return (
            <g key={`point-${index}`}>
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 7 : 4.5}
                fill="#0d0d0f"
                stroke={isSelected ? "#22c55e" : "#a855f7"}
                strokeWidth="2.5"
                className="transition-all duration-150"
              />
              <circle
                cx={x}
                cy={y}
                r="18"
                fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltip({
                    index,
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                    value: points[index],
                    label: labels[index],
                    milestone: milestones[index],
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            </g>
          );
        })}

        {/* Month X Labels */}
        {labels.map((label, index) => (
          <text
            key={label}
            x={coords[index][0]}
            y={height - 10}
            textAnchor="middle"
            fill={tooltip?.index === index ? "rgb(var(--accent-300))" : "#71717a"}
            fontSize="12"
            fontFamily="monospace"
            className="transition-colors duration-150"
          >
            {label}
          </text>
        ))}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-xl border border-accent-400/30 bg-ink-900/95 px-3.5 py-2.5 text-xs shadow-2xl backdrop-blur-md max-w-xs"
          style={{ left: tooltip.x, top: tooltip.y - 12 }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-ink-650/60 pb-1 mb-1.5">
            <span className="font-mono text-[11px] font-semibold text-accent-300">{tooltip.label}</span>
            <span className="flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
              <TrendingUp size={10} />
              {tooltip.value}% velocity
            </span>
          </div>
          <p className="text-[11px] text-zinc-300 flex items-start gap-1">
            <Sparkles size={11} className="text-amber-400 shrink-0 mt-0.5" />
            <span>{tooltip.milestone}</span>
          </p>
          <div
            className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent"
            style={{ borderTopColor: "rgba(24, 24, 27, 0.95)" }}
          />
        </div>
      )}
    </div>
  );
}

export default function RankingCard() {
  const [timeframe, setTimeframe] = useState("6 Months");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const options = ["30 Days", "90 Days", "6 Months"];

  return (
    <Card className="p-4 sm:p-6" beam beamProps={{ colorFrom: "#a855f7", colorTo: "#22c55e", opacity: 0.25 }}>
      {/* Header + Stats */}
      <div className="mb-4 space-y-4">
        {/* Title row */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base font-bold text-white sm:text-lg">
                Engineering Impact & Velocity
              </h2>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                Live Systems
              </span>
            </div>
            <p className="mt-0.5 text-xs text-zinc-400">
              Feature delivery & architecture output across production applications
            </p>
          </div>

          {/* Timeframe Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-ink-650 bg-ink-800/80 px-3.5 py-1.5 text-xs text-zinc-300 transition hover:border-accent-400/50 hover:text-white"
            >
              <span>{timeframe}</span>
              <ChevronDown size={13} className={`text-zinc-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-30 mt-1.5 w-32 overflow-hidden rounded-xl border border-ink-650 bg-ink-900/95 py-1 shadow-xl backdrop-blur-xl"
                >
                  {options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setTimeframe(opt);
                        setDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs transition ${
                        opt === timeframe
                          ? "bg-accent-500/15 font-semibold text-accent-300"
                          : "text-zinc-400 hover:bg-ink-800 hover:text-zinc-200"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 3 Impact Stat Boxes */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
          <ImpactStat
            icon={Rocket}
            label="Production Systems"
            value="2 Live Apps"
            sub="Finot ERP & Di-Assist"
            color="violet"
          />
          <ImpactStat
            icon={Boxes}
            label="ERP Modules Built"
            value="8 Modules"
            sub="Finance, HR, Inventory, Ops"
            color="emerald"
          />
          <ImpactStat
            icon={Layers}
            label="Full-Stack Ownership"
            value="100% End-to-End"
            sub="PostgreSQL, REST APIs, React"
            color="blue"
          />
        </div>
      </div>

      {/* Interactive Line Chart */}
      <LineChart timeframe={timeframe} />
    </Card>
  );
}
