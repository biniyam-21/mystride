export const projectArchitectureData = {
  1: {
    id: 1,
    title: "Finot ERP",
    subtitle: "Enterprise Multi-Tenant ERP System for Ethiopian Businesses",
    category: "Full-Stack Enterprise Platform",
    role: "Full-Stack Engineer at Orbit Technology Solutions",
    status: "Production Deployment",
    overview: {
      summary:
        "Finot ERP is a modular enterprise resource planning platform tailored for Ethiopian enterprises. It unifies financial accounting, multi-branch inventory tracking, employee HR/payroll, and operations into a single multi-tenant system.",
      highlights: [
        "Multi-branch schema separation & role-based access control (RBAC)",
        "Automated tax-compliant invoicing (VAT, TOT, withholding tax calculations)",
        "Real-time inventory ledger syncing across regional warehouses",
        "Comprehensive audit logging for financial compliance"
      ],
      liveUrl: null,
      githubUrl: null,
      isPrivate: true,
    },
    screenshots: [
      {
        title: "Executive Financial Dashboard",
        description: "Real-time P&L analysis, revenue streams breakdown, and multi-branch transaction feed.",
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "Multi-Warehouse Inventory Ledger",
        description: "Stock tracking, automated low-stock reorder triggers, and SKU variance reporting.",
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "Role-Based Access & Audit Log",
        description: "Granular permissions editor for Finance, HR, and Operations roles with timestamped audit logs.",
        url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80",
      }
    ],
    databaseSchema: {
      orm: "Prisma ORM with PostgreSQL",
      diagramText: `
+-------------------+       +--------------------+       +-------------------+
|      Tenants      |       |       Users        |       |       Roles       |
+-------------------+       +--------------------+       +-------------------+
| id (PK)           |<----->| id (PK)            |<----->| id (PK)           |
| name              |       | tenantId (FK)      |       | roleName          |
| companyCode       |       | email              |       | permissions (JSON)|
| currency          |       | passwordHash       |       +-------------------+
+-------------------+       | roleId (FK)        |
          |                 +--------------------+
          |                           |
          v                           v
+-------------------+       +--------------------+       +-------------------+
|    Warehouses     |       |    Transactions    |       |   AuditLogs       |
+-------------------+       +--------------------+       +-------------------+
| id (PK)           |<----->| id (PK)            |       | id (PK)           |
| tenantId (FK)     |       | tenantId (FK)      |       | userId (FK)       |
| location          |       | warehouseId (FK)   |       | action            |
| inventoryValuation|       | amount             |       | ipAddress         |
+-------------------+       | taxCategory        |       | timestamp         |
                            +--------------------+       +-------------------+
      `,
      entities: [
        { name: "Tenants", fields: "id, name, companyCode, taxId, currency, createdAt" },
        { name: "Users", fields: "id, tenantId (FK), email, passwordHash, roleId (FK), status" },
        { name: "Warehouses", fields: "id, tenantId (FK), location, managerId, inventoryValuation" },
        { name: "InventoryItems", fields: "id, warehouseId (FK), sku, quantity, costPrice, sellingPrice" },
        { name: "Transactions", fields: "id, tenantId (FK), amount, taxCategory, type, date" },
        { name: "AuditLogs", fields: "id, tenantId (FK), userId (FK), action, payload, timestamp" }
      ]
    },
    folderStructure: `
finot-erp/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Multi-tenant schema definition & indexes
│   ├── src/
│   │   ├── api/
│   │   │   ├── controllers/      # Finance, Inventory, Auth controllers
│   │   │   ├── middlewares/      # Tenant-isolation & RBAC permission guards
│   │   │   └── routes/           # REST endpoint definitions
│   │   ├── config/               # Database, Redis, and JWT secrets
│   │   ├── services/             # Core business logic & financial ledger engine
│   │   └── shared/               # Logger, tax calculation helpers, audit trail
│   └── tests/                    # Integration & unit test suites
└── frontend/
    ├── src/
    │   ├── components/           # Reusable data tables, metric cards, modals
    │   ├── context/              # Auth & Tenant Context providers
    │   ├── hooks/                # React Query data fetching hooks
    │   └── pages/                # Accounting, HR, Inventory, Settings views
    └── vite.config.ts
    `,
    apiDesign: [
      {
        method: "POST",
        endpoint: "/api/v1/auth/login",
        desc: "Authenticate user and issue JWT containing tenantId and permissions.",
        auth: "Public",
        response: "{ token: string, user: { id, email, tenantId, permissions } }"
      },
      {
        method: "GET",
        endpoint: "/api/v1/inventory/warehouse/:id",
        desc: "Fetch paginated warehouse stock ledger with valuation breakdown.",
        auth: "Bearer Token (Inventory Read)",
        response: "{ items: [...], totalValue: 485000, page: 1, limit: 50 }"
      },
      {
        method: "POST",
        endpoint: "/api/v1/finance/invoices",
        desc: "Create tax-compliant VAT invoice with automatic transaction journal entry.",
        auth: "Bearer Token (Finance Write)",
        response: "{ invoiceId: 'INV-2026-0041', taxAmount: 15.0, total: 115.0 }"
      },
      {
        method: "GET",
        endpoint: "/api/v1/audit/logs",
        desc: "Query filterable security audit trails for compliance verification.",
        auth: "Admin Only",
        response: "{ logs: [{ timestamp, action: 'INVOICE_CREATED', userId }], count: 120 }"
      }
    ],
    techStack: {
      frontend: ["React 18", "TypeScript", "Tailwind CSS", "React Query", "Chart.js"],
      backend: ["Node.js", "Express.js", "TypeScript", "Prisma ORM", "Zod Validation"],
      database: ["PostgreSQL", "Redis Caching"],
      devops: ["Docker", "Nginx", "GitHub Actions CI/CD", "Linux VPS Deployment"]
    },
    problemsSolved: [
      {
        problem: "Cross-Tenant Data Leakage Risk",
        solution: "Implemented automated Prisma Middleware that enforces strict tenantId filtering on every single database query automatically."
      },
      {
        problem: "Financial Ledger Inconsistency during Concurrent Orders",
        solution: "Utilized PostgreSQL ACID transactions with isolation levels to prevent race conditions during simultaneous inventory deductions."
      },
      {
        problem: "Complex Local Ethiopian Tax & Withholding Regulations",
        solution: "Engineered a localized tax rule calculation module supporting compound VAT, TOT, and withholding deductions."
      }
    ],
    lessonsLearned: [
      "Designing multi-tenancy at the data layer early prevents painful refactoring later.",
      "Strict audit logging is crucial when managing financial enterprise platforms.",
      "TypeScript interfaces shared between backend and frontend dramatically cut API bugs."
    ]
  },

  2: {
    id: 2,
    title: "Di-Assist",
    subtitle: "AI-Powered Clinical Drug Information & Analytics Assistant",
    category: "Healthcare & AI Engineering",
    role: "Solo Full-Stack Architect & Engineer",
    status: "Active Full-Stack Build",
    overview: {
      summary:
        "Di-Assist is an AI clinical assistant built for medical professionals and pharmacologists. It combines intelligent LLM drug interaction checking, formulary lookup, clinician usage analytics, and secure healthcare authentication.",
      highlights: [
        "Interactive Drug Interaction Matrix & warning level detection",
        "RAG-enabled clinical guidelines query interface",
        "Clinician activity & query trends analytics dashboard",
        "Seamless session security with Better Auth & Prisma"
      ],
      liveUrl: null,
      githubUrl: "https://github.com/biniyam-21/DI_Assist",
      isPrivate: false,
    },
    screenshots: [
      {
        title: "AI Clinical Assistant Workspace",
        description: "Context-aware medical Q&A with structured drug interactions and citation links.",
        url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "Drug Interaction Matrix",
        description: "Visual severity warning badges (Severe, Moderate, Mild) for co-prescribed pharmaceuticals.",
        url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "Clinician Usage Analytics",
        description: "Real-time trends of searched drug classifications, inquiry counts, and active clinical sessions.",
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      }
    ],
    databaseSchema: {
      orm: "Prisma ORM with PostgreSQL",
      diagramText: `
+-------------------+       +--------------------+       +-------------------+
|       User        |       |    DrugFormulary   |       |  InteractionRules |
+-------------------+       +--------------------+       +-------------------+
| id (PK)           |<----->| id (PK)            |<----->| id (PK)           |
| email             |       | brandName          |       | drugA_Id (FK)     |
| role (CLINICIAN)  |       | genericName        |       | drugB_Id (FK)     |
| medicalLicenseNo  |       | category           |       | severity          |
+-------------------+       | dosageForm         |       | description       |
          |                 +--------------------+       +-------------------+
          v                           |
+-------------------+                 v
|   ClinicalLogs    |       +--------------------+
+-------------------+       |    AI_Queries      |
| id (PK)           |       +--------------------+
| userId (FK)       |       | id (PK)            |
| searchTerms       |       | userId (FK)        |
| timestamp         |       | promptText         |
+-------------------+       | answerText         |
                            +--------------------+
      `,
      entities: [
        { name: "User", fields: "id, email, passwordHash, role, medicalLicenseNo, hospitalAffiliation" },
        { name: "DrugFormulary", fields: "id, brandName, genericName, category, dosageForm, mechanismOfAction" },
        { name: "InteractionRules", fields: "id, drugA_Id (FK), drugB_Id (FK), severity (SEVERE|MODERATE), details" },
        { name: "AI_Queries", fields: "id, userId (FK), promptText, answerText, confidenceScore, timestamp" },
        { name: "ClinicalLogs", fields: "id, userId (FK), searchTerms, severityFlag, timestamp" }
      ]
    },
    folderStructure: `
di-assist/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/chat/route.ts      # LLM clinical query endpoint
│   │   │   ├── drugs/route.ts        # Drug lookup & interaction API
│   │   │   └── analytics/route.ts    # Clinician query metrics
│   │   ├── (auth)/                   # Better Auth sign-in / sign-up pages
│   │   └── dashboard/                # Clinical assistant workspace UI
│   ├── components/
│   │   ├── ai/                       # Chat stream components & citation renderers
│   │   ├── drugs/                    # Interaction matrix cards & search inputs
│   │   └── ui/                       # Tailwind v4 UI primitives
│   ├── lib/
│   │   ├── auth.ts                   # Better Auth setup with Prisma
│   │   ├── prisma.ts                 # Prisma Client singleton
│   │   └── ai/                       # LangChain / OpenAI client wrapper
│   └── prisma/
│       └── schema.prisma             # Healthcare database schema
└── tailwind.config.ts
    `,
    apiDesign: [
      {
        method: "POST",
        endpoint: "/api/ai/chat",
        desc: "Process clinician query with medical prompt safety guardrails and return clinical guidance.",
        auth: "Clinician Session",
        response: "{ answer: string, citations: [...], warningFlags: ['SEVERE_INTERACTION'] }"
      },
      {
        method: "POST",
        endpoint: "/api/drugs/check-interaction",
        desc: "Evaluate list of drug IDs for multi-drug contraindications and severity levels.",
        auth: "Clinician Session",
        response: "{ interactions: [{ drugA: 'Warfarin', drugB: 'Aspirin', severity: 'SEVERE' }] }"
      },
      {
        method: "GET",
        endpoint: "/api/analytics/summary",
        desc: "Fetch analytics breakdown of most queried medications and interaction alerts.",
        auth: "Admin / Lead Clinician",
        response: "{ totalQueries: 1420, topSearched: ['Metformin', 'Amoxicillin'], severeWarnings: 34 }"
      }
    ],
    techStack: {
      frontend: ["Next.js (App Router)", "React 19", "Tailwind CSS v4", "Framer Motion", "Lucide React"],
      backend: ["Next.js API Routes", "TypeScript", "LangChain.js", "Zod Schema Validation"],
      database: ["PostgreSQL", "Prisma ORM"],
      auth: ["Better Auth (Session Management)"]
    },
    problemsSolved: [
      {
        problem: "Hallucination Risk in Medical Advice",
        solution: "Restricted LLM context to verified pharmaceutical databases and added explicit confidence threshold scoring."
      },
      {
        problem: "Slow Multi-Drug Interaction Lookups",
        solution: "Indexed drug pair IDs with compound unique keys in PostgreSQL, achieving sub-10ms lookup times."
      }
    ],
    lessonsLearned: [
      "Next.js App Router server components simplify secure API key handling.",
      "Designing medical interfaces requires extreme clarity in visual hierarchy and error warnings."
    ]
  },

  3: {
    id: 3,
    title: "Portfolio AI Architecture",
    subtitle: "RAG-Powered Interactive Developer Portfolio System",
    category: "Full-Stack AI Application",
    role: "Architect & Developer",
    status: "Production Live on Render",
    overview: {
      summary:
        "An AI-augmented portfolio application featuring a custom RAG (Retrieval-Augmented Generation) pipeline built on Node.js, Express 5, LanceDB vector storage, and an interactive React frontend.",
      highlights: [
        "Local vector database embedding retrieval using LanceDB & OpenRouter",
        "Lightweight self-ping keep-alive service for zero-cold-start cloud hosting",
        "Interactive command palette, dark glassmorphism, and GSAP micro-animations",
        "Automated audit logging and Telegram notification alerts"
      ],
      liveUrl: "https://node-rag-engine.onrender.com/health",
      githubUrl: "https://github.com/biniyam-21/node-rag-engine",
      isPrivate: false,
    },
    screenshots: [
      {
        title: "Developer Dashboard & RAG Widget",
        description: "Interactive portfolio workspace with real-time AI assistant drawer and command palette.",
        url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "Vector Search Architecture",
        description: "Document ingestion pipeline chunking markdown knowledge files into LanceDB embeddings.",
        url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
      }
    ],
    databaseSchema: {
      orm: "LanceDB (Embedded Vector Store) & Markdown Manifest",
      diagramText: `
+-------------------+       +--------------------+       +-------------------+
|  Knowledge File   |       |   Markdown Chunk   |       | LanceDB Embeddings|
+-------------------+       +--------------------+       +-------------------+
| relativePath      |======>| chunkId            |======>| vector (float[384])|
| contentHash       |       | content            |       | chunkId (Ref)     |
| lastModified      |       | tokenLength        |       | similarityScore   |
+-------------------+       +--------------------+       +-------------------+
      `,
      entities: [
        { name: "DocumentManifest", fields: "relativePath, hash, documentId, ingestedAt" },
        { name: "VectorIndex", fields: "vector (float array), textChunk, metadata, docId" }
      ]
    },
    folderStructure: `
portfolio-ai/
├── backend/
│   ├── src/
│   │   ├── ai/                   # OpenRouter / LLM client providers
│   │   ├── api/                  # Express routes (chat, health, contact, blogs)
│   │   ├── config/               # Environment & RAG configuration
│   │   ├── rag/                  # LanceDB vector store, chunker & retriever
│   │   ├── services/             # Keep-alive ping, blog, & notification logic
│   │   └── server.ts             # App bootstrap & pipeline initialization
│   ├── database/                 # LanceDB persistent vector files
│   └── knowledge/                # Markdown bio, project, & technical docs
└── front-end/
    └── src/
        ├── components/           # Navbar, Cards, Architecture Modal, Notification Drawer
        ├── pages/                # Dashboard, Projects, Blog, AskMe AI
        └── services/             # RAG API client
    `,
    apiDesign: [
      {
        method: "POST",
        endpoint: "/api/v1/chat",
        desc: "RAG query endpoint: retrieves vector matches from LanceDB and streams answer.",
        auth: "Public",
        response: "{ success: true, data: { answer: '...', sources: [...] } }"
      },
      {
        method: "GET",
        endpoint: "/health",
        desc: "Lightweight health check endpoint for Uptime pinging.",
        auth: "Public",
        response: "{ status: 'ok', uptimeSeconds: 14200 }"
      }
    ],
    techStack: {
      frontend: ["React 18", "Vite", "Tailwind CSS", "GSAP", "Framer Motion"],
      backend: ["Node.js", "Express v5", "TypeScript", "Pino Logger"],
      ai_vector: ["LanceDB", "@langchain/textsplitters", "OpenRouter API"],
      devops: ["Render", "GitHub Actions"]
    },
    problemsSolved: [
      {
        problem: "Render Free Tier Sleeping (Cold Starts)",
        solution: "Created an automated internal self-ping service (`startSelfPing()`) calling `/health` every 10 minutes."
      },
      {
        problem: "CORS Restrictions across Vercel & Render",
        solution: "Engineered a dynamic CORS handler accepting wildcard subdomains (`.vercel.app`, `.onrender.com`) and comma-separated origins."
      }
    ],
    lessonsLearned: [
      "Embedded vector stores like LanceDB allow fast, cost-effective RAG without external vector SaaS costs.",
      "Careful `.gitignore` scoping prevents ignoring nested source folders (`src/rag/embeddings`)."
    ]
  },

  4: {
    id: 4,
    title: "HSIM Dashboard",
    subtitle: "Healthcare Data Management & Information Portal",
    category: "Web Application",
    role: "Full-Stack Engineer",
    status: "Completed Prototype",
    overview: {
      summary:
        "Information management dashboard built for healthcare metrics tracking, patient record filtering, and administrative data analysis.",
      highlights: ["Interactive data tables with sort/filter", "Role-aware view permissions", "TypeScript type-safe state management"],
      liveUrl: null,
      githubUrl: "https://github.com/biniyam-21/HSIM_dashboard",
      isPrivate: false,
    },
    screenshots: [
      {
        title: "Metrics Dashboard",
        description: "Patient volume, department throughput, and operational metrics.",
        url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80",
      }
    ],
    databaseSchema: {
      orm: "TypeORM / PostgreSQL",
      diagramText: `+-------------+     +---------------+
|    Users    |<--->|  Records      |
+-------------+     +---------------+`,
      entities: [{ name: "PatientRecord", fields: "id, patientId, department, status, timestamp" }]
    },
    folderStructure: "hsim-dashboard/\n├── src/\n│   ├── components/\n│   ├── hooks/\n│   └── pages/",
    apiDesign: [
      { method: "GET", endpoint: "/api/records", desc: "Fetch clinical metrics", auth: "Bearer", response: "{ records: [...] }" }
    ],
    techStack: {
      frontend: ["React", "TypeScript", "Tailwind CSS"],
      backend: ["Node.js", "Express"],
      database: ["PostgreSQL"]
    },
    problemsSolved: [
      { problem: "Large Data Table Performance", solution: "Implemented client-side virtualization and paginated querying." }
    ],
    lessonsLearned: ["Modular component boundaries make large dashboard interfaces maintainable."]
  },

  5: {
    id: 5,
    title: "Droga Pharma Redesign",
    subtitle: "Accessibility-First Pharmaceutical Platform Redesign",
    category: "Frontend & UI/UX Engineering",
    role: "Frontend Developer",
    status: "Completed",
    overview: {
      summary:
        "Modernized web application redesign for a major Ethiopian pharmaceutical distributor with a focus on web accessibility (WCAG), responsive UI, and clean product discovery.",
      highlights: ["WCAG AAA contrast compliance", "Mobile-first responsive layout", "Fast client rendering"],
      liveUrl: null,
      githubUrl: "https://github.com/biniyam-21/Droga_pharma_clone",
      isPrivate: false,
    },
    screenshots: [
      {
        title: "Product Showcase View",
        description: "Clean medical supply catalog with filtering and search.",
        url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80",
      }
    ],
    databaseSchema: {
      orm: "Static / JSON Catalog",
      diagramText: `+------------------+\n| Product Catalog  |\n+------------------+`,
      entities: [{ name: "Product", fields: "id, name, category, description, image" }]
    },
    folderStructure: "droga-pharma/\n├── index.html\n├── styles/\n└── scripts/",
    apiDesign: [],
    techStack: {
      frontend: ["HTML5", "Vanilla CSS", "JavaScript ES6+"],
      backend: [],
      database: []
    },
    problemsSolved: [
      { problem: "Poor Mobile Usability on Legacy Site", solution: "Re-architected responsive CSS grid and fluid typography." }
    ],
    lessonsLearned: ["Semantic HTML and accessible ARIA attributes are key to high-quality frontend craft."]
  },

  6: {
    id: 6,
    title: "JPMC Forage — Midas",
    subtitle: "Enterprise Java & Kafka Financial Pipeline",
    category: "Backend & Systems Engineering",
    role: "Software Engineering Simulation",
    status: "Completed",
    overview: {
      summary:
        "Simulation extending a production-grade Java application for JPMorgan Chase's Midas system, implementing message queue processing with Apache Kafka.",
      highlights: ["Kafka event streaming integration", "Java Spring Boot service", "Financial transaction flow processing"],
      liveUrl: null,
      githubUrl: "https://github.com/biniyam-21/forage-midas",
      isPrivate: false,
    },
    screenshots: [
      {
        title: "Kafka Event Flow",
        description: "Real-time message consumer parsing transaction logs.",
        url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
      }
    ],
    databaseSchema: {
      orm: "Spring Data JPA / H2",
      diagramText: `+-------------------+\n| Transaction Event |\n+-------------------+`,
      entities: [{ name: "TransactionEvent", fields: "eventId, accountId, amount, status" }]
    },
    folderStructure: "forage-midas/\n├── src/main/java/\n└── src/main/resources/",
    apiDesign: [
      { method: "POST", endpoint: "/api/transactions/process", desc: "Push event to Kafka topic", auth: "Internal", response: "{ status: 'QUEUED' }" }
    ],
    techStack: {
      frontend: [],
      backend: ["Java 17", "Spring Boot", "Apache Kafka"],
      database: ["H2 Database", "JPA"]
    },
    problemsSolved: [
      { problem: "High-Throughput Financial Event Processing", solution: "Decoupled transaction processing with Kafka pub/sub messaging queues." }
    ],
    lessonsLearned: ["Event-driven architectures drastically improve system resilience and scalability."]
  }
};
