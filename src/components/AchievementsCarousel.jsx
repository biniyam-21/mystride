import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Trophy, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { achievementsData } from "../data/achievementsData";

/** Glowing Hexagon Icon Wrapper */
function GlowingHexagonIcon({ icon: Icon }) {
  return (
    <div className="relative flex h-20 w-20 items-center justify-center">
      {/* Background glowing aura */}
      <div className="absolute inset-0 rounded-full bg-accent-500/20 blur-xl transition-all duration-500 group-hover:bg-accent-500/40 group-hover:blur-2xl" />

      {/* SVG Hexagon Container */}
      <div className="relative flex h-full w-full items-center justify-center transition-transform duration-300 ease-out group-hover:rotate-3 group-hover:scale-108">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible drop-shadow-[0_0_12px_rgba(var(--accent-500),0.45)]">
          <defs>
            <linearGradient id="hexGradCarousel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(var(--accent-300))" stopOpacity="0.9" />
              <stop offset="50%" stopColor="rgb(var(--accent-400))" stopOpacity="0.65" />
              <stop offset="100%" stopColor="rgb(var(--accent-600))" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <polygon
            points="50,5 91,27.5 91,72.5 50,95 9,72.5 9,27.5"
            fill="rgba(17, 17, 24, 0.75)"
            stroke="url(#hexGradCarousel)"
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

/** Individual Achievement Card Component */
export function AchievementItemCard({ achievement }) {
  const Icon = achievement.icon;

  return (
    <div className="group relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-accent-500/20 bg-ink-900/90 p-5 sm:p-6 backdrop-blur-xl shadow-panel transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-accent-400/50 hover:shadow-glow">
      {/* Top subtle gradient overlay */}
      <div className={`absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-br ${achievement.gradientAccent} blur-2xl transition-opacity duration-300 opacity-60 group-hover:opacity-100`} />

      {/* Top Section: Year Badge */}
      <div className="flex items-center justify-between z-10">
        <span className="rounded-full border border-accent-500/30 bg-accent-500/10 px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold text-accent-300 tracking-wide">
          Milestone
        </span>
        <span className="rounded-full border border-ink-650/80 bg-ink-950/80 px-2.5 py-0.5 font-mono text-[10px] sm:text-xs font-medium text-zinc-400">
          {achievement.year}
        </span>
      </div>

      {/* Center Section: Hexagon Icon & Content */}
      <div className="my-5 flex flex-col items-center text-center z-10">
        <GlowingHexagonIcon icon={Icon} />

        <h3 className="mt-4 font-display text-base sm:text-lg font-bold text-white transition-colors duration-200 group-hover:text-accent-200">
          {achievement.title}
        </h3>

        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-400 line-clamp-3">
          {achievement.description}
        </p>
      </div>

      {/* Bottom Section: Category Pill */}
      <div className="flex items-center justify-between border-t border-ink-650/50 pt-3 z-10">
        <span className={`rounded-lg border px-2.5 py-1 text-[10px] sm:text-xs font-semibold ${achievement.badgeColor}`}>
          {achievement.category}
        </span>
        <span className="text-[10px] text-zinc-500 group-hover:text-accent-300 transition-colors">
          Verified ★
        </span>
      </div>
    </div>
  );
}

export default function AchievementsCarousel() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [cardsPerView, setCardsPerView] = useState(3);

  const containerRef = useRef(null);

  // Responsive cards-per-view listener
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setCardsPerView(1);
      } else if (w < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalItems = achievementsData.length;
  const maxIndex = Math.max(0, totalItems - cardsPerView);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Autoplay 4-second loop
  useEffect(() => {
    if (isHovered || isFocused || shouldReduceMotion) return;

    const timer = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(timer);
  }, [isHovered, isFocused, shouldReduceMotion, handleNext]);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-ink-950/90 p-4 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
      {/* Background Decorative Radial Blobs */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-accent-500/10 blur-3xl" />

      {/* Section Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between z-10 relative">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-400/30 bg-purple-500/20 text-purple-300 shadow-glow">
              <Trophy size={18} />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
              Achievements
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            Milestones that define my engineering journey.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-start gap-3">
          {/* Ghost "View All" Button */}
          <button
            onClick={() => navigate("/achievements")}
            className="group flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3.5 py-2 text-xs font-semibold text-purple-200 hover:border-purple-400/60 hover:bg-purple-500/20 transition-all shadow-glow"
          >
            <span>View All</span>
            <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          {/* Carousel Arrow Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              aria-label="Previous achievement"
              className="grid h-9 w-9 place-items-center rounded-xl border border-ink-650/80 bg-ink-900/80 text-zinc-300 transition hover:border-purple-400/50 hover:bg-purple-500/15 hover:text-white"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next achievement"
              className="grid h-9 w-9 place-items-center rounded-xl border border-ink-650/80 bg-ink-900/80 text-zinc-300 transition hover:border-purple-400/50 hover:bg-purple-500/15 hover:text-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Container */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="relative overflow-hidden pt-2 pb-4 z-10"
      >
        <motion.div
          className="flex gap-4 sm:gap-6"
          animate={{ x: `-${currentIndex * (100 / cardsPerView)}%` }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        >
          {achievementsData.map((item) => (
            <div
              key={item.id}
              className="shrink-0"
              style={{
                width: cardsPerView === 3 ? "calc((100% - 3rem) / 3)" : cardsPerView === 2 ? "calc((100% - 1.5rem) / 2)" : "100%",
              }}
            >
              <AchievementItemCard achievement={item} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Pagination Indicators */}
      <div className="flex items-center justify-center gap-2 z-10 relative pt-1">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "w-8 bg-accent-400 shadow-[0_0_12px_rgba(168,85,247,0.8)]"
                : "w-2.5 bg-ink-650 hover:bg-zinc-500"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
