import { BriefcaseBusiness, GraduationCap, Award, Code2, Rocket } from "lucide-react";

// NOTE: verify years, and fill in your university name + graduation year.
export const timeline = [
  {
    year: "2024",
    title: "Full-Stack Engineer",
    org: "Orbit Technology Solutions",
    type: "work",
    icon: BriefcaseBusiness,
    color: "violet",
    description:
      "Building Finot ERP — a multi-branch enterprise resource planning platform for Ethiopian businesses. I work across the stack: finance, operations, and projects modules, role-based access control, and the React frontend.",
    tech: ["React", "Node.js", "Express", "Prisma", "PostgreSQL", "Turborepo"],
  },
  {
    year: "2026",
    title: "Di-Assist — Healthcare Platform",
    org: "Personal Project",
    type: "project",
    icon: Code2,
    color: "emerald",
    description:
      "Designed and built a drug information system for clinicians: AI-powered assistant, drug interaction checker, analytics, and user management. Full-stack solo build.",
    tech: ["Next.js", "React 19", "Tailwind CSS v4", "Prisma", "Better Auth", "Gemini AI"],
  },
  {
    year: "2024",
    title: "Advanced Software Engineering Program",
    org: "JPMorgan Chase & Co. (Forage)",
    type: "cert",
    icon: Award,
    color: "amber",
    description:
      "Completed JPMC's advanced software engineering virtual experience — working with a production-style Java codebase, message queues, and financial data flows.",
    tech: ["Java", "Spring", "Kafka"],
  },
  {
    year: "2023",
    title: "B.Sc. — Computer Science",
    org: "Your University Here", // TODO: fill in your university + adjust year
    type: "education",
    icon: GraduationCap,
    color: "rose",
    description:
      "Studied computer science fundamentals — data structures, algorithms, databases, and software engineering. Built my first production-style projects during this time.",
    tech: ["Java", "Python", "Data Structures"],
  },
  {
    year: "2020",
    title: "First Lines of Code",
    org: "Self-taught",
    type: "milestone",
    icon: Rocket,
    color: "cyan",
    description:
      "Started with HTML, CSS, and JavaScript, building small sites and dashboards — and never stopped shipping since.",
    tech: ["HTML", "CSS", "JavaScript"],
  },
];
