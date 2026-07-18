import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ExternalLink, TrendingUp, Filter } from "lucide-react";
import PageWrapper from "../components/shared/PageWrapper";
import Card from "../components/Card";
import FeaturedProjects from "../components/FeaturedProjects";
import { projects, allTags } from "../data/projects";
import { useScrollReveal, useStaggerReveal } from "../hooks/gsapUtils";

function IconGithub() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function ProjectCard({ project }) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-250 hover:border-accent-400/35 hover:shadow-glow">
      {/* Gradient banner */}
      <div className={`relative h-16 sm:h-20 bg-gradient-to-br ${project.accent || "from-accent-600/25 to-blue-600/15"}`}>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_40%,rgba(0,0,0,0.4))]" />
        {project.featured && (
          <span className="absolute left-2 sm:left-3 top-2 sm:top-3 rounded-full border border-amber-400/30 bg-amber-500/20 px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-300">
            Featured
          </span>
        )}
        <div className="absolute right-2 sm:right-3 top-2 sm:top-3 flex gap-1">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              title="GitHub"
              aria-label="View on GitHub"
              className="grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-lg border border-white/10 bg-black/30 text-white/70 backdrop-blur-sm transition hover:border-white/30 hover:text-white"
            >
              <IconGithub />
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              title="Live demo"
              aria-label="View live demo"
              className="grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-lg border border-white/10 bg-black/30 text-white/70 backdrop-blur-sm transition hover:border-white/30 hover:text-white"
            >
              <ExternalLink size={12} className="sm:w-[13px] sm:h-[13px]" />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <h3 className="font-display font-semibold text-sm sm:text-base text-white transition-colors group-hover:text-accent-200 line-clamp-2">
          {project.title}
        </h3>
        <p className="mt-2 flex-1 text-xs sm:text-sm leading-5 text-zinc-400 line-clamp-3">{project.description}</p>

        {/* Impact metric */}
        {project.impact && (
          <div className="mt-2 sm:mt-3 flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/8 px-2 sm:px-3 py-1 sm:py-1.5">
            <TrendingUp size={11} className="shrink-0 text-emerald-400" />
            <span className="text-[10px] sm:text-xs font-medium text-emerald-300">{project.impact}</span>
          </div>
        )}

        {/* Tags */}
        <div className="mt-2 sm:mt-3 flex flex-wrap gap-1">
          {project.tags.map((t) => (
            <span key={t} className="rounded-md border border-ink-650 bg-ink-950/40 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-xs text-zinc-400">
              {t}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-4 border-t border-ink-650/60 pt-2 sm:pt-3 text-[10px] sm:text-xs text-zinc-400">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ background: project.langColor }} />
            <span className="hidden sm:inline">{project.language}</span>
            <span className="sm:hidden truncate">{project.language.split("/")[0]}</span>
          </span>
          <span className="ml-auto whitespace-nowrap">
            {project.github ? "Open source" : "Company"}
          </span>
        </div>
      </div>
    </Card>
  );
}

export default function Projects() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const headerRef  = useScrollReveal({ y: 20, duration: 0.55 });
  const filtersRef = useScrollReveal({ y: 16, duration: 0.5, delay: 0.08 });
  const gridRef    = useStaggerReveal({ stagger: 0.1, y: 24 });

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchTag = activeTag === "All" || p.tags.includes(activeTag);
      const matchFeatured = !featuredOnly || p.featured;
      return matchSearch && matchTag && matchFeatured;
    });
  }, [search, activeTag, featuredOnly]);

  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Featured showcase */}
        <FeaturedProjects projects={featuredProjects} />

        {/* Header */}
        <div ref={headerRef} className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Projects</h1>
            <p className="mt-1 text-sm text-zinc-400">
              {projects.length} projects · from production ERP systems to solo builds
            </p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              {projects.filter((p) => p.featured).length} Featured
            </span>
          </div>
        </div>

        {/* Filters */}
        <div ref={filtersRef} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-ink-650 bg-ink-800/60 px-3 py-2.5">
            <Search size={15} className="shrink-0 text-accent-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects…"
              className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
            />
          </div>
          <button
            onClick={() => setFeaturedOnly((v) => !v)}
            className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
              featuredOnly
                ? "border-accent-400/40 bg-accent-500/15 text-accent-300"
                : "border-ink-650 bg-ink-800/60 text-zinc-400 hover:text-white"
            }`}
          >
            <Filter size={14} />
            Featured only
          </button>
        </div>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-2">
          {["All", ...allTags].map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                activeTag === tag
                  ? "bg-accent-500/20 text-accent-200 ring-1 ring-accent-400/30"
                  : "border border-ink-650 bg-ink-950/50 text-zinc-400 hover:text-zinc-300"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Grid — GSAP stagger reveal; Framer Motion handles filter re-order animations */}
        <motion.div
          ref={gridRef}
          layout
          className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2"
        >          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.22 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-zinc-400">No projects match your filters.</p>
            <button
              onClick={() => { setSearch(""); setActiveTag("All"); setFeaturedOnly(false); }}
              className="text-sm text-accent-400 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
