import { RoleType, WorkAuthorizationStatus } from "@/types";

export const WORK_AUTH_OPTIONS: WorkAuthorizationStatus[] = [
  "CPT",
  "OPT",
  "STEM OPT",
  "Needs sponsorship now",
  "Will need sponsorship in the future",
  "Citizen / permanent resident / no sponsorship needed"
];

export const ROLE_OPTIONS: RoleType[] = [
  "Product Management",
  "Business Analyst",
  "Data Analyst",
  "UX Research",
  "Strategy / Consulting",
  "Operations",
  "Marketing",
  "Software / Technical",
  "General"
];

export const SAMPLE_JOB = {
  jobTitle: "Product Analyst",
  companyName: "Northstar Commerce",
  location: "New York, NY (Hybrid)",
  roleType: "Product Management" as RoleType,
  workAuthorizationStatus: "STEM OPT" as WorkAuthorizationStatus,
  background:
    "MS Strategic Design and Management student, ex-Accenture, product strategy, dashboarding, stakeholder communication, SQL basics, UX research collaboration.",
  jobDescription: `Northstar Commerce is hiring a Product Analyst to support product analytics, experimentation, and roadmap planning for our consumer growth team.

In this role you will partner with product managers, engineers, designers, and business stakeholders to define KPIs, analyze feature performance, build dashboards, and turn customer insights into recommendations. You will help translate business questions into analysis plans, support experimentation design, and contribute to product launches.

Preferred qualifications include experience with SQL, dashboarding, product metrics, A/B testing, stakeholder communication, and cross-functional collaboration. Exposure to user research and agile product development is a plus.

This role is based in New York and follows a hybrid schedule with 3 days onsite each week. Candidates must be authorized to work in the U.S. at the time of application.`
};

export const WORK_AUTH_PHRASES = {
  critical: [
    "no sponsorship",
    "will not sponsor",
    "does not sponsor",
    "no visa sponsorship",
    "without sponsorship now or in the future",
    "must not require sponsorship",
    "must be authorized to work permanently",
    "permanent work authorization",
    "u.s. citizen",
    "us citizen",
    "green card",
    "security clearance required",
    "clearance required",
    "must be a u.s. person"
  ],
  high: [
    "sponsorship is not available",
    "cannot sponsor",
    "unable to sponsor",
    "must be eligible to work in the united states without employer sponsorship",
    "must have unrestricted work authorization",
    "not eligible for opt",
    "not eligible for cpt"
  ],
  medium: [
    "authorized to work in the united states",
    "authorized to work in the u.s.",
    "work authorization required",
    "must be legally authorized",
    "must be eligible to work",
    "hybrid",
    "onsite",
    "relocation required",
    "contract",
    "temporary"
  ],
  positive: [
    "opt",
    "stem opt",
    "cpt",
    "h-1b",
    "h1b",
    "sponsorship available",
    "visa sponsorship available",
    "international students",
    "students on opt",
    "students on cpt",
    "we sponsor",
    "open to sponsorship"
  ]
} as const;

export const KEYWORD_GROUPS: Record<RoleType | "AI/ML", string[]> = {
  "Product Management": [
    "product",
    "roadmap",
    "user research",
    "customer discovery",
    "backlog",
    "agile",
    "sprint",
    "product requirements",
    "prd",
    "metrics",
    "experimentation",
    "a/b testing",
    "launch",
    "stakeholder",
    "cross-functional",
    "feature",
    "user stories"
  ],
  "Business Analyst": [
    "business analysis",
    "requirements",
    "process improvement",
    "stakeholder",
    "reporting",
    "dashboard",
    "documentation",
    "workflow",
    "operations",
    "kpi",
    "sql",
    "excel",
    "tableau",
    "power bi",
    "data analysis"
  ],
  "Data Analyst": [
    "sql",
    "python",
    "r",
    "tableau",
    "power bi",
    "dashboard",
    "analytics",
    "statistical",
    "data visualization",
    "data cleaning",
    "data modeling",
    "metrics",
    "reporting",
    "experimentation"
  ],
  "UX Research": [
    "user interviews",
    "usability testing",
    "user research",
    "qualitative research",
    "survey",
    "synthesis",
    "personas",
    "journey mapping",
    "insights",
    "prototype testing",
    "design research",
    "figma"
  ],
  "Strategy / Consulting": [
    "strategy",
    "market research",
    "competitive analysis",
    "business model",
    "stakeholder",
    "transformation",
    "operating model",
    "growth",
    "go-to-market",
    "consulting",
    "client",
    "presentation",
    "executive",
    "recommendations"
  ],
  Operations: [
    "operations",
    "process",
    "workflow",
    "quality",
    "compliance",
    "vendor",
    "logistics",
    "coordination",
    "project management",
    "efficiency",
    "sla",
    "performance",
    "documentation"
  ],
  Marketing: [
    "campaign",
    "content",
    "social media",
    "brand",
    "audience",
    "seo",
    "email marketing",
    "analytics",
    "positioning",
    "copywriting",
    "market research",
    "engagement"
  ],
  "Software / Technical": [
    "javascript",
    "typescript",
    "react",
    "next.js",
    "node",
    "api",
    "backend",
    "frontend",
    "database",
    "cloud",
    "aws",
    "git",
    "testing",
    "deployment"
  ],
  General: [
    "analysis",
    "communication",
    "collaboration",
    "project management",
    "stakeholder",
    "execution",
    "strategy",
    "reporting",
    "documentation",
    "problem solving"
  ],
  "AI/ML": [
    "ai",
    "artificial intelligence",
    "machine learning",
    "ml",
    "model",
    "data pipeline",
    "automation",
    "prompt",
    "llm",
    "generative ai",
    "training data",
    "evaluation",
    "quality assurance"
  ]
};

