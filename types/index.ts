export type WorkAuthorizationStatus =
  | "CPT"
  | "OPT"
  | "STEM OPT"
  | "Needs sponsorship now"
  | "Will need sponsorship in the future"
  | "Citizen / permanent resident / no sponsorship needed";

export type RoleType =
  | "Product Management"
  | "Business Analyst"
  | "Data Analyst"
  | "UX Research"
  | "Strategy / Consulting"
  | "Operations"
  | "Marketing"
  | "Software / Technical"
  | "General";

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type RecommendedAction =
  | "APPLY NOW"
  | "MESSAGE RECRUITER FIRST"
  | "APPLY WITH REFERRAL"
  | "SKIP";

export type SignalCategory = "critical" | "high" | "medium" | "positive";

export interface JobInput {
  jobTitle: string;
  companyName: string;
  location: string;
  jobDescription: string;
  workAuthorizationStatus: WorkAuthorizationStatus;
  roleType: RoleType;
  background?: string;
}

export interface ScoreBreakdown {
  skillMatch: number;
  workAuthorizationCompatibility: number;
  seniorityMatch: number;
  locationMatch: number;
  roleMatch: number;
  overall: number;
}

export interface WorkAuthSignal {
  phrase: string;
  category: SignalCategory;
}

export interface SignalBuckets {
  critical: WorkAuthSignal[];
  high: WorkAuthSignal[];
  medium: WorkAuthSignal[];
  positive: WorkAuthSignal[];
}

export interface OutreachMessages {
  linkedinNote: string;
  recruiterEmailSubject: string;
  recruiterEmailBody: string;
  workAuthorizationParagraph: string;
  followUpMessage: string;
}

export interface AnalysisResult {
  recommendedAction: RecommendedAction;
  explanation: string;
  overallScore: number;
  fitScore: number;
  workAuthorizationRisk: RiskLevel;
  skillMatchScore: number;
  seniorityRisk: Exclude<RiskLevel, "Critical">;
  seniorityScore: number;
  locationRisk: Exclude<RiskLevel, "Critical">;
  locationScore: number;
  roleMatchScore: number;
  workAuthorizationCompatibilityScore: number;
  scoreBreakdown: ScoreBreakdown;
  signals: SignalBuckets;
  matchedKeywords: string[];
  missingKeywords: string[];
  backgroundAlignedKeywords: string[];
  resumeKeywordSuggestions: string[];
  recommendedResumeFocus: string;
  outreachMessages: OutreachMessages;
  workAuthorizationSummary: string;
  senioritySummary: string;
  locationSummary: string;
  roleSummary: string;
}

export interface SavedJob {
  id: string;
  date: string;
  jobTitle: string;
  companyName: string;
  location: string;
  selectedStatus: WorkAuthorizationStatus;
  recommendedAction: RecommendedAction;
  overallScore: number;
  workAuthorizationRisk: RiskLevel;
  skillMatch: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  recruiterMessage: string;
  originalJobDescription: string;
  roleType: RoleType;
  background?: string;
  explanation: string;
  scoreBreakdown: ScoreBreakdown;
  signals: SignalBuckets;
  seniorityRisk: Exclude<RiskLevel, "Critical">;
  locationRisk: Exclude<RiskLevel, "Critical">;
}
