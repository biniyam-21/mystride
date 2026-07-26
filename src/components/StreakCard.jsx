import React, { useState, useEffect, useMemo } from "react";
import Card from "./Card";
import CardTitle from "./CardTitle";
import { mockData } from "../data/mockData";
import { Flame } from "lucide-react";

const GITHUB_USERNAME = "biniyam-21";
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SHOWN_DAY_INDICES = new Set([1, 3, 5]);

function SkeletonGrid() {
  return (
    <div className="flex gap-1 min-w-[300px]">
      <div style={{ minWidth: "2rem" }} />
      <div className="flex-1">
        <div className="h-5 mb-1 flex gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex-1 h-3 rounded-sm bg-ink-700/30 animate-pulse" />
          ))}
        </div>
        <div
          className="grid grid-rows-7 gap-1"
          style={{ gridTemplateColumns: "repeat(12, 1fr)", gridAutoFlow: "column" }}
        >
          {Array.from({ length: 84 }).map((_, i) => (
            <span
              key={i}
              className="h-3 w-full sm:h-3.5 rounded-[3px] bg-ink-700/40 animate-pulse"
              style={{ animationDelay: `${(i % 12) * 40}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StreakCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchGitHubContributions() {
      try {
        const res = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`
        );
        if (!res.ok) throw new Error("API error");
        const json = await res.json();
        if (isMounted && json && Array.isArray(json.contributions)) {
          setData(json);
        }
      } catch {
        // Silent fallback to mockData
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchGitHubContributions();
    return () => { isMounted = false; };
  }, []);

  const { currentStreak, longestStreak, cells, monthColumns } = useMemo(() => {
    if (!data || !data.contributions || data.contributions.length === 0) {
      return {
        currentStreak: mockData.streak.current || 0,
        longestStreak: mockData.streak.longest || 0,
        cells: mockData.streak.cells.map((lvl) => ({ date: "", count: lvl, level: lvl })),
        monthColumns: [
          { label: "May", col: 0 },
          { label: "Jun", col: 4 },
          { label: "Jul", col: 8 },
        ],
      };
    }

    const list = data.contributions;

    let longest = 0, temp = 0;
    for (const d of list) {
      if (d.count > 0) { temp++; if (temp > longest) longest = temp; }
      else temp = 0;
    }

    let curr = 0;
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].count > 0) curr++;
      else if (i === list.length - 1) continue;
      else break;
    }

    const recentDays = list.slice(-84);

    const monthColMap = new Map();
    recentDays.forEach((item, idx) => {
      const col = Math.floor(idx / 7);
      if (item.date) {
        const m = new Date(item.date).toLocaleDateString("en-US", { month: "short" });
        if (!monthColMap.has(m)) monthColMap.set(m, col);
      }
    });

    const monthColumns = Array.from(monthColMap.entries()).map(([label, col]) => ({ label, col }));

    return { currentStreak: curr, longestStreak: longest, cells: recentDays, monthColumns };
  }, [data]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const COLS = 12;
  const ROWS = 7;

  const handleEnter = (e, item) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      date: item.date
        ? new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "",
      count: item.count || 0,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  return (
    <Card
      className="p-4 sm:p-6"
      beam
      beamProps={{ colorFrom: "rgb(var(--accent-400))", colorTo: "rgb(var(--accent-600))", duration: 20, borderWidth: 1, size: 160, opacity: 0.35, delay: 5 }}
    >
      <div className="flex items-center justify-between">
        <CardTitle title="GitHub Streak" />
        <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 bg-ink-950/60 border border-ink-650 px-2 py-0.5 rounded-full">
          <Flame size={13} className="text-amber-400 animate-pulse" />
          <span>{currentStreak} day{currentStreak !== 1 ? "s" : ""}</span>
        </span>
      </div>

      <p className="mt-3 text-xs text-zinc-400">
        Longest Streak: <span className="font-semibold text-white">{longestStreak} days</span>
      </p>

      <div className="mt-4 w-full overflow-x-auto pb-1 select-none">
        {loading ? (
          <SkeletonGrid />
        ) : (
          <div className="flex gap-1 min-w-[300px]">
            <div
              className="flex flex-col justify-between pb-0.5 pr-1"
              style={{ minWidth: "2rem", paddingTop: "1.5rem" }}
            >
              {Array.from({ length: ROWS }).map((_, rowIdx) => (
                <span
                  key={rowIdx}
                  className="text-[9px] sm:text-[10px] text-zinc-500 leading-none h-3 sm:h-3.5 flex items-center"
                >
                  {SHOWN_DAY_INDICES.has(rowIdx) ? DAY_LABELS[rowIdx] : ""}
                </span>
              ))}
            </div>

            <div className="flex-1">
              <div className="relative h-5 mb-1">
                <div className="absolute inset-0 flex">
                  {Array.from({ length: COLS }).map((_, colIdx) => {
                    const entry = monthColumns.find((m) => m.col === colIdx);
                    return (
                      <div key={colIdx} className="flex-1 text-[9px] sm:text-[10px] text-zinc-500 leading-none truncate">
                        {entry ? entry.label : ""}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div
                className="grid grid-rows-7 gap-1"
                style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridAutoFlow: "column" }}
              >
                {cells.map((item, index) => {
                  const isToday = item.date === todayStr;
                  return (
                    <span
                      key={index}
                      className={[
                        "h-3 w-full sm:h-3.5 cursor-pointer rounded-[3px] sm:rounded-[4px]",
                        `streak-${item.level || 0}`,
                        "transition-transform duration-100 hover:scale-125",
                        isToday
                          ? "ring-2 ring-accent-400 ring-offset-1 ring-offset-ink-950"
                          : "hover:ring-1 hover:ring-accent-400/60",
                      ].join(" ")}
                      onMouseEnter={(e) => handleEnter(e, item)}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-lg border border-ink-650 bg-ink-800 px-3 py-2 text-xs shadow-xl"
          style={{ left: tooltip.x, top: tooltip.y - 8 }}
        >
          {tooltip.date && <p className="font-semibold text-white">{tooltip.date}</p>}
          <p className="mt-0.5 text-zinc-400">
            {tooltip.count} {tooltip.count === 1 ? "contribution" : "contributions"}
          </p>
          <div
            className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent"
            style={{ borderTopColor: "rgb(39 39 42 / 1)" }}
          />
        </div>
      )}
    </Card>
  );
}
