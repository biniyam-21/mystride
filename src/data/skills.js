// Skills grouped by honest fluency tiers instead of arbitrary percentages.
// `context` says where the skill was actually used — proof beats self-grades.
// `level` is an honest 0-100 proficiency for the visual bar.
export const skillTiers = [
  {
    tier: "Daily Drivers",
    tagline: "The tools I ship production code with every day",
    color: "violet",
    skills: [
      { name: "TypeScript / JavaScript", context: "Everything I build", level: 92 },
      { name: "React", context: "Finot ERP web app · this portfolio", level: 90 },
      { name: "Node.js + Express", context: "Finot ERP API layer", level: 88 },
      { name: "PostgreSQL + Prisma", context: "Finot ERP & Di-Assist data layers", level: 85 },
      { name: "Tailwind CSS", context: "Every UI I've shipped since 2023", level: 93 },
    ],
  },
  {
    tier: "Proficient",
    tagline: "Comfortable shipping features without hand-holding",
    color: "blue",
    skills: [
      { name: "Next.js", context: "Di-Assist (App Router, React 19)", level: 80 },
      { name: "React Query", context: "All server state in Finot ERP", level: 78 },
      { name: "REST API design", context: "Controller → Service → Repository patterns", level: 82 },
      { name: "Zod validation", context: "Schema-first types across Finot ERP", level: 76 },
      { name: "Auth & RBAC", context: "Role/permission systems, Better Auth", level: 75 },
      { name: "Git & GitHub", context: "Monorepos, PR workflows, CI", level: 84 },
    ],
  },
  {
    tier: "Working Knowledge",
    tagline: "Used in real projects, still deepening",
    color: "emerald",
    skills: [
      { name: "Java", context: "JPMC advanced software engineering program", level: 60 },
      { name: "Turborepo", context: "Finot ERP monorepo tooling", level: 65 },
      { name: "Framer Motion & GSAP", context: "Micro-interactions in this portfolio", level: 68 },
      { name: "Python", context: "Scripts and tooling", level: 58 },
    ],
  },
  {
    tier: "Exploring",
    tagline: "Actively learning by building",
    color: "amber",
    skills: [
      { name: "AI integrations", context: "Gemini-powered assistant in Di-Assist", level: 45 },
      { name: "Docker", context: "Local dev environments", level: 38 },
      { name: "Cloud deployment", context: "Vercel, VPS setups", level: 42 },
    ],
  },
];
