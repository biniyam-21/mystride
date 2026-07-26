import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Layers, Image as ImageIcon, Cpu, AlertTriangle, Lightbulb,
  ExternalLink, ChevronRight, CheckCircle2, Copy, Check
} from "lucide-react";
import { projectArchitectureData } from "../data/projectArchitecture";

const TABS = [
  { id: "overview", label: "Overview", icon: Layers },
  { id: "screenshots", label: "Screenshots", icon: ImageIcon },
  { id: "techstack", label: "Tech Stack", icon: Cpu },
  { id: "problems", label: "Problems Solved", icon: AlertTriangle },
  { id: "lessons", label: "Lessons Learned", icon: Lightbulb },
];

function IconGithub() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function ProjectArchitectureModal({ projectId, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedCode, setCopiedCode] = useState(false);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (projectId) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [projectId, onClose]);

  if (!projectId) return null;

  const data = projectArchitectureData[projectId];

  if (!data) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getMethodBadgeClass = (method) => {
    switch (method) {
      case "GET": return "bg-blue-500/15 border-blue-500/30 text-blue-300";
      case "POST": return "bg-emerald-500/15 border-emerald-500/30 text-emerald-300";
      case "PUT": return "bg-amber-500/15 border-amber-500/30 text-amber-300";
      case "DELETE": return "bg-rose-500/15 border-rose-500/30 text-rose-300";
      default: return "bg-zinc-500/15 border-zinc-500/30 text-zinc-300";
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        />

        {/* Main Architecture Viewer Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-ink-650/80 bg-ink-950/95 shadow-2xl backdrop-blur-2xl"
        >
          {/* Top Header Bar */}
          <div className="flex items-center justify-between border-b border-ink-650/60 bg-ink-900/80 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent-400/30 bg-accent-500/15 text-accent-300 font-bold text-lg shadow-glow">
                {data.title.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white truncate">{data.title}</h2>
                  <span className="hidden sm:inline-block rounded-full bg-accent-500/20 border border-accent-400/30 px-2.5 py-0.5 text-[10px] font-semibold text-accent-300">
                    Architecture Viewer
                  </span>
                </div>
                <p className="text-xs text-zinc-400 truncate">{data.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {data.overview.githubUrl && (
                <a
                  href={data.overview.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border border-ink-650 bg-ink-800 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-accent-400/40 hover:text-white transition"
                >
                  <IconGithub />
                  <span className="hidden sm:inline">GitHub</span>
                </a>
              )}
              {data.overview.liveUrl && (
                <a
                  href={data.overview.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-xl bg-accent-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-500 transition shadow-glow"
                >
                  <ExternalLink size={13} />
                  <span className="hidden sm:inline">Live Demo</span>
                </a>
              )}
              <button
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-xl border border-ink-650 bg-ink-800 text-zinc-400 transition hover:bg-ink-700 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Navigation Bar (Tabs) */}
          <div className="flex overflow-x-auto border-b border-ink-650/60 bg-ink-900/40 px-3 py-2 scrollbar-none gap-1 sm:gap-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-accent-500/20 text-accent-200 border border-accent-400/40 shadow-glow"
                      : "border border-transparent text-zinc-400 hover:bg-ink-800/60 hover:text-zinc-200"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-accent-300" : "text-zinc-500"} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Body Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-ink-700">
            <AnimatePresence mode="wait">
              {/* 1. OVERVIEW */}
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="rounded-2xl border border-ink-650/70 bg-ink-900/50 p-5 space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-accent-300 flex items-center gap-2">
                      <Layers size={16} /> System Overview & Scope
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-300">{data.overview.summary}</p>
                    <div className="flex flex-wrap gap-4 pt-2 text-xs text-zinc-400">
                      <div>
                        <span className="font-semibold text-zinc-300">Role: </span>
                        {data.role}
                      </div>
                      <div>
                        <span className="font-semibold text-zinc-300">Category: </span>
                        {data.category}
                      </div>
                      <div>
                        <span className="font-semibold text-zinc-300">Status: </span>
                        <span className="text-emerald-400 font-medium">{data.status}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">Key Architectural Highlights</h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {data.overview.highlights.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 rounded-xl border border-ink-650/60 bg-ink-900/30 p-3.5">
                          <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-xs text-zinc-300 leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 2. SCREENSHOTS */}
              {activeTab === "screenshots" && (
                <motion.div
                  key="screenshots"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="grid gap-6 sm:grid-cols-2">
                    {data.screenshots.map((screen, idx) => (
                      <div key={idx} className="group overflow-hidden rounded-2xl border border-ink-650/80 bg-ink-900/40 shadow-lg">
                        <div className="h-48 overflow-hidden bg-ink-950">
                          <img
                            src={screen.url}
                            alt={screen.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4 space-y-1">
                          <h4 className="text-sm font-semibold text-white">{screen.title}</h4>
                          <p className="text-xs text-zinc-400 leading-relaxed">{screen.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 3. TECH STACK */}
              {activeTab === "techstack" && (
                <motion.div
                  key="techstack"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Cpu size={16} className="text-accent-400" />
                    Comprehensive Technology Stack
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {Object.entries(data.techStack).map(([category, items]) => (
                      items && items.length > 0 && (
                        <div key={category} className="rounded-xl border border-ink-650/60 bg-ink-900/40 p-4 space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-accent-300">
                            {category.replace("_", " & ")}
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {items.map((tech) => (
                              <span key={tech} className="rounded-lg border border-ink-650 bg-ink-950 px-2.5 py-1 text-xs text-zinc-300">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 7. PROBLEMS SOLVED */}
              {activeTab === "problems" && (
                <motion.div
                  key="problems"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-400" />
                    Engineering Challenges & Solutions
                  </h3>

                  <div className="space-y-3">
                    {data.problemsSolved.map((item, idx) => (
                      <div key={idx} className="rounded-xl border border-ink-650/70 bg-ink-900/40 p-4 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
                          <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] text-rose-400">CHALLENGE</span>
                          {item.problem}
                        </div>
                        <div className="flex items-start gap-2 text-xs text-emerald-300 pt-1">
                          <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400 shrink-0">SOLUTION</span>
                          <span className="text-zinc-300 leading-relaxed">{item.solution}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 8. LESSONS LEARNED */}
              {activeTab === "lessons" && (
                <motion.div
                  key="lessons"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Lightbulb size={16} className="text-amber-400" />
                    Key Retrospective Takeaways
                  </h3>

                  <div className="space-y-3">
                    {data.lessonsLearned.map((lesson, idx) => (
                      <div key={idx} className="flex items-start gap-3 rounded-xl border border-ink-650/60 bg-ink-900/40 p-4">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-500/20 text-accent-300 text-xs font-bold">
                          {idx + 1}
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed pt-0.5">{lesson}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between border-t border-ink-650/60 bg-ink-900/60 px-4 py-3 sm:px-6 text-xs text-zinc-400">
            <span>Use top tabs to inspect engineering depth</span>
            <button
              onClick={onClose}
              className="rounded-xl border border-ink-650 bg-ink-800 px-4 py-1.5 font-medium text-zinc-300 hover:text-white transition"
            >
              Close Viewer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
