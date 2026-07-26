import {
  GraduationCap,
  BriefcaseBusiness,
  Building2,
  HeartPulse,
  BrainCircuit,
  Rocket,
} from "lucide-react";

export const achievementsData = [
  {
    id: 1,
    title: "Great Distinction",
    description:
      "Graduated from Addis Ababa University with Great Distinction in Software Engineering (CGPA: 3.7).",
    year: "May 2025",
    category: "Education",
    icon: GraduationCap,
    badgeColor: "bg-purple-500/15 border-purple-400/30 text-purple-300",
    gradientAccent: "from-purple-600/20 via-accent-500/10 to-transparent",
  },
  {
    id: 2,
    title: "Industry Experience",
    description:
      "Completed a professional software engineering internship as a MERN Stack and Next.js Developer at Source Code IT Solutions.",
    year: "2025",
    category: "Experience",
    icon: BriefcaseBusiness,
    badgeColor: "bg-blue-500/15 border-blue-400/30 text-blue-300",
    gradientAccent: "from-blue-600/20 via-accent-500/10 to-transparent",
  },
  {
    id: 3,
    title: "ERP System Builder",
    description:
      "Designed and developed Finot ERP, a multi-branch enterprise resource planning platform featuring HR, Inventory, Finance, Projects, and Procurement modules.",
    year: "2026",
    category: "Project",
    icon: Building2,
    badgeColor: "bg-amber-500/15 border-amber-400/30 text-amber-300",
    gradientAccent: "from-amber-600/20 via-accent-500/10 to-transparent",
  },
  {
    id: 4,
    title: "Healthcare AI Platform",
    description:
      "Built an AI-assisted healthcare system with patient management, drug interaction checking, RAG-powered assistant, and intelligent clinical workflows.",
    year: "2026",
    category: "Healthcare",
    icon: HeartPulse,
    badgeColor: "bg-emerald-500/15 border-emerald-400/30 text-emerald-300",
    gradientAccent: "from-emerald-600/20 via-accent-500/10 to-transparent",
  },
  {
    id: 5,
    title: "RAG Portfolio Assistant",
    description:
      "Integrated a Retrieval-Augmented Generation (RAG) assistant into my portfolio, enabling recruiters to ask questions about my experience, projects, architecture, and skills.",
    year: "2026",
    category: "AI",
    icon: BrainCircuit,
    badgeColor: "bg-violet-500/15 border-violet-400/30 text-violet-300",
    gradientAccent: "from-violet-600/20 via-accent-500/10 to-transparent",
  },
  {
    id: 6,
    title: "Production Applications",
    description:
      "Built and deployed multiple full-stack web applications using React, Next.js, Node.js, Express, PostgreSQL, Prisma, and Docker.",
    year: "Ongoing",
    category: "Development",
    icon: Rocket,
    badgeColor: "bg-rose-500/15 border-rose-400/30 text-rose-300",
    gradientAccent: "from-rose-600/20 via-accent-500/10 to-transparent",
  },
];
