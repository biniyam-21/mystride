import {
  Terminal,
  BadgeCheck,
  Eye,
  LayoutDashboard,
  User,
  FolderOpen,
  FileText,
  BarChart3,
  Trophy,
  BookOpen,
  Zap,
  Award,
  FileUser,
  Mail,
  Sparkles,
} from "lucide-react";

// NOTE: verify the LinkedIn URL and the stats values below — adjust to your
// actual numbers before deploying.
export const mockData = {
  user: {
    name: "Biniyam Tesfu",
    tagline: "Full-Stack Engineer · React & Node.js · ERP & Healthcare Systems",
    summary:
      "I build full-stack products end to end — from a multi-branch ERP platform used by real businesses in Ethiopia to an AI-assisted healthcare drug information system. I care about clean architecture, honest engineering, and shipping software people actually rely on.",
    email: "biniyamxyz@gmail.com",
    location: "Addis Ababa, Ethiopia",
    linkedin: "linkedin.com/in/biniyam-tesfu",
    github: "github.com/biniyam-21",
    availability: "Open to roles · Full-time & Contract",
    preferredRoles: ["Full-Stack Engineer", "Frontend Engineer", "Backend Engineer"],
    views: 146,
    certificates: 1,
    languages: ["TypeScript", "JavaScript", "Java", "SQL", "Python"],
    skills: ["Full-Stack Architecture", "REST API Design", "Relational Data Modeling", "Auth & Role-Based Access", "UI Engineering"],
    avatar: "https://avatars.githubusercontent.com/u/66387541?v=4",
    roles: ["Software Engineer", "Full-Stack Developer", "React + Next.js Developer"],
    social: {
      github: "https://github.com/biniyam-21",
      linkedin: "https://linkedin.com/in/biniyam-tesfu",
      email: "biniyamxyz@gmail.com",
    },
    stats: [
      { label: "Years Experience", value: 2, suffix: "+" },
      { label: "ERP Modules Built", value: 8, suffix: "+" },
      { label: "Side Projects", value: 6, suffix: "+" },
      { label: "Public Repos", value: 13, suffix: "" },
    ],
  },
  currentlyBuilding: [
    {
      name: "Finot ERP",
      description: "Multi-branch enterprise resource planning platform for Ethiopian businesses — finance, inventory, operations, projects, and HR in one system.",
      tech: ["React", "Node.js", "Express", "Prisma", "PostgreSQL"],
      status: "In Development",
      progress: 70,
      color: "violet",
    },
    {
      name: "Di-Assist",
      description: "Healthcare drug information platform with an AI assistant, drug interaction checker, and analytics dashboard for clinicians.",
      tech: ["Next.js", "React 19", "Tailwind v4", "Prisma", "Gemini AI"],
      status: "Beta",
      progress: 80,
      color: "emerald",
    },
  ],
  // Add real quotes from colleagues here when you have them — the About page
  // hides this section while the array is empty.
  testimonials: [],
  ranks: {
    global: "1,84,372",
    country: "12,327",
    percentile: "91.8%",
    points: [84, 64, 70, 44, 53, 31, 38],
    labels: ["Jul 19", "Jul 24", "Jul 29", "Aug 3", "Aug 8", "Aug 14", "Aug 19"],
  },
  achievements: [
    { icon: Terminal, label: "Shell Sage" },
    { icon: BadgeCheck, label: "Certified" },
    { icon: Eye, label: "Profile Star" },
  ],
  streak: {
    longest: 20,
    months: ["Oct", "Sep", "Aug"],
    cells: Array.from({ length: 84 }, (_, i) => [0, 1, 2, 3, 4][(i * 7 + i) % 5]),
  },
  attempts: {
    total: "6/1200",
    easy: "2/400",
    medium: "3/400",
    hard: "1/400",
  },
  problems: [
    { title: "Reverse Linked List", topic: "Linked List", difficulty: "Medium" },
    { title: "Matrix Spiral Walk", topic: "Matrix", difficulty: "Easy" },
    { title: "Alien Dictionary", topic: "Graph", difficulty: "Hard" },
  ],
};

export const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",        path: "/"              },
  { icon: User,            label: "About Me",         path: "/about"         },
  { icon: FolderOpen,      label: "Projects",         path: "/projects"      },
  { icon: Zap,             label: "Skills",           path: "/skills"        },
  { icon: Trophy,          label: "Achievements",     path: "/achievements"  },
  { icon: BarChart3,       label: "Stats",            path: "/stats"         },
  { icon: Award,           label: "Certifications",   path: "/certifications"},
  { icon: FileText,        label: "Blog",             path: "/blog"          },
  { icon: BookOpen,        label: "Learning Journey", path: "/learning"      },
  { icon: FileUser,        label: "Resume",           path: "/resume"        },
  { icon: Mail,            label: "Contact",          path: "/contact"       },
  { icon: Sparkles,        label: "Ask About Me",     path: "/ask",  highlight: true },
];
