import React from "react";
import { Download, Printer } from "lucide-react";
import PageWrapper from "../components/shared/PageWrapper";
import Card from "../components/Card";
import { mockData } from "../data/mockData";
import { experience, education, certs, RESUME_PDF_URL, RESUME_UPDATED } from "../data/resume";
import { useScrollReveal, useStaggerReveal } from "../hooks/gsapUtils";
import mypic from "../assets/images/mypic.jpg";

export default function Resume() {
  const { user } = mockData;
  const actionsRef = useScrollReveal({ y: 16, duration: 0.5 });
  const sectionsRef = useStaggerReveal({ stagger: 0.14, y: 26 });

  return (
    <PageWrapper>
      <div className="mx-auto max-w-3xl space-y-5">
        {/* Actions */}
        <div ref={actionsRef} className="flex items-center justify-between print:hidden">
          <div>
            <h1 className="text-2xl font-bold text-white">Resume</h1>
            <p className="mt-1 text-sm text-zinc-400">Updated {RESUME_UPDATED}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-xl border border-ink-650 bg-ink-800 px-4 py-2 text-sm text-zinc-300 transition hover:border-accent-400/40 hover:text-white"
            >
              <Printer size={15} />
              Print
            </button>
            <a
              href={RESUME_PDF_URL}
              download
              className="flex items-center gap-2 rounded-xl bg-accent-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-500"
            >
              <Download size={15} />
              Download PDF
            </a>
          </div>
        </div>

        {/* Stagger-revealed sections */}
        <div ref={sectionsRef} className="space-y-5">

        {/* Header */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <img src={mypic} alt="" className="h-16 w-16 rounded-2xl border-2 border-accent-400/30 object-cover print:hidden" />
            <div>
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-sm text-zinc-400">{user.roles.join(" · ")}</p>
              <p className="mt-1 text-xs text-zinc-400">{user.email} · {user.location} · {user.github}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-zinc-400">
            Full-stack engineer building production software end to end — currently engineering a multi-branch
            ERP platform at Orbit Technology Solutions, with independent projects in AI-assisted healthcare tooling.
            Strongest in React, TypeScript, Node.js, and PostgreSQL.
          </p>
        </Card>

        {/* Experience */}
        <Card className="p-6">
          <h3 className="mb-4 font-semibold text-white">Experience</h3>
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.role} className="border-l-2 border-accent-500/30 pl-4">
                <div className="flex flex-wrap items-start justify-between gap-1">
                  <div>
                    <p className="font-medium text-white">{exp.role}</p>
                    <p className="text-sm text-accent-300">{exp.company}</p>
                  </div>
                  <span className="text-xs text-zinc-400">{exp.period}</span>
                </div>
                <ul className="mt-2 space-y-1">
                  {exp.points.map((pt) => (
                    <li key={pt} className="flex gap-2 text-sm text-zinc-400">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>

        {/* Education */}
        <Card className="p-6">
          <h3 className="mb-4 font-semibold text-white">Education</h3>
          {education.map((ed) => (
            <div key={ed.degree} className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-white">{ed.degree}</p>
                <p className="text-sm text-zinc-400">{ed.school}{ed.grade ? ` · ${ed.grade}` : ""}</p>
              </div>
              <span className="text-xs text-zinc-400">{ed.period}</span>
            </div>
          ))}
        </Card>

        {/* Certifications */}
        <Card className="p-6">
          <h3 className="mb-4 font-semibold text-white">Programs & Certifications</h3>
          <ul className="space-y-2">
            {certs.map((c) => (
              <li key={c} className="flex items-center gap-2 text-sm text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
                {c}
              </li>
            ))}
          </ul>
        </Card>
        </div>{/* end sectionsRef */}
      </div>
    </PageWrapper>
  );
}
