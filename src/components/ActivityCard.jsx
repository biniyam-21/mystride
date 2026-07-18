import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Check, BookOpen, Trophy, CalendarDays, BriefcaseBusiness, Layers } from "lucide-react";
import Card from "./Card";
import { mockData } from "../data/mockData";

function DifficultyBadge({ difficulty }) {
  const classes = {
    Easy: "bg-emerald-500/10 text-emerald-300",
    Medium: "bg-amber-500/10 text-amber-300",
    Hard: "bg-rose-500/10 text-rose-300",
  };
  return (
    <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${classes[difficulty]}`}>
      {difficulty}
    </span>
  );
}

function ProblemTable() {
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full min-w-0 text-left text-sm">
        <thead className="text-xs uppercase text-zinc-400">
          <tr className="border-b border-ink-650">
            <th className="py-3 pr-4 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Title</th>
            <th className="px-4 py-3 font-semibold">Topic</th>
            <th className="py-3 pl-4 font-semibold">Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {mockData.problems.map((problem) => (
            <tr key={problem.title} className="group/row border-b border-ink-650/70 text-zinc-300 last:border-0 transition-colors duration-150 hover:bg-accent-500/[0.04]">
              <td className="py-4 pr-4">
                <motion.span
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ duration: 0.18 }}
                  className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500/10 text-emerald-300 transition-[background-color] duration-150 group-hover/row:bg-emerald-500/20"
                >
                  <Check size={16} />
                </motion.span>
              </td>
              <td className="px-4 py-4 font-medium text-white">{problem.title}</td>
              <td className="px-4 py-4 text-zinc-400">{problem.topic}</td>
              <td className="py-4 pl-4">
                <DifficultyBadge difficulty={problem.difficulty} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ icon: Icon, label }) {
  return (
    <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-ink-650 py-10 text-center">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-ink-800 text-zinc-400">
        <Icon size={20} />
      </div>
      <p className="text-sm text-zinc-400">No {label.toLowerCase()} activity yet</p>
    </div>
  );
}

const tabs = [
  { label: "Problems", icon: Layers },
  { label: "Courses", icon: BookOpen },
  { label: "Hackathon", icon: Trophy },
  { label: "Conference", icon: CalendarDays },
  { label: "Internship", icon: BriefcaseBusiness },
  { label: "Job", icon: BriefcaseBusiness },
];

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
    } else if (e.key === "Home") {
      e.preventDefault();
      next = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      next = tabs.length - 1;
    } else {
      return;
    }
    setActiveTab(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <Card className="p-4 sm:p-6">
      <div role="tablist" aria-label="Activity categories" className="flex flex-wrap gap-1.5 overflow-x-auto pb-2">
        {tabs.map(({ label }, index) => {
          const isActive = activeTab === index;
          return (
            <button
              key={label}
              ref={(el) => { tabRefs.current[index] = el; }}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tab-panel-${index}`}
              id={`tab-${index}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(index)}
              onKeyDown={(e) => handleTabKeyDown(e, index)}
              className={`relative shrink-0 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-colors duration-150 ${
                isActive
                  ? "text-ink-950"
                  : "border border-ink-650 bg-ink-950/50 text-zinc-400 hover:border-accent-400/40 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-full bg-white"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.38 }}
                />
              )}
              <span className="relative z-10">{label}</span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`tab-panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
      {activeTab === 0 ? (
        <>
          <div className="mt-5">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-zinc-400">
                Total Question Attempt:{" "}
                <span className="font-semibold text-white">{mockData.attempts.total}</span>
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-emerald-300">
                  Easy {mockData.attempts.easy}
                </span>
                <span className="rounded-full bg-amber-500/10 px-3 py-1.5 text-amber-300">
                  Medium {mockData.attempts.medium}
                </span>
                <span className="rounded-full bg-rose-500/10 px-3 py-1.5 text-rose-300">
                  Hard {mockData.attempts.hard}
                </span>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-ink-650">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-400"
                initial={{ width: "0%" }}
                animate={{ width: "38%" }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              />
            </div>
          </div>
          <ProblemTable />
        </>
      ) : (
        <EmptyState icon={tabs[activeTab].icon} label={tabs[activeTab].label} />
      )}
      </div>
    </Card>
  );
}