export const ROLE_TITLE_HINTS: Record<RoleType, string[]> = {
  "Product Management": ["product manager", "product analyst", "product"],
  "Business Analyst": ["business analyst", "analyst", "business systems"],
  "Data Analyst": ["data analyst", "analytics", "business intelligence"],
  "UX Research": ["ux researcher", "user researcher", "design researcher"],
  "Strategy / Consulting": ["strategy", "consulting", "business strategy"],
  Operations: ["operations", "program", "business operations"],
  Marketing: ["marketing", "growth", "brand"],
  "Software / Technical": ["software", "engineer", "developer", "technical"],
  General: ["associate", "analyst", "coordinator", "specialist"]
};

export const ENTRY_LEVEL_PHRASES = [
  "intern",
  "internship",
  "associate",
  "junior",
  "entry level",
  "new grad",
  "recent graduate",
  "0-2 years",
  "1-2 years",
  "early career"
];

export const HIGH_SENIORITY_PHRASES = [
  "senior",
  "lead",
  "principal",
  "manager",
  "director",
  "head of",
  "5+ years",
  "7+ years",
  "10+ years",
  "executive"
];

export const LOCATION_RISK_PHRASES = {
  high: ["must relocate", "onsite required", "5 days onsite", "security clearance"],
  medium: ["hybrid", "onsite", "relocation"],
  low: ["remote", "flexible", "hybrid flexible"]
};

export const WORK_AUTH_EXPLANATIONS: Record<WorkAuthorizationStatus, string> = {
  CPT: "I am currently eligible for CPT through my university, subject to school authorization and role alignment.",
  OPT: "I am eligible to work in the U.S. under post-completion OPT and would not require immediate employer sponsorship.",
  "STEM OPT":
    "I am eligible for STEM OPT and would not require immediate employer sponsorship. I may need employer sponsorship in the future depending on long-term employment timing.",
  "Needs sponsorship now":
    "I would require employer sponsorship to work in the U.S.",
  "Will need sponsorship in the future":
    "I do not require immediate sponsorship, but may require employer sponsorship in the future.",
  "Citizen / permanent resident / no sponsorship needed":
    "I do not require employer sponsorship for work authorization."
};

export const ROLE_BACKGROUND_LINES: Record<RoleType, string> = {
  "Product Management":
    "experience across product thinking, cross-functional collaboration, and turning insights into decisions",
  "Business Analyst":
    "experience in structured analysis, requirements gathering, and operational reporting",
  "Data Analyst":
    "experience working with analytics, dashboards, and data-driven decision making",
  "UX Research":
    "experience synthesizing user insights and shaping product decisions through research",
  "Strategy / Consulting":
    "experience with structured problem solving, research, and executive-ready recommendations",
  Operations:
    "experience improving workflows, coordination, and day-to-day execution across teams",
  Marketing:
    "experience in audience insight, campaign thinking, and performance analysis",
  "Software / Technical":
    "experience building technical solutions and collaborating across product and engineering",
  General:
    "experience that combines analysis, communication, and project ownership"
};
