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

export type ConfidenceLevel = "Low" | "Medium" | "High";

export type RecommendedAction =
  | "APPLY NOW"
  | "MESSAGE RECRUITER FIRST"
  | "APPLY WITH REFERRAL"
  | "SKIP";

export type ApplicationStage =
  | "Saved"
  | "Outreach needed"
  | "Messaged"
  | "Applied"
  | "Interviewing"
  | "Offer"
  | "Rejected"
  | "Archived";

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
  snippet?: string;
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

export interface EvidenceSnippet {
  label: string;
  phrase: string;
  snippet: string;
  category: SignalCategory | "skill" | "seniority" | "location" | "role";
}

export interface AnalysisResult {
  recommendedAction: RecommendedAction;
  explanation: string;
  overallScore: number;
  fitScore: number;
  analysisConfidence: ConfidenceLevel;
  confidenceReasons: string[];
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
  evidenceSnippets: EvidenceSnippet[];
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
  applicationStage: ApplicationStage;
  overallScore: number;
  workAuthorizationRisk: RiskLevel;
  skillMatch: number;
  analysisConfidence: ConfidenceLevel;
  confidenceReasons: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  evidenceSnippets: EvidenceSnippet[];
  recruiterMessage: string;
  originalJobDescription: string;
  roleType: RoleType;
  background?: string;
  sourceUrl?: string;
  notes?: string;
  nextStep?: string;
  followUpDate?: string;
  explanation: string;
  scoreBreakdown: ScoreBreakdown;
  signals: SignalBuckets;
  seniorityRisk: Exclude<RiskLevel, "Critical">;
  locationRisk: Exclude<RiskLevel, "Critical">;
  updatedAt: string;
}
