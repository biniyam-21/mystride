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
      <div ref={headingRef} className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Hammer size={15} className="text-accent-400 shrink-0" />
            <h2 className="font-display text-sm sm:text-base font-semibold text-white">Currently Building</h2>
          </div>
          <button
            onClick={() => navigate("/projects")}
            className="flex items-center gap-1 text-xs text-zinc-400 transition hover:text-accent-300 w-fit"
          >
            All projects <ArrowRight size={11} />
          </button>
        </div>
      </div>
      <div ref={cardsRef} className="grid gap-3 sm:grid-cols-2">
        {currentlyBuilding.map((project) => (
          <Card
            key={project.name}
            className="p-3 sm:p-4 transition-all duration-200 hover:border-accent-400/30"
          >
            <div className="flex items-start justify-between gap-2 min-w-0">
              <h3 className="font-semibold text-sm text-white truncate flex-1">{project.name}</h3>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold whitespace-nowrap ${
                project.status === "Beta"
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-amber-500/15 text-amber-300"
              }`}>
                {project.status}
              </span>
            </div>
            <p className="mt-2 text-xs leading-4 text-zinc-400 line-clamp-2">{project.description}</p>
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between text-[10px] sm:text-xs">
                <span className="text-zinc-400">Progress</span>
                <span className="font-semibold text-zinc-300">{project.progress}%</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-ink-700">
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
                <span key={t} className="rounded border border-ink-650 bg-ink-950/50 px-1.5 py-0.5 text-[9px] text-zinc-400">
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
    <motion.div variants={fadeUp} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1 sm:gap-2">
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-accent-400 shrink-0" />
          <h1 className="text-base sm:text-lg font-semibold text-white">
            {text},<span className="text-accent-300"> {user.name.split(" ")[0]}</span>
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500">{sub}</p>
      </div>
      <span className="hidden rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 sm:flex items-center gap-1.5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        <span className="hidden md:inline">Available for work</span>
        <span className="md:hidden">Available</span>
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
          className="grid gap-3 sm:gap-4 xl:grid-cols-[minmax(260px,28rem)_minmax(0,1fr)]"
        >
            <motion.div variants={slideRight} className="w-full min-w-0 sm:min-w-0 xl:max-w-[28rem]">
            <ProfileCard />
          </motion.div>

          <motion.div variants={stagger} className="space-y-3 sm:space-y-4 w-full xl:max-w-[calc(100%)] flex-1">
            <motion.div variants={fadeUp} className="w-full">
              <RankingCard />
            </motion.div>
            <motion.div variants={stagger} className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 w-full">
              <motion.div variants={scaleUp} className="w-full">
                <AchievementCard />
              </motion.div>
              <motion.div variants={scaleUp} className="w-full">
                <StreakCard />
              </motion.div>
            </motion.div>
            <motion.div variants={fadeUp} className="w-full lg:w-[92%] xl:w-[85%]">
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
