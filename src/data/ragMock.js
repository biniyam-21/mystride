/**
 * Mock RAG knowledge base.
 * Structure is intentionally RAG-ready:
 * - Each entry has `keywords` (for mock fuzzy match, later replaced by embeddings)
 * - `category` tags for metadata filtering
 * - `response` is the final answer string (supports **bold** and \n line breaks)
 *
 * To integrate real RAG later:
 * 1. Embed each `response` into a vector store (Pinecone / Supabase pgvector)
 * 2. Replace `findResponse()` with a similarity-search call to your embedding API
 * 3. Pass top-k chunks to an LLM with the user query
 */

const knowledge = [
  {
    id: "intro",
    category: "general",
    keywords: ["who", "about", "yourself", "introduce", "you", "tell me", "overview", "summary", "biniyam"],
    response:
      "Hey there! I'm Biniyam Tesfu — a **full-stack software engineer** based in Addis Ababa, Ethiopia.\n\nI build production software end to end: I'm currently engineering **Finot ERP**, a multi-branch enterprise resource planning platform, at Orbit Technology Solutions, and on the side I built **Di-Assist**, an AI-assisted healthcare drug information system.\n\nI'm **open to full-time roles and contracts** in full-stack, frontend, or backend engineering. Feel free to ask me anything!",
  },
  {
    id: "experience",
    category: "work",
    keywords: ["experience", "work", "job", "career", "professional", "worked", "employment", "company", "role", "position", "history", "orbit"],
    response:
      "Biniyam's professional experience:\n\n**Full-Stack Engineer — Orbit Technology Solutions** (Addis Ababa)\nBuilding **Finot ERP**, a multi-branch ERP platform for Ethiopian businesses — finance, inventory, operations, projects, and HR modules. He works across the whole stack: React frontend, Express/Prisma/PostgreSQL backend, role-based access control, and branch-scoped data access.\n\n**Independent Projects**\nDesigned and shipped **Di-Assist**, a healthcare drug information platform with an AI assistant and drug interaction checker, as a solo full-stack build.",
  },
  {
    id: "skills",
    category: "skills",
    keywords: ["skills", "tech", "stack", "technologies", "languages", "tools", "know", "proficient", "expertise", "use", "technology", "programming"],
    response:
      "Biniyam's core tech stack:\n\n**Languages:** TypeScript · JavaScript · Java · SQL · Python\n**Frontend:** React · Next.js · Tailwind CSS · React Query · Framer Motion\n**Backend:** Node.js · Express · Prisma · REST APIs · Zod validation\n**Data & Infra:** PostgreSQL · Turborepo monorepos · Git/GitHub\n\nHis strongest ground is **React + TypeScript frontends** backed by **Node.js/Prisma/PostgreSQL** — the exact stack Finot ERP runs on.",
  },
  {
    id: "projects",
    category: "projects",
    keywords: ["project", "projects", "built", "build", "portfolio", "work", "made", "created", "shipped", "code", "github", "repo", "finot", "erp", "di-assist", "diassist"],
    response:
      "Biniyam's flagship work:\n\n**Finot ERP** — Multi-branch enterprise resource planning platform (React, Express, Prisma, PostgreSQL). Finance, inventory, operations, projects, and HR modules with role-based permissions. Built at Orbit Technology Solutions.\n\n**Di-Assist** — Healthcare drug information system with an AI assistant, drug interaction checker, and clinician analytics (Next.js, React 19, Tailwind v4, Prisma, Better Auth).\n\n**HSIM Dashboard** — TypeScript dashboard project.\n\nBrowse his GitHub at **github.com/biniyam-21** or check the **Projects page** for details.",
  },
  {
    id: "availability",
    category: "hiring",
    keywords: ["available", "hire", "hiring", "open", "work", "job", "opportunity", "freelance", "contract", "full-time", "fulltime", "join", "looking"],
    response:
      "✅ **Yes, Biniyam is open to new opportunities!**\n\nHe's open to:\n→ Full-time full-stack, frontend, or backend engineering roles\n→ Contract and freelance projects\n→ Remote-first or hybrid positions\n\nBase: Addis Ababa, Ethiopia · Remote (global) friendly\n\nTo reach out, head to the **Contact page** or email **biniyamxyz@gmail.com** directly.",
  },
  {
    id: "education",
    category: "education",
    keywords: ["education", "degree", "study", "university", "college", "school", "academic", "graduate", "graduation", "bsc", "cs", "certification", "certified", "certificate", "forage", "jpmc"],
    response:
      "Biniyam studied **Computer Science** and complements it with hands-on programs:\n\n→ **JPMorgan Chase Advanced Software Engineering** virtual experience (Forage) — production-style Java codebase, message queues, and financial data flows\n→ Continuous self-driven learning: he treats every production system he ships as the real curriculum",
  },
  {
    id: "contact",
    category: "contact",
    keywords: ["contact", "reach", "email", "linkedin", "github", "social", "message", "talk", "connect", "dm", "get in touch"],
    response:
      "You can reach Biniyam through any of these:\n\n**Email:** biniyamxyz@gmail.com\n**GitHub:** github.com/biniyam-21\n**LinkedIn:** linkedin.com/in/biniyam-tesfu\n\nOr use the **Contact page** on this portfolio to send him a message directly. He typically replies within 24 hours.",
  },
  {
    id: "strengths",
    category: "personality",
    keywords: ["strength", "strong", "best", "good at", "excel", "superpower", "advantage", "value"],
    response:
      "Biniyam's standout strengths:\n\n**End-to-End Ownership** — He ships whole features alone: schema, API, permissions, UI, and polish. Finot ERP modules go from design doc to production under his hands.\n\n**Domain Modeling** — ERPs and healthcare systems live or die on data models. He's comfortable turning messy business rules into clean relational schemas.\n\n**UI Craft** — He sweats the details: motion, empty states, accessibility, and dashboards that people actually enjoy using.\n\n**Fast, Honest Learner** — Picks up new tools (Next.js 16, Tailwind v4, AI integrations) by shipping real projects with them.",
  },
  {
    id: "goals",
    category: "general",
    keywords: ["goal", "future", "plan", "next", "vision", "dream", "aspire", "want to", "ambition"],
    response:
      "In the next few years, Biniyam aims to:\n\n→ Grow into a senior full-stack engineer owning large product surfaces\n→ Ship AI-assisted products for real-world domains like healthcare and enterprise operations\n→ Contribute to the growing Ethiopian tech ecosystem while working with global teams\n\nHe's driven by **building software that real businesses depend on every day**.",
  },
  {
    id: "salary",
    category: "hiring",
    keywords: ["salary", "pay", "compensation", "rate", "money", "cost", "charge", "hourly", "ctc"],
    response:
      "Biniyam prefers to discuss compensation details directly once there's mutual interest in a role — it's important that expectations align on both sides.\n\nPlease reach out via the **Contact page** or **biniyamxyz@gmail.com** to start a conversation. He's open and straightforward about expectations.",
  },
];

const fallback = {
  response:
    "That's a great question — I don't have a specific answer for that in my knowledge base yet! 🤔\n\nYou can find more details by browsing the portfolio, or reach Biniyam directly at **biniyamxyz@gmail.com**.\n\nTry asking about his experience, projects, skills, availability, or how to contact him!",
};

/** Simulated RAG retrieval — replace this function with a real vector search call */
export function findResponse(query) {
  const lower = query.toLowerCase().trim();
  if (!lower) return null;

  let best = null;
  let bestScore = 0;

  for (const item of knowledge) {
    const score = item.keywords.reduce(
      (acc, kw) => acc + (lower.includes(kw) ? 1 : 0),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  return bestScore > 0 ? best.response : fallback.response;
}

export const suggestedQuestions = [
  "Who is Biniyam Tesfu?",
  "Is he available for hire?",
  "What's his tech stack?",
  "Tell me about Finot ERP",
  "What's his work experience?",
  "What are his strongest skills?",
  "How can I contact him?",
];
