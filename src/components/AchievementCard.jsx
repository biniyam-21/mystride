import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "./Card";
import CardTitle from "./CardTitle";
import { achievementsData } from "../data/achievementsData";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Trophy, ChevronLeft, ChevronRight } from "lucide-react";

/** Dynamic Theme-Aware Hexagon Icon */
function GlowingHexagonIcon({ icon: Icon }) {
  return (
    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center -mt-1">
      {/* SVG Hexagon Container — scales ONLY when hovering this icon */}
      <div className="relative flex h-full w-full items-center justify-center transition-transform duration-300 ease-out hover:scale-115">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <linearGradient id="dynamicHexGradCard" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(var(--accent-300))" stopOpacity="0.8" />
              <stop offset="100%" stopColor="rgb(var(--accent-500))" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <polygon
            points="50,5 91,27.5 91,72.5 50,95 9,72.5 9,27.5"
            fill="rgba(17, 17, 24, 0.85)"
            stroke="url(#dynamicHexGradCard)"
            strokeWidth="2.5"
          />
        </svg>

        {/* Outline icon */}
        <Icon
          size={24}
          strokeWidth={1.8}
          className="relative z-10 text-white transition-transform duration-300"
        />
      </div>
    </div>
  );
}

export default function AchievementCard() {
  const navigate = useNavigate();
  const total = achievementsData.length;
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Duplicated list for seamless infinite horizontal track scrolling
  const loopItems = [...achievementsData, ...achievementsData];

  const handlePrev = (e) => {
    e?.stopPropagation();
    setIndex((prev) => (prev <= 0 ? total - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setIndex((prev) => (prev + 1) % total);
  };

  // Auto-scroll 1 item horizontally every 3.5 seconds
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, 3500);
    return () => clearInterval(timer);
  }, [isHovered, total]);

  return (
    <Card
      className="p-4 sm:p-5 flex flex-col justify-between h-full overflow-hidden"
      beam
      beamProps={{ colorFrom: "rgb(var(--accent-400))", colorTo: "rgb(var(--accent-600))", duration: 22, borderWidth: 1, size: 160, opacity: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between z-10 pb-2 border-b border-ink-650/40">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-accent-400" />
          <CardTitle title="Key Achievements" />
        </div>
        <button
          onClick={() => navigate("/achievements")}
          className="flex items-center gap-1 text-[11px] font-semibold text-accent-300 hover:text-accent-200 transition-colors"
        >
          <span>View All</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Realistic Continuous Horizontal Scrolling Track */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex-1 my-3 relative overflow-hidden flex items-center"
      >
        <motion.div
          className="flex gap-2.5 w-full shrink-0"
          animate={{ x: `-${index * 33.333}%` }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {loopItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => navigate("/achievements")}
                style={{ width: "calc((100% - 1.25rem) / 3)" }}
                className="group shrink-0 flex flex-col items-center text-center justify-between rounded-xl border border-accent-500/20 bg-ink-950/70 p-3 backdrop-blur-md transition-all duration-300 hover:border-accent-400/50 hover:bg-accent-500/10 hover:shadow-glow cursor-pointer"
              >
                {/* Prominent Theme-Aware Hexagon Icon */}
                <GlowingHexagonIcon icon={Icon} />

                {/* Centered Title & 1-line Description */}
                <div className="my-1.5 min-w-0 w-full">
                  <h4 className="font-display text-xs font-bold text-white truncate group-hover:text-accent-200 transition-colors">
                    {item.title}
                  </h4>
                  <p className="mt-0.5 text-[10px] leading-tight text-zinc-400 truncate">
                    {item.description}
                  </p>
                </div>

                {/* Category Pill */}
                <span className="rounded-md border border-accent-400/30 bg-accent-500/15 px-1.5 py-0.5 text-[9px] font-semibold text-accent-300 transition-colors">
                  {item.category}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Footer Indicators & Controls */}
      <div className="flex items-center justify-between text-[10px] text-zinc-500 z-10 pt-2 border-t border-ink-650/40">
        <span>Item {index + 1} of {total}</span>

        <div className="flex items-center gap-3">
          {/* Pagination Indicators */}
          <div className="flex items-center gap-1.5">
            {achievementsData.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to item ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-4 bg-accent-400 shadow-glow" : "w-1.5 bg-ink-650 hover:bg-zinc-400"
                }`}
              />
            ))}
          </div>

          {/* Prev and Next Action Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous achievement"
              className="flex h-5 w-5 items-center justify-center rounded border border-ink-650 bg-ink-950/80 text-zinc-300 transition-colors hover:border-accent-400/50 hover:bg-accent-500/20 hover:text-white"
            >
              <ChevronLeft size={12} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next achievement"
              className="flex h-5 w-5 items-center justify-center rounded border border-ink-650 bg-ink-950/80 text-zinc-300 transition-colors hover:border-accent-400/50 hover:bg-accent-500/20 hover:text-white"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
