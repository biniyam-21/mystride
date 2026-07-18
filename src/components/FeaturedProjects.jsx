import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ChevronLeft, ChevronRight, TrendingUp, Sparkles } from "lucide-react";

function IconGithub() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

/** Decorative browser chrome mockup containing a gradient "screenshot" */
function ProjectMockup({ project, visible }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={visible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="relative overflow-hidden rounded-xl border border-white/10 bg-ink-850/60 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
    >
      {/* Browser chrome bar */}
      <div className="flex items-center gap-2 border-b border-white/8 bg-ink-900/80 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
        <div className="ml-2 flex-1 rounded-md border border-white/8 bg-ink-800/60 px-3 py-0.5 text-center text-[10px] text-zinc-500">
          {project.demo ? "live-demo.vercel.app" : "github.com/biniyam-21"}
        </div>
      </div>

      {/* Gradient "screenshot" area */}
      <div className={`relative h-44 sm:h-52 bg-gradient-to-br ${project.accent || "from-accent-600/25 to-blue-600/15"}`}>
        {/* Grid overlay for code-editor feel */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Glowing orb */}
        <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.06] blur-2xl" />
        {/* Floating code-snippet visual */}
        <div className="absolute left-4 top-4 rounded-lg border border-white/10 bg-ink-950/70 px-3 py-2 font-mono text-[10px] leading-5 text-emerald-300/80 backdrop-blur-sm">
          <span className="text-accent-300/80">$ </span>
          <span className="text-zinc-300/70">{project.tags[0]?.toLowerCase()} deploy</span>
          <br />
          <span className="text-emerald-400/70">✓ Build successful</span>
        </div>
        {project.impact && (
          <div className="absolute bottom-4 right-4 rounded-lg border border-white/10 bg-ink-950/70 px-3 py-2 font-mono text-[10px] leading-5 backdrop-blur-sm">
            <span className="text-zinc-500">highlight</span>
            <br />
            <span className="font-semibold text-white">{project.impact?.split("·")[0]?.trim()}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit:  (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};

export default function FeaturedProjects({ projects }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const project = projects[index];

  const go = useCallback((delta) => {
    setDirection(delta);
    setIndex((i) => (i + delta + projects.length) % projects.length);
  }, [projects.length]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink-650/80 bg-ink-800/60 p-4 sm:p-6 backdrop-blur">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-accent-400" />
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-accent-300">
            Featured Work
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
              aria-label={`Go to project ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-5 bg-accent-400" : "w-1.5 bg-ink-650 hover:bg-zinc-500"
              }`}
            />
          ))}
          <button
            onClick={() => go(-1)}
            aria-label="Previous project"
            className="ml-2 grid h-8 w-8 place-items-center rounded-full border border-ink-650 bg-ink-950/40 text-zinc-400 transition hover:border-accent-400/40 hover:text-accent-300"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next project"
            className="grid h-8 w-8 place-items-center rounded-full border border-ink-650 bg-ink-950/40 text-zinc-400 transition hover:border-accent-400/40 hover:text-accent-300"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Main content — two columns on sm+ */}
      <div className="grid gap-5 sm:grid-cols-[1fr_0.9fr] sm:gap-6">
        {/* Left: info */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={project.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col gap-4"
          >
            {/* Title + status */}
            <div>
              <div className="flex items-start gap-3">
                <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
                  {project.title}
                </h3>
                <span className="mt-1 shrink-0 rounded-full border border-amber-400/30 bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  Featured
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{project.description}</p>
            </div>

            {/* Impact metric */}
            {project.impact && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-3 py-2">
                <TrendingUp size={13} className="shrink-0 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-300">{project.impact}</span>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-ink-650 bg-ink-950/50 px-2 py-0.5 text-xs text-zinc-400"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Stats + CTAs */}
            <div className="mt-auto flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: project.langColor }} />
                {project.language}
              </span>
              <span className="text-xs text-zinc-400">
                {project.github ? "Open source" : "Company project"}
              </span>
              <div className="ml-auto flex gap-2">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="View on GitHub"
                    className="flex items-center gap-1.5 rounded-xl border border-ink-650 bg-ink-950/40 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-accent-400/40 hover:text-white"
                  >
                    <IconGithub />
                    GitHub
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    aria-label="View live demo"
                    className="flex items-center gap-1.5 rounded-xl bg-accent-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-accent-500"
                  >
                    <ExternalLink size={12} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Right: mockup */}
        <div className="hidden sm:block">
          <AnimatePresence mode="wait">
            <ProjectMockup key={project.id} project={project} visible />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
