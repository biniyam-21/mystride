import React from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Zap, Shield, Code2, Terminal, BadgeCheck, Eye, Award } from "lucide-react";
import PageWrapper from "../components/shared/PageWrapper";
import Card from "../components/Card";
import AnimatedCounter from "../components/shared/AnimatedCounter";

const badges = [
  { icon: Terminal, label: "Shell Sage",     desc: "Mastered the command line",       color: "violet", unlocked: true  },
  { icon: BadgeCheck, label: "Certified",    desc: "AWS Solutions Architect",          color: "blue",   unlocked: true  },
  { icon: Eye, label: "Profile Star",        desc: "500+ profile views",               color: "amber",  unlocked: true  },
  { icon: Code2, label: "Open Source",       desc: "10+ merged PRs",                   color: "emerald",unlocked: true  },
  { icon: Zap, label: "Speed Demon",         desc: "Solved 5 problems in a day",       color: "yellow", unlocked: true  },
  { icon: Trophy, label: "Contest King",     desc: "Top 100 in a global contest",      color: "orange", unlocked: false },
  { icon: Star, label: "100 Stars",          desc: "Repository with 100+ stars",       color: "rose",   unlocked: false },
  { icon: Shield, label: "Bug Slayer",       desc: "Fixed 50+ critical bugs",          color: "cyan",   unlocked: false },
  { icon: Award, label: "Mentor",            desc: "Helped 20+ developers",            color: "purple", unlocked: false },
];

const colorClasses = {
  violet: "from-accent-500/30 to-accent-400/10 border-accent-400/30 text-accent-300",
  blue:   "from-blue-500/30 to-blue-400/10 border-blue-400/30 text-blue-300",
  amber:  "from-amber-500/30 to-amber-400/10 border-amber-400/30 text-amber-300",
  emerald:"from-emerald-500/30 to-emerald-400/10 border-emerald-400/30 text-emerald-300",
  yellow: "from-yellow-500/30 to-yellow-400/10 border-yellow-400/30 text-yellow-300",
  orange: "from-orange-500/30 to-orange-400/10 border-orange-400/30 text-orange-300",
  rose:   "from-rose-500/30 to-rose-400/10 border-rose-400/30 text-rose-300",
  cyan:   "from-cyan-500/30 to-cyan-400/10 border-cyan-400/30 text-cyan-300",
  purple: "from-purple-500/30 to-purple-400/10 border-purple-400/30 text-purple-300",
};

const stats = [
  { label: "Badges Earned", value: 5 },
  { label: "Total Badges", value: 12 },
  { label: "Points", value: 2840 },
  { label: "Rank", value: 1843 },
];

const stagger = { animate: { transition: { staggerChildren: 0.06 } } };
const item = {
  initial: { opacity: 0, scale: 0.88 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] } },
};

export default function Achievements() {
  return (
    <PageWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Achievements</h1>
          <p className="mt-1 text-sm text-zinc-400">Badges, milestones, and earned recognition</p>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-4">
          {stats.map(({ label, value }) => (
            <Card key={label} className="p-3 sm:p-4 text-center">
              <p className="text-lg sm:text-2xl font-bold text-white">
                <AnimatedCounter to={value} />
              </p>
              <p className="mt-1 text-[10px] sm:text-xs text-zinc-400">{label}</p>
            </Card>
          ))}
        </div>

        {/* Badge grid */}
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {badges.map((badge) => {
            const Icon = badge.icon;
            const colors = colorClasses[badge.color] || colorClasses.violet;
            return (
              <motion.div key={badge.label} variants={item}>
                <div
                  className={`group relative flex flex-col items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border p-3 sm:p-5 text-center transition-all duration-200 ${
                    badge.unlocked
                      ? `bg-gradient-to-b ${colors} cursor-default hover:scale-105 hover:shadow-glow`
                      : "border-ink-650 bg-ink-800/40 opacity-40 grayscale"
                  }`}
                >
                  {!badge.unlocked && (
                    <span className="absolute right-1 top-1 sm:right-2 sm:top-2 text-[9px] sm:text-[10px] text-zinc-400">🔒</span>
                  )}
                  <div className="badge-hex">
                    <Icon size={18} className="sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-white">{badge.label}</p>
                    <p className="mt-0.5 text-[10px] sm:text-xs text-zinc-400 leading-tight">{badge.desc}</p>
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
