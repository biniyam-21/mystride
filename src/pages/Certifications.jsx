import React from "react";
import { motion } from "framer-motion";
import { Award, ExternalLink, CalendarDays } from "lucide-react";
import PageWrapper from "../components/shared/PageWrapper";
import Card from "../components/Card";

const certs = [
  {
    title: "AWS Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    date: "Sep 2023",
    expires: "Sep 2026",
    id: "SAA-C03-XXXX",
    color: "amber",
    verified: true,
  },
  {
    title: "Meta React Developer Certificate",
    issuer: "Meta / Coursera",
    date: "Mar 2023",
    expires: "No expiry",
    id: "META-REACT-2023",
    color: "blue",
    verified: true,
  },
  {
    title: "HackerRank Problem Solving (Gold)",
    issuer: "HackerRank",
    date: "Jan 2023",
    expires: "No expiry",
    id: "HR-PS-GOLD",
    color: "emerald",
    verified: true,
  },
  {
    title: "Docker Certified Associate",
    issuer: "Docker Inc.",
    date: "In Progress",
    expires: "—",
    id: "—",
    color: "violet",
    verified: false,
  },
];

const colorMap = {
  amber:  "from-amber-500/20 to-transparent border-amber-400/30 text-amber-300",
  blue:   "from-blue-500/20 to-transparent border-blue-400/30 text-blue-300",
  emerald:"from-emerald-500/20 to-transparent border-emerald-400/30 text-emerald-300",
  violet: "from-accent-500/20 to-transparent border-accent-400/30 text-accent-300",
};

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
const item = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.36 } },
};

export default function Certifications() {
  return (
    <PageWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Certifications</h1>
          <p className="mt-1 text-sm text-zinc-400">Professional credentials and verified achievements</p>
        </div>
        <motion.div variants={stagger} initial="initial" animate="animate" className="grid gap-4 sm:grid-cols-2">
          {certs.map((cert) => {
            const colors = colorMap[cert.color] || colorMap.violet;
            return (
              <motion.div key={cert.title} variants={item}>
                <Card className={`group flex flex-col gap-4 bg-gradient-to-br p-5 transition-all hover:shadow-glow ${colors}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${colors}`}>
                      <Award size={20} />
                    </div>
                    {cert.verified ? (
                      <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                        ✓ Verified
                      </span>
                    ) : (
                      <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold text-amber-300">
                        In Progress
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{cert.title}</h3>
                    <p className="mt-1 text-sm text-zinc-400">{cert.issuer}</p>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={11} /> Issued {cert.date}
                    </span>
                    <span>Expires {cert.expires}</span>
                  </div>
                  {cert.id !== "—" && (
                    <div className="flex items-center justify-between border-t border-ink-650/60 pt-3">
                      <span className="font-mono text-[10px] text-zinc-400">{cert.id}</span>
                      <button className="flex items-center gap-1 text-xs text-zinc-400 transition hover:text-accent-300">
                        <ExternalLink size={11} />
                        Verify
                      </button>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </PageWrapper>
  );
}
