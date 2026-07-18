import React from "react";
import { motion } from "framer-motion";
import { Quote, MapPin, Mail } from "lucide-react";
import PageWrapper from "../components/shared/PageWrapper";
import Card from "../components/Card";
import { timeline } from "../data/timeline";
import { mockData } from "../data/mockData";
import { useScrollReveal, useStaggerReveal } from "../hooks/gsapUtils";

const colorMap = {
  violet: "bg-accent-500/15 text-accent-300 border-accent-400/30 ring-accent-400/20",
  blue:   "bg-blue-500/15 text-blue-300 border-blue-400/30 ring-blue-400/20",
  amber:  "bg-amber-500/15 text-amber-300 border-amber-400/30 ring-amber-400/20",
  emerald:"bg-emerald-500/15 text-emerald-300 border-emerald-400/30 ring-emerald-400/20",
  rose:   "bg-rose-500/15 text-rose-300 border-rose-400/30 ring-rose-400/20",
  cyan:   "bg-cyan-500/15 text-cyan-300 border-cyan-400/30 ring-cyan-400/20",
};

const lineColorMap = {
  violet: "from-accent-500/40",
  blue:   "from-blue-500/40",
  amber:  "from-amber-500/40",
  emerald:"from-emerald-500/40",
  rose:   "from-rose-500/40",
  cyan:   "from-cyan-500/40",
};

const stagger = { animate: { transition: { staggerChildren: 0.1 } } };
const item = {
  initial: { opacity: 0, x: -16 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
};

export default function About() {
  const { user, testimonials } = mockData;

  const bioCardRef      = useScrollReveal({ y: 28 });
  const testimonialsRef = useStaggerReveal({ stagger: 0.15 });
  const timelineRef     = useStaggerReveal({ selector: "li", stagger: 0.13, y: 20 });

  return (
    <PageWrapper>
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Page heading */}
        <div>
          <h1 className="font-display text-2xl font-bold text-white">About Me</h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1"><MapPin size={11} />{user.location}</span>
            <span className="flex items-center gap-1"><Mail size={11} />{user.email}</span>
          </div>
        </div>

        {/* Bio */}
        <div ref={bioCardRef}>
        <Card className="p-6 sm:p-8">
          <div className="space-y-4 leading-7 text-zinc-300">
            <p>
              I build full-stack products end to end. At <strong className="text-white">Orbit Technology Solutions</strong> I'm
              engineering <strong className="text-white">Finot ERP</strong> — a multi-branch enterprise resource planning
              platform covering finance, inventory, operations, projects, and HR for Ethiopian businesses. I own features
              from the database schema and API up through the React interface.
            </p>
            <p>
              I'm most productive in <strong className="text-white">TypeScript and JavaScript</strong> — React and Next.js
              on the frontend, Node.js with Prisma and PostgreSQL on the backend. Outside work I built
              <strong className="text-white"> Di-Assist</strong>, an AI-assisted drug information system for clinicians,
              as a solo project. I take pride in writing systems that future engineers (and future me) actually enjoy
              working with.
            </p>
            <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-3 text-sm text-emerald-200">
              Currently open to full-time and contract roles — full-stack, frontend, or backend product work.
              Based in Addis Ababa, remote-friendly.
            </p>
          </div>
        </Card>
        </div>{/* end bioCardRef */}

        {/* Testimonials — stagger reveal */}
        {testimonials && testimonials.length > 0 && (
          <div>
            <h2 className="mb-4 font-display text-lg font-bold text-white">What colleagues say</h2>
            <div ref={testimonialsRef} className="space-y-4">
              {testimonials.map((t) => (
                <Card key={t.name} className="p-5">
                  <Quote size={18} className="mb-3 text-accent-400/60" />
                  <p className="text-sm leading-6 text-zinc-300 italic">"{t.text}"</p>
                  <div className="mt-4 flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="h-9 w-9 rounded-full border border-ink-650 object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-zinc-400">{t.role}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Timeline — GSAP stagger on <li> elements as they scroll in */}
        <div>
          <h2 className="mb-6 font-display text-lg font-bold text-white">Journey</h2>
          <ol ref={timelineRef} className="relative space-y-0">
            {timeline.map((entry, i) => {
              const Icon = entry.icon;
              const colors = colorMap[entry.color] || colorMap.violet;
              const lineColor = lineColorMap[entry.color] || lineColorMap.violet;
              return (
                <li key={i} className="relative flex gap-5 pb-8">
                  {/* Vertical line */}
                  {i < timeline.length - 1 && (
                    <div className={`absolute left-5 top-12 w-px h-full bg-gradient-to-b ${lineColor} to-transparent`} />
                  )}
                  {/* Icon */}
                  <div className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border ring-2 ring-inset ${colors}`}>
                    <Icon size={16} />
                  </div>
                  {/* Content */}
                  <Card className="flex-1 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-white">{entry.title}</h3>
                        <p className="text-sm text-zinc-400">{entry.org}</p>
                      </div>
                      <span className="shrink-0 rounded-full border border-ink-650 bg-ink-950/60 px-2.5 py-1 text-xs text-zinc-400">
                        {entry.year}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">{entry.description}</p>
                    {entry.tech && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {entry.tech.map((t) => (
                          <span key={t} className="rounded-md border border-ink-650 bg-ink-950/50 px-2 py-0.5 text-xs text-zinc-400">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </Card>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </PageWrapper>
  );
}
