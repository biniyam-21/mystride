import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Layers, Image as ImageIcon, Database, FolderTree,
  Webhook, Cpu, AlertTriangle, Lightbulb, ExternalLink,
  CheckCircle2, Copy, Check
} from "lucide-react";
import PageWrapper from "../components/shared/PageWrapper";
import Card from "../components/Card";
import { projectArchitectureData } from "../data/projectArchitecture";

const TABS = [
  { id: "overview", label: "Overview", icon: Layers },
  { id: "screenshots", label: "Screenshots", icon: ImageIcon },
  { id: "database", label: "Database Schema", icon: Database },
  { id: "folder", label: "Folder Structure", icon: FolderTree },
  { id: "api", label: "API Design", icon: Webhook },
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

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedCode, setCopiedCode] = useState(false);

  const data = projectArchitectureData[id];

  if (!data) {
    return (
      <PageWrapper>
        <div className="mx-auto max-w-2xl py-12 text-center">
          <Card className="p-8">
            <h2 className="text-xl font-bold text-white">Project Not Found</h2>
            <p className="mt-2 text-sm text-zinc-400">The architecture specifications for this project ID do not exist.</p>
            <button
              onClick={() => navigate("/projects")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-500"
            >
              <ArrowLeft size={16} />
              Back to Projects
            </button>
          </Card>
        </div>
      </PageWrapper>
    );
  }

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
    <PageWrapper>
      <div className="mx-auto max-w-5xl space-y-6 pb-12">
        {/* Navigation back */}
        <button
          onClick={() => navigate("/projects")}
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 transition hover:text-accent-300"
        >
          <ArrowLeft size={14} />
          Back to Projects
        </button>

        {/* Top Header Card */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-accent-400/30 bg-accent-500/15 text-accent-300 font-bold text-xl shadow-glow">
                {data.title.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{data.title}</h1>
                  <span className="rounded-full bg-accent-500/20 border border-accent-400/30 px-2.5 py-0.5 text-[10px] font-semibold text-accent-300">
                    Architecture Specification
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">{data.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {data.overview.githubUrl && (
                <a
                  href={data.overview.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border border-ink-650 bg-ink-800 px-3.5 py-2 text-xs font-medium text-zinc-300 hover:border-accent-400/40 hover:text-white transition"
                >
                  <IconGithub />
                  <span>GitHub Repository</span>
                </a>
              )}
              {data.overview.liveUrl && (
                <a
                  href={data.overview.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-xl bg-accent-600 px-4 py-2 text-xs font-semibold text-white hover:bg-accent-500 transition shadow-glow"
                >
                  <ExternalLink size={14} />
                  <span>Live App</span>
                </a>
              )}
            </div>
          </div>

          {/* Navigation Bar (Tabs) */}
          <div className="mt-6 flex overflow-x-auto border-t border-ink-650/60 pt-4 scrollbar-none gap-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
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
        </Card>

        {/* Content Body Area */}
        <Card className="p-6">
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
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-accent-300 flex items-center gap-2">
                    <Layers size={16} /> System Overview & Scope
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-300">{data.overview.summary}</p>
                  <div className="flex flex-wrap gap-4 pt-2 text-xs text-zinc-400 border-t border-ink-650/40">
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
                      <div className="h-52 overflow-hidden bg-ink-950">
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

            {/* 3. DATABASE SCHEMA */}
            {activeTab === "database" && (
              <motion.div
                key="database"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Database size={16} className="text-accent-400" />
                      Database Architecture
                    </h3>
                    <p className="text-xs text-zinc-400">{data.databaseSchema.orm}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(data.databaseSchema.diagramText)}
                    className="flex items-center gap-1.5 rounded-lg border border-ink-650 bg-ink-800 px-3 py-1.5 text-xs text-zinc-300 hover:text-white"
                  >
                    {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copiedCode ? "Copied" : "Copy ERD"}</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-ink-650 bg-ink-950 p-4 font-mono text-xs text-emerald-300">
                  <pre>{data.databaseSchema.diagramText}</pre>
                </div>

                <div>
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">Core Entities & Models</h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {data.databaseSchema.entities.map((entity, idx) => (
                      <div key={idx} className="rounded-xl border border-ink-650/60 bg-ink-900/40 p-3 space-y-1">
                        <span className="text-xs font-bold text-accent-300 font-mono">{entity.name}</span>
                        <p className="text-[11px] text-zinc-400 font-mono leading-relaxed">{entity.fields}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. FOLDER STRUCTURE */}
            {activeTab === "folder" && (
              <motion.div
                key="folder"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FolderTree size={16} className="text-accent-400" />
                    Repository Directory Structure
                  </h3>
                  <button
                    onClick={() => copyToClipboard(data.folderStructure)}
                    className="flex items-center gap-1.5 rounded-lg border border-ink-650 bg-ink-800 px-3 py-1.5 text-xs text-zinc-300 hover:text-white"
                  >
                    {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copiedCode ? "Copied" : "Copy Tree"}</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-ink-650 bg-ink-950 p-4 font-mono text-xs text-accent-300 leading-relaxed">
                  <pre>{data.folderStructure}</pre>
                </div>
              </motion.div>
            )}

            {/* 5. API DESIGN */}
            {activeTab === "api" && (
              <motion.div
                key="api"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Webhook size={16} className="text-accent-400" />
                  REST Endpoint Specification
                </h3>

                {data.apiDesign.length === 0 ? (
                  <p className="text-xs text-zinc-400 py-6 text-center">Static frontend project — no backend REST API endpoints.</p>
                ) : (
                  <div className="space-y-3">
                    {data.apiDesign.map((api, idx) => (
                      <div key={idx} className="rounded-xl border border-ink-650/70 bg-ink-900/40 p-4 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2 font-mono">
                            <span className={`rounded-md border px-2 py-0.5 text-xs font-bold ${getMethodBadgeClass(api.method)}`}>
                              {api.method}
                            </span>
                            <span className="text-xs font-semibold text-white">{api.endpoint}</span>
                          </div>
                          <span className="rounded-md border border-ink-650 bg-ink-950 px-2 py-0.5 text-[10px] text-zinc-400">
                            {api.auth}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-300">{api.desc}</p>
                        <div className="rounded-lg border border-ink-650/40 bg-ink-950/80 p-2.5 font-mono text-[11px] text-emerald-300">
                          {api.response}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* 6. TECH STACK */}
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
        </Card>
      </div>
    </PageWrapper>
  );
}
