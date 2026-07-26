import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2, BookOpen, Trophy, CalendarDays, Briefcase, Sparkles, Zap, Terminal
} from "lucide-react";
import Card from "./Card";
import { mockData } from "../data/mockData";

const tabs = [
  { label: "Problems",                shortLabel: "Problems",    icon: Code2 },
  { label: "Courses & Certs",         shortLabel: "Courses",     icon: BookOpen },
  { label: "Experience & Roles",      shortLabel: "Experience",  icon: Briefcase },
  { label: "Hackathons & Milestones", shortLabel: "Milestones",  icon: Trophy },
  { label: "Conferences",             shortLabel: "Talks",       icon: CalendarDays },
];

function ProblemAnalysisDashboard() {
  const topicCards = [
    { title: "Arrays & DP",          count: "68 solved", badge: "bg-purple-500/10 text-purple-300 border-purple-500/20" },
    { title: "Trees & Graphs",       count: "54 solved", badge: "bg-blue-500/10 text-blue-300 border-blue-500/20" },
    { title: "Lists & Stacks",       count: "46 solved", badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" },
    { title: "Hash Tables & System", count: "46 solved", badge: "bg-amber-500/10 text-amber-300 border-amber-500/20" },
  ];
  const languages = [
    { name: "TypeScript", color: "bg-blue-500/10 text-blue-300 border-blue-400/20" },
    { name: "Python",     color: "bg-yellow-500/10 text-yellow-300 border-yellow-400/20" },
    { name: "Java",       color: "bg-orange-500/10 text-orange-300 border-orange-400/20" },
    { name: "C++",        color: "bg-cyan-500/10 text-cyan-300 border-cyan-400/20" },
  ];

  return (
    <div className="mt-3 grid gap-3 grid-cols-1">
      <div className="rounded-xl border border-ink-650/70 bg-ink-950/40 p-3 sm:p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-xs text-white flex items-center gap-1.5">
            <Zap size={13} className="text-amber-400 shrink-0" />
            Core Topics
          </h4>
          <span className="text-[10px] font-mono text-zinc-500">200+ Solved</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {topicCards.map((t) => (
            <div key={t.title} className={`rounded-lg border p-2 ${t.badge} space-y-0.5`}>
              <p className="font-semibold text-[11px] text-white truncate">{t.title}</p>
              <p className="text-[10px] font-mono opacity-80">{t.count}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-ink-650/70 bg-ink-950/40 p-3 sm:p-4 space-y-2.5">
        <h4 className="font-semibold text-xs text-white flex items-center gap-1.5">
          <Terminal size={13} className="text-accent-400 shrink-0" />
          Languages & Patterns
        </h4>
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          Multi-language problem-solving across core data structure patterns.
        </p>
        <div className="space-y-1.5">
          <p className="text-[9px] uppercase font-mono tracking-wider text-zinc-500">Primary Languages</p>
          <div className="flex flex-wrap gap-1.5">
            {languages.map((l) => (
              <span key={l.name} className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${l.color}`}>
                {l.name}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 pt-1 border-t border-ink-650/40">
          {["Sliding Window", "Two Pointers", "BFS/DFS", "LRU Cache"].map((p) => (
            <span key={p} className="rounded border border-ink-650 bg-ink-900 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CoursesTab() {
  const courses = [
    {
      title: "JPMorgan Chase — Advanced Software Engineering",
      issuer: "Forage Virtual Experience",
      date: "2024",
      description: "Production-style Java services, Kafka event flows, and financial data modeling.",
      accent: "border-blue-500/30 bg-blue-500/5",
    },
    {
      title: "Full-Stack System Architecture & REST APIs",
      issuer: "Independent / Project Engineering",
      date: "2024",
      description: "Prisma PostgreSQL schemas, Zod validation, and Node.js Express APIs.",
      accent: "border-accent-500/30 bg-accent-500/5",
    },
    {
      title: "React 19 & Next.js Modern App Engineering",
      issuer: "Hands-on Production Build",
      date: "2025",
      description: "Server Actions, Better Auth, Tailwind v4, and Gemini RAG AI pipelines.",
      accent: "border-emerald-500/30 bg-emerald-500/5",
    },
  ];

  return (
    <div className="mt-3 grid gap-3 grid-cols-1 sm:grid-cols-3">
      {courses.map((c) => (
        <div key={c.title} className={`rounded-xl border p-3 space-y-2 ${c.accent} flex flex-col`}>
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-xs text-white line-clamp-2 flex-1">{c.title}</h4>
            <span className="shrink-0 text-[10px] font-mono text-zinc-400">{c.date}</span>
          </div>
          <p className="text-[11px] font-medium text-accent-300">{c.issuer}</p>
          <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-3 flex-1">{c.description}</p>
        </div>
      ))}
    </div>
  );
}

function ExperienceTab() {
  const experiences = [
    {
      role: "Full-Stack Engineer",
      company: "Orbit Technology Solutions",
      period: "2024 – Present",
      bullets: [
        "Architecting Finot ERP — enterprise platform with Finance, Inventory, HR, and Operations modules.",
        "Built RBAC and branch data scoping across PostgreSQL and Express REST APIs.",
      ],
    },
    {
      role: "Full-Stack Software Developer",
      company: "Independent & Open Source",
      period: "2023 – Present",
      bullets: [
        "Built Di-Assist — AI healthcare drug info platform with drug interaction engine and clinician analytics.",
        "Created custom RAG AI assistant & command palette portfolio.",
      ],
    },
  ];

  return (
    <div className="mt-3 grid gap-3 grid-cols-1 sm:grid-cols-2">
      {experiences.map((e) => (
        <div key={e.role} className="rounded-xl border border-ink-650 bg-ink-950/40 p-3 sm:p-4 space-y-2 flex flex-col">
          <div className="flex flex-wrap items-start justify-between gap-1 border-b border-ink-650/60 pb-2">
            <div className="min-w-0">
              <h4 className="font-semibold text-xs sm:text-sm text-white">{e.role}</h4>
              <p className="text-[11px] font-medium text-accent-300">{e.company}</p>
            </div>
            <span className="rounded bg-ink-800 px-2 py-0.5 text-[10px] font-mono text-zinc-400 shrink-0">{e.period}</span>
          </div>
          <ul className="space-y-1.5 flex-1">
            {e.bullets.map((b, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[11px] text-zinc-400 leading-relaxed">
                <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function MilestonesTab() {
  const milestones = [
    {
      title: "Finot ERP Multi-Branch Engine",
      date: "2025",
      type: "Enterprise Release",
      desc: "Multi-tenant branch isolation & role-based permissions across 8 ERP modules.",
      color: "border-purple-500/30 bg-purple-500/5",
    },
    {
      title: "Di-Assist AI Healthcare Beta",
      date: "2025",
      type: "Product Launch",
      desc: "Clinical drug interaction checker and Gemini AI assistant platform.",
      color: "border-emerald-500/30 bg-emerald-500/5",
    },
    {
      title: "JPMorgan Chase Software Engineering",
      date: "2024",
      type: "Virtual Experience",
      desc: "Production Kafka message flow and financial service extensions.",
      color: "border-blue-500/30 bg-blue-500/5",
    },
  ];

  return (
    <div className="mt-3 grid gap-3 grid-cols-1 sm:grid-cols-3">
      {milestones.map((m) => (
        <div key={m.title} className={`rounded-xl border p-3 space-y-2 ${m.color} flex flex-col`}>
          <div className="flex items-center justify-between gap-1">
            <span className="rounded bg-ink-800 px-2 py-0.5 text-[10px] font-semibold text-accent-300 truncate">{m.type}</span>
            <span className="text-[10px] font-mono text-zinc-400 shrink-0">{m.date}</span>
          </div>
          <h4 className="font-semibold text-xs sm:text-sm text-white">{m.title}</h4>
          <p className="text-[11px] text-zinc-400 leading-relaxed flex-1">{m.desc}</p>
        </div>
      ))}
    </div>
  );
}

function ConferencesTab() {
  return (
    <div className="mt-3 rounded-xl border border-ink-650 bg-ink-950/40 p-4 space-y-2.5 min-h-[160px] flex flex-col justify-center">
      <div className="flex items-center gap-2">
        <Sparkles size={15} className="text-amber-400 shrink-0" />
        <h4 className="font-semibold text-xs sm:text-sm text-white">Developer Community & Summits</h4>
      </div>
      <p className="text-xs leading-relaxed text-zinc-300">
        Active participant in software engineering meetups and technical summits in Addis Ababa 🇪🇹 — focusing on Enterprise ERP Architecture, PostgreSQL Performance Tuning, Next.js 15 Innovations, and Production AI RAG System Design.
      </p>
    </div>
  );
}

export default function ActivityCard() {
  const [activeTab, setActiveTab] = useState(0);
  const tabRefs = useRef([]);

  const handleTabKeyDown = (e, index) => {
    let next = index;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next = (index + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      next = (index - 1 + tabs.length) % tabs.length;
    } else return;
    setActiveTab(next);
    tabRefs.current[next]?.focus();
  };

  const { total, easy, medium, hard } = mockData.attempts;
  const easyNum  = parseInt(easy)   || 98;
  const medNum   = parseInt(medium) || 94;
  const hardNum  = parseInt(hard)   || 22;
  const totalNum = easyNum + medNum + hardNum;

  const easyPct = Math.round((easyNum / totalNum) * 100);
  const medPct  = Math.round((medNum  / totalNum) * 100);
  const hardPct = Math.round((hardNum / totalNum) * 100);

  return (
    <Card className="p-3 sm:p-5 w-full max-w-full min-w-0 overflow-hidden">

      {/* Tab bar — scrollable, short labels on mobile */}
      {/* 2-row grid on mobile (3 tabs top, 2 tabs bottom), 1-row flex on desktop */}
      <div
        role="tablist"
        aria-label="Activity categories"
        className="grid grid-cols-6 sm:flex sm:flex-nowrap items-center gap-1.5 sm:overflow-x-auto pb-2 border-b border-ink-650/60 w-full"
      >
        {tabs.map(({ label, shortLabel, icon: Icon }, index) => {
          const isActive = activeTab === index;
          const colSpanClass = index < 3 ? "col-span-2" : "col-span-3";

          return (
            <button
              key={label}
              ref={(el) => { tabRefs.current[index] = el; }}
              role="tab"
              aria-selected={isActive}
              aria-controls={`ac-panel-${index}`}
              id={`ac-tab-${index}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(index)}
              onKeyDown={(e) => handleTabKeyDown(e, index)}
              className={`relative flex items-center justify-center gap-1.5 shrink-0 rounded-full px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold transition-colors duration-150 ${colSpanClass} sm:col-span-1 ${
                isActive
                  ? "text-ink-950"
                  : "border border-ink-650/80 bg-ink-950/50 text-zinc-400 hover:border-accent-400/40 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="ac-tab-active"
                  className="absolute inset-0 rounded-full bg-white"
                  transition={{ type: "spring", bounce: 0.18, duration: 0.35 }}
                />
              )}
              <Icon size={12} className={`relative z-10 shrink-0 ${isActive ? "text-ink-950" : "text-zinc-400"}`} />
              <span className="relative z-10 whitespace-nowrap block sm:hidden">{shortLabel}</span>
              <span className="relative z-10 whitespace-nowrap hidden sm:block">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab panels */}
      <div
        role="tabpanel"
        id={`ac-panel-${activeTab}`}
        aria-labelledby={`ac-tab-${activeTab}`}
        className="w-full min-h-[240px] sm:min-h-[260px]"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {activeTab === 0 && (
              <div className="mt-3 space-y-3">
                {/* Stats header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-xs text-zinc-400">
                      Problems Solved: <span className="font-bold text-white">{total}</span>
                    </p>
                    <span className="rounded bg-accent-500/10 border border-accent-400/20 px-2 py-0.5 text-[10px] font-semibold text-accent-300">
                      LeetCode & DSA
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-emerald-300">
                      Easy <strong className="text-white ml-1">{easy}</strong>
                    </span>
                    <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-amber-300">
                      Medium <strong className="text-white ml-1">{medium}</strong>
                    </span>
                    <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-rose-300">
                      Hard <strong className="text-white ml-1">{hard}</strong>
                    </span>
                  </div>
                </div>

                {/* Ratio bar */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-700/80 flex">
                  <div className="h-full rounded-l-full bg-emerald-400 transition-all duration-500" style={{ width: `${easyPct}%` }} />
                  <div className="h-full bg-amber-400 transition-all duration-500"                  style={{ width: `${medPct}%`  }} />
                  <div className="h-full rounded-r-full bg-rose-400 transition-all duration-500"   style={{ width: `${hardPct}%` }} />
                </div>

                <ProblemAnalysisDashboard />
              </div>
            )}

            {activeTab === 1 && <CoursesTab />}
            {activeTab === 2 && <ExperienceTab />}
            {activeTab === 3 && <MilestonesTab />}
            {activeTab === 4 && <ConferencesTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  );
}
