import React from "react";
import { motion } from "framer-motion";
import { Trophy, Sparkles } from "lucide-react";
import PageWrapper from "../components/shared/PageWrapper";
import { achievementsData } from "../data/achievementsData";

function GlowingHexagonIcon({ icon: Icon }) {
  return (
    <div className="relative flex h-20 w-20 items-center justify-center">
      {/* Background glowing aura */}
      <div className="absolute inset-0 rounded-full bg-accent-500/20 blur-xl transition-all duration-500 group-hover:bg-accent-500/40 group-hover:blur-2xl" />

      {/* SVG Hexagon Container */}
      <div className="relative flex h-full w-full items-center justify-center transition-transform duration-300 ease-out group-hover:rotate-3 group-hover:scale-108">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible drop-shadow-[0_0_12px_rgba(var(--accent-500),0.45)]">
          <defs>
            <linearGradient id="hexGradPage" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(var(--accent-300))" stopOpacity="0.9" />
              <stop offset="50%" stopColor="rgb(var(--accent-400))" stopOpacity="0.65" />
              <stop offset="100%" stopColor="rgb(var(--accent-600))" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <polygon
            points="50,5 91,27.5 91,72.5 50,95 9,72.5 9,27.5"
            fill="rgba(17, 17, 24, 0.75)"
            stroke="url(#hexGradPage)"
            strokeWidth="2.5"
            className="transition-all duration-300"
          />
        </svg>

        {/* Outlined SVG Icon centered inside */}
        <Icon
          size={28}
          strokeWidth={2}
          className="relative z-10 text-white drop-shadow-[0_0_10px_rgba(var(--accent-400),0.8)] transition-transform duration-300 group-hover:scale-110"
        />
      </div>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
  },
};

export default function Achievements() {
  return (
    <PageWrapper>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-ink-650/40 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/30 bg-purple-500/20 text-purple-300 shadow-glow">
                <Trophy size={20} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Achievements</h1>
            </div>
            <p className="mt-2 text-sm text-zinc-400">
              Milestones, accomplishments, and earned engineering recognition.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-3.5 py-1.5 text-xs font-semibold text-accent-300">
            <Sparkles size={14} />
            <span>{achievementsData.length} Verified Milestones</span>
          </div>
        </div>

        {/* All Achievements Grid (No Horizontal Scroll) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {achievementsData.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.id} variants={cardVariants} className="h-full">
                <div className="group relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-accent-500/20 bg-ink-900/90 p-6 backdrop-blur-xl shadow-panel transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-accent-400/50 hover:shadow-glow">
                  {/* Top subtle gradient overlay */}
                  <div className={`absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-br ${item.gradientAccent} blur-2xl transition-opacity duration-300 opacity-60 group-hover:opacity-100`} />

                  {/* Top Section: Milestone & Year */}
                  <div className="flex items-center justify-between z-10">
                    <span className="rounded-full border border-accent-500/30 bg-accent-500/10 px-2.5 py-0.5 text-xs font-semibold text-accent-300 tracking-wide">
                      Milestone
                    </span>
                    <span className="rounded-full border border-ink-650/80 bg-ink-950/80 px-2.5 py-0.5 font-mono text-xs font-medium text-zinc-400">
                      {item.year}
                    </span>
                  </div>

                  {/* Center Section: Hexagon Icon & Content */}
                  <div className="my-5 flex flex-col items-center text-center z-10">
                    <GlowingHexagonIcon icon={Icon} />

                    <h3 className="mt-4 font-display text-lg font-bold text-white transition-colors duration-200 group-hover:text-accent-200">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom Section: Category Pill & Verified */}
                  <div className="flex items-center justify-between border-t border-ink-650/50 pt-3 z-10">
                    <span className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${item.badgeColor}`}>
                      {item.category}
                    </span>
                    <span className="text-xs text-zinc-500 group-hover:text-accent-300 transition-colors">
                      Verified ★
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </PageWrapper>
  );
}
