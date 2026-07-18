import React, { useState } from "react";
import Card from "./Card";
import CardTitle from "./CardTitle";
import { mockData } from "../data/mockData";

const LEVEL_LABEL = ["No activity", "Low", "Moderate", "High", "Max"];
const LEVEL_CONTRIBS = [0, 1, 3, 5, 8];

function getCellDate(index) {
  const d = new Date();
  d.setDate(d.getDate() - (83 - index));
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function StreakCard() {
  const [tooltip, setTooltip] = useState(null);

  const handleEnter = (e, index, level) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ index, level, x: rect.left + rect.width / 2, y: rect.top });
  };

  return (
    <Card
      className="p-4 sm:p-6"
      beam
      beamProps={{ colorFrom: "#9d6cff", colorTo: "#22c55e", duration: 20, borderWidth: 1, size: 160, opacity: 0.35, delay: 5 }}
    >
      <CardTitle title="Streak" />
      <p className="mt-4 text-sm text-zinc-400">
        Longest Streak:{" "}
        <span className="font-semibold text-white">{mockData.streak.longest} days</span>
      </p>

      <div className="mt-5 w-full overflow-x-auto pb-1">
        <div className="mb-3 grid min-w-[280px] grid-cols-3 text-[10px] sm:text-xs text-zinc-400">
          {mockData.streak.months.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
        <div className="grid min-w-[280px] grid-flow-col grid-rows-7 gap-1">
          {mockData.streak.cells.map((level, index) => (
            <span
              key={index}
              className={`h-3 w-3 sm:h-3.5 sm:w-3.5 cursor-pointer rounded-[3px] sm:rounded-[4px] streak-${level} transition-transform duration-100 hover:scale-110 hover:ring-1 hover:ring-accent-400/50`}
              onMouseEnter={(e) => handleEnter(e, index, level)}
              onMouseLeave={() => setTooltip(null)}
            />
          ))}
        </div>
      </div>

      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-lg border border-ink-650 bg-ink-800 px-3 py-2 text-xs shadow-xl"
          style={{ left: tooltip.x, top: tooltip.y - 8 }}
        >
          <p className="font-semibold text-white">{getCellDate(tooltip.index)}</p>
          <p className="mt-0.5 text-zinc-400">
            {LEVEL_CONTRIBS[tooltip.level]}{" "}
            {LEVEL_CONTRIBS[tooltip.level] === 1 ? "contribution" : "contributions"}
          </p>
          <p className="mt-0.5 text-zinc-400">{LEVEL_LABEL[tooltip.level]}</p>
          <div
            className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent"
            style={{ borderTopColor: "rgb(39 39 42 / 1)" }}
          />
        </div>
      )}
    </Card>
  );
}
