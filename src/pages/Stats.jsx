import React from "react";
import { motion } from "framer-motion";
import { Globe2, Flag, BarChart3, Zap, Code2, Star } from "lucide-react";
import PageWrapper from "../components/shared/PageWrapper";
import Card from "../components/Card";
import AnimatedCounter from "../components/shared/AnimatedCounter";
import RankingCard from "../components/RankingCard";
import StreakCard from "../components/StreakCard";
import ActivityCard from "../components/ActivityCard";
import { mockData } from "../data/mockData";

const topStats = [
  { icon: Globe2,   label: "Global Rank",     value: 184372, prefix: "#",  color: "violet" },
  { icon: Flag,     label: "Country Rank",     value: 12327,  prefix: "#",  color: "blue"   },
  { icon: BarChart3,label: "Percentile",       value: 91,     suffix: "%",  color: "emerald"},
  { icon: Zap,      label: "Problems Solved",  value: 6,      suffix: "",   color: "amber"  },
  { icon: Code2,    label: "Contributions",    value: 248,    suffix: "",   color: "rose"   },
  { icon: Star,     label: "GitHub Stars",     value: 937,    suffix: "",   color: "yellow" },
];

const colorMap = {
  violet: "text-accent-300 bg-accent-500/10",
  blue:   "text-blue-300 bg-blue-500/10",
  emerald:"text-emerald-300 bg-emerald-500/10",
  amber:  "text-amber-300 bg-amber-500/10",
  rose:   "text-rose-300 bg-rose-500/10",
  yellow: "text-yellow-300 bg-yellow-500/10",
};

const stagger = { animate: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.36 } },
};

export default function Stats() {
  return (
    <PageWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Stats</h1>
          <p className="mt-1 text-sm text-zinc-400">Coding statistics and performance metrics</p>
        </div>

        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3"
        >
          {topStats.map(({ icon: Icon, label, value, prefix = "", suffix = "", color }) => (
            <motion.div key={label} variants={fadeUp}>
              <Card className="p-4">
                <div className={`mb-3 grid h-9 w-9 place-items-center rounded-xl ${colorMap[color]}`}>
                  <Icon size={17} />
                </div>
                <p className="text-xs text-zinc-400">{label}</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {prefix}<AnimatedCounter to={value} suffix={suffix} />
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <RankingCard />
        <div className="grid gap-5 2xl:grid-cols-2">
          <StreakCard />
          <ActivityCard />
        </div>
      </div>
    </PageWrapper>
  );
}
