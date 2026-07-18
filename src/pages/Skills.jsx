import React from "react";
import { motion } from "framer-motion";
import PageWrapper from "../components/shared/PageWrapper";
import Card from "../components/Card";
import { skillTiers } from "../data/skills";
import { useScrollReveal, useStaggerReveal } from "../hooks/gsapUtils";

const colorStyles = {
  violet: {
    label: "text-accent-300",
    ring: "ring-accent-400/20 bg-accent-500/10",
    bar: "bg-accent-500",
    track: "bg-accent-500/15",
    dot: "bg-accent-400",
    count: "text-accent-400",
  },
  blue: {
    label: "text-blue-300",
    ring: "ring-blue-400/20 bg-blue-500/10",
    bar: "bg-blue-500",
    track: "bg-blue-500/15",
    dot: "bg-blue-400",
    count: "text-blue-400",
  },
  emerald: {
    label: "text-emerald-300",
    ring: "ring-emerald-400/20 bg-emerald-500/10",
    bar: "bg-emerald-500",
    track: "bg-emerald-500/15",
    dot: "bg-emerald-400",
    count: "text-emerald-400",
  },
  amber: {
    label: "text-amber-300",
    ring: "ring-amber-400/20 bg-amber-500/10",
    bar: "bg-amber-500",
    track: "bg-amber-500/15",
    dot: "bg-amber-400",
    count: "text-amber-400",
  },
};

function SkillRow({ name, context, level, color, index }) {
  const styles = colorStyles[color] || colorStyles.violet;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className={`mt-px h-1.5 w-1.5 shrink-0 rounded-full ${styles.dot}`} />
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-200">{name}</p>
            <p className="text-[11px] leading-4 text-zinc-500">{context}</p>
          </div>
        </div>
        <span className={`shrink-0 text-xs font-semibold tabular-nums ${styles.count}`}>
          {level}%
        </span>
      </div>
      {/* Progress bar */}
      <div className={`h-1 w-full overflow-hidden rounded-full ${styles.track}`}>
        <motion.div
          className={`h-full rounded-full ${styles.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 + index * 0.06 }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const headerRef = useScrollReveal({ y: 18, duration: 0.5 });
  const gridRef   = useStaggerReveal({ stagger: 0.13, y: 28 });

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div ref={headerRef}>
          <h1 className="font-display text-2xl font-bold text-white">Technical Skills</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Grouped by real fluency — each bar reflects honest self-assessment, not marketing
          </p>
        </div>
        <div ref={gridRef} className="grid gap-5 sm:grid-cols-2">
          {skillTiers.map((group) => {
            const styles = colorStyles[group.color] || colorStyles.violet;
            const avg = Math.round(group.skills.reduce((s, sk) => s + sk.level, 0) / group.skills.length);
            return (
              <Card key={group.tier} className="h-full p-5">
                {/* Tier header */}
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 ${styles.ring} ${styles.label}`}>
                      {group.tier}
                    </span>
                    <span className="rounded-full border border-ink-650 bg-ink-950/50 px-2 py-0.5 text-[10px] text-zinc-500">
                      {group.skills.length} skills
                    </span>
                  </div>
                  {/* Avg proficiency arc */}
                  <span className={`text-xs font-bold tabular-nums ${styles.count}`}>
                    avg {avg}%
                  </span>
                </div>
                <p className="mb-4 text-[11px] text-zinc-500">{group.tagline}</p>
                <div className="space-y-4">
                  {group.skills.map((skill, i) => (
                    <SkillRow key={skill.name} {...skill} color={group.color} index={i} />
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}
