import React from "react";
import Card from "./Card";
import CardTitle from "./CardTitle";
import { mockData } from "../data/mockData";

export default function AchievementCard() {
  return (
    <Card
      className="p-4 sm:p-6"
      beam
      beamProps={{ colorFrom: "#f59e0b", colorTo: "#9d6cff", duration: 22, borderWidth: 1, size: 160, opacity: 0.4 }}
    >
      <CardTitle title="Achievement" />
      <p className="mt-4 text-sm text-zinc-400">
        Badges Achieved: <span className="font-semibold text-white">5/12</span>
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-4">
        {mockData.achievements.map(({ icon: Icon, label }) => (
          <div key={label} className="group flex flex-col items-center gap-2">
            <div className="badge-hex w-full">
              <Icon size={24} />
            </div>
            <span className="text-center text-xs font-medium text-zinc-400 transition-colors duration-200 group-hover:text-accent-300">
              {label}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
