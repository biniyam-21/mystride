// Real projects only — no invented metrics. `github: null` means private/company code.
export const projects = [
  {
    id: 1,
    title: "Finot ERP",
    description:
      "Multi-branch enterprise resource planning platform for Ethiopian businesses — finance, inventory, operations, projects, and HR in one system. Built at Orbit Technology Solutions.",
    impact: "Production ERP · multi-branch · role-based access control",
    tags: ["React", "Node.js", "Express", "Prisma", "PostgreSQL"],
    language: "TypeScript",
    langColor: "#3178c6",
    accent: "from-violet-600/30 to-blue-600/20",
    github: null, // company repository (private)
    demo: null,
    featured: true,
  },
  {
    id: 2,
    title: "Di-Assist",
    description:
      "Healthcare drug information platform for clinicians — AI-powered assistant, drug interaction checker, analytics dashboard, and user management. Solo full-stack build.",
    impact: "AI assistant · interaction checker · clinician analytics",
    tags: ["Next.js", "React 19", "Tailwind v4", "Prisma", "Better Auth"],
    language: "TypeScript",
    langColor: "#3178c6",
    accent: "from-emerald-600/25 to-teal-600/15",
    github: "https://github.com/biniyam-21/DI_Assist",
    demo: null,
    featured: true,
  },
  {
    id: 3,
    title: "This Portfolio",
    description:
      "The site you're looking at — dashboard-style portfolio with a command palette, AI-style assistant, terminal widgets, and GSAP micro-interactions.",
    impact: "Command palette · AI assistant widget · custom design system",
    tags: ["React", "Vite", "Tailwind CSS", "GSAP", "Framer Motion"],
    language: "JavaScript",
    langColor: "#f1e05a",
    accent: "from-amber-600/25 to-orange-600/15",
    github: "https://github.com/biniyam-21",
    demo: null,
    featured: true,
  },
  {
    id: 4,
    title: "HSIM Dashboard",
    description:
      "Information management dashboard — data tables, filtering, and role-aware views built with a modern TypeScript stack.",
    impact: null,
    tags: ["TypeScript", "React", "Dashboard"],
    language: "TypeScript",
    langColor: "#3178c6",
    accent: "from-blue-600/30 to-cyan-600/20",
    github: "https://github.com/biniyam-21/HSIM_dashboard",
    demo: null,
    featured: false,
  },
  {
    id: 5,
    title: "Droga Pharma Redesign",
    description:
      "Redesign of a real pharmaceutical company's site focused on accessibility and user experience with a clean, professional visual language.",
    impact: "Accessibility-first rebuild of a live company site",
    tags: ["HTML", "CSS", "JavaScript", "UX"],
    language: "CSS",
    langColor: "#563d7c",
    accent: "from-rose-600/25 to-pink-600/15",
    github: "https://github.com/biniyam-21/Droga_pharma_clone",
    demo: null,
    featured: false,
  },
  {
    id: 6,
    title: "JPMC Forage — Midas",
    description:
      "JPMorgan Chase's advanced software engineering program: extending a production-style Java service with message queues and financial data flows.",
    impact: "Production-style Java · Kafka message flows",
    tags: ["Java", "Spring", "Kafka"],
    language: "Java",
    langColor: "#b07219",
    accent: "from-cyan-600/25 to-sky-600/15",
    github: "https://github.com/biniyam-21/forage-midas",
    demo: null,
    featured: false,
  },
];

export const allTags = [...new Set(projects.flatMap((p) => p.tags))].sort();
