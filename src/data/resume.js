// Single source of truth for resume content — used by the Resume page.
// Keep this in sync with public/Biniyam_Tesfu_Resume.pdf when you update it.

export const RESUME_PDF_URL = "/Biniyam_Tesfu_Resume.pdf";
export const RESUME_UPDATED = "July 2026";

export const experience = [
  {
    role: "Full-Stack Engineer",
    company: "Orbit Technology Solutions",
    period: "2024 – Present",
    points: [
      "Building Finot ERP — a multi-branch enterprise resource planning platform (finance, inventory, operations, projects, HR)",
      "Own features end to end: Prisma/PostgreSQL schema, Express REST APIs with Zod validation, and the React frontend",
      "Implemented role-based access control and branch-scoped data access used across every module",
    ],
  },
  {
    role: "Independent Projects",
    company: "Self-directed",
    period: "Ongoing",
    points: [
      "Di-Assist — healthcare drug information system with AI assistant, drug interaction checker, and clinician analytics (Next.js, React 19, Prisma, Better Auth)",
      "JPMorgan Chase Advanced Software Engineering virtual experience (Forage) — production-style Java, Kafka message flows",
    ],
  },
];

// TODO: fill in your university, graduation year, and grade.
export const education = [
  {
    degree: "B.Sc. — Computer Science",
    school: "Your University Here",
    period: "20XX – 20XX",
    grade: "",
  },
];

export const certs = [
  "JPMorgan Chase — Advanced Software Engineering (Forage)",
];
