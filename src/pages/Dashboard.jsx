import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Hammer, ArrowRight, Sun, Sunset, Moon, Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/shared/PageWrapper";
import ProfileCard from "../components/ProfileCard";
import RankingCard from "../components/RankingCard";
import AchievementCard from "../components/AchievementCard";
import StreakCard from "../components/StreakCard";
import ActivityCard from "../components/ActivityCard";
import TerminalWidget from "../components/shared/TerminalWidget";
import Card from "../components/Card";
import { mockData } from "../data/mockData";
import { useStaggerReveal, useScrollReveal } from "../hooks/gsapUtils";

function useGreeting() {
  return useMemo(() => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12)  return { text: "Good morning",   Icon: Sun,     sub: "Ready to see what's been built?" };
    if (h >= 12 && h < 17) return { text: "Good afternoon", Icon: Sunset,  sub: "Here's your portfolio at a glance." };
    if (h >= 17 && h < 21) return { text: "Good evening",   Icon: Moon,    sub: "Here's your portfolio at a glance." };
    return                         { text: "Late night session", Icon: Coffee, sub: "Still coding? Here's the overview." };
  }, []);
}

const IS_FIRST = !sessionStorage.getItem("portfolio-booted");
// Dashboard enters while boot is fading (~3.5-4.1s). Start at 3.3s so the
// stagger animation is mid-flight when the overlay disappears.
const DELAY = IS_FIRST ? 3.3 : 0;

const stagger = { animate: { transition: { staggerChildren: 0.07 } } };
const dashboardStagger = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: DELAY } },
};
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
};
const slideRight = {
  initial: { opacity: 0, x: -24 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
};
const scaleUp = {
  initial: { opacity: 0, scale: 0.93 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
};

const progressColor = {
  violet: "bg-accent-500",
  emerald: "bg-emerald-500",
  blue: "bg-blue-500",
  amber: "bg-amber-500",
};

function CurrentlyBuildingSection() {
  const navigate = useNavigate();
  const { currentlyBuilding } = mockData;
  const headingRef  = useScrollReveal({ y: 16, duration: 0.5 });
  const cardsRef    = useStaggerReveal({ stagger: 0.12 });

  return (
    <div className="space-y-3">
      <div ref={headingRef} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Hammer size={16} className="text-accent-400" />
          <h2 className="font-display text-base font-semibold text-white">Currently Building</h2>
        </div>
        <button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-1 text-xs text-zinc-400 transition hover:text-accent-300"
        >
          All projects <ArrowRight size={12} />
        </button>
      </div>
      <div ref={cardsRef} className="grid gap-3 sm:grid-cols-2">
        {currentlyBuilding.map((project) => (
          <Card
            key={project.name}
            className="p-4 transition-all duration-200 hover:border-accent-400/30"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-white">{project.name}</h3>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                project.status === "Beta"
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-amber-500/15 text-amber-300"
              }`}>
                {project.status}
              </span>
            </div>
            <p className="mt-1.5 text-xs leading-5 text-zinc-400">{project.description}</p>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Progress</span>
                <span className="font-semibold text-zinc-300">{project.progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-ink-700">
                <motion.div
                  className={`h-full rounded-full ${progressColor[project.color] || progressColor.violet}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {project.tech.map((t) => (
                <span key={t} className="rounded border border-ink-650 bg-ink-950/50 px-2 py-0.5 text-[10px] text-zinc-400">
                  {t}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function DashboardGreeting() {
  const { text, Icon, sub } = useGreeting();
  const { user } = mockData;
  return (
    <motion.div variants={fadeUp} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <Icon size={18} className="text-accent-400" />
          <h1 className="text-lg font-semibold text-white">
            {text},{" "}
            <span className="text-accent-300">{user.name.split(" ")[0]}</span>
          </h1>
        </div>
        <p className="mt-0.5 text-sm text-zinc-500">{sub}</p>
      </div>
      <span className="hidden rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 sm:flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        Available for work
      </span>
    </motion.div>
  );
}

export default function Dashboard() {
  return (
    <PageWrapper>
      <motion.div
        variants={dashboardStagger}
        initial="initial"
        animate="animate"
        className="space-y-4 sm:space-y-5"
      >
        <DashboardGreeting />

        <motion.div
          variants={stagger}
          className="grid gap-4 sm:gap-5 xl:grid-cols-[minmax(280px,0.34fr)_minmax(0,0.66fr)]"
        >
          <motion.div variants={slideRight}>
            <ProfileCard />
          </motion.div>

          <motion.div variants={stagger} className="space-y-4 sm:space-y-5">
            <motion.div variants={fadeUp}>
              <RankingCard />
            </motion.div>
            <motion.div variants={stagger} className="grid gap-4 sm:gap-5 2xl:grid-cols-[0.48fr_0.52fr]">
              <motion.div variants={scaleUp}>
                <AchievementCard />
              </motion.div>
              <motion.div variants={scaleUp}>
                <StreakCard />
              </motion.div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <ActivityCard />
            </motion.div>
          </motion.div>
        </motion.div>

        <CurrentlyBuildingSection />

        {/* TerminalWidget scroll-reveal — the widget itself gates playback via useScrollStart */}
        <TerminalWidget />
      </motion.div>
    </PageWrapper>
  );
}
