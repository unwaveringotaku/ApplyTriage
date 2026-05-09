import { AnalysisResult, ApplicationStage, JobInput, RecommendedAction, SavedJob } from "@/types";

const STORAGE_KEY = "apply-triage-saved-jobs";
const STORAGE_EVENT = "apply-triage-storage";
const STORAGE_VERSION = 2;
const MAX_SAVED_JOBS = 100;

type SavedJobUpdate = Partial<
  Pick<SavedJob, "applicationStage" | "notes" | "nextStep" | "followUpDate" | "sourceUrl">
>;

interface SavedJobsExport {
  product: "ApplyTriage";
  version: number;
  exportedAt: string;
  jobs: SavedJob[];
}

function isBrowser() {
  return typeof window !== "undefined";
}

function createLocalId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `job-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function makeJobKey(job: Pick<SavedJob, "jobTitle" | "companyName" | "originalJobDescription">) {
  return [job.jobTitle, job.companyName, job.originalJobDescription].map(normalize).join("::");
}

function emitStorageUpdate() {
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

function persistJobs(jobs: SavedJob[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs.slice(0, MAX_SAVED_JOBS)));
  emitStorageUpdate();
}

function getDefaultStage(action: RecommendedAction): ApplicationStage {
  switch (action) {
    case "MESSAGE RECRUITER FIRST":
      return "Outreach needed";
    case "SKIP":
      return "Archived";
    case "APPLY NOW":
    case "APPLY WITH REFERRAL":
      return "Saved";
  }
}

function getDefaultNextStep(action: RecommendedAction) {
  switch (action) {
    case "APPLY NOW":
      return "Tailor the resume and submit the application.";
    case "MESSAGE RECRUITER FIRST":
      return "Send the recruiter eligibility note before applying.";
    case "APPLY WITH REFERRAL":
      return "Find a referral or warm intro before investing in a full application.";
    case "SKIP":
      return "Archive unless new eligibility information changes the decision.";
  }
}

function migrateSavedJob(job: SavedJob): SavedJob {
  const now = new Date().toISOString();

  return {
    ...job,
    applicationStage: job.applicationStage ?? getDefaultStage(job.recommendedAction),
    analysisConfidence: job.analysisConfidence ?? "Medium",
    confidenceReasons: job.confidenceReasons ?? [
      "This saved analysis was migrated from an earlier local data format."
    ],
    evidenceSnippets: job.evidenceSnippets ?? [],
    nextStep: job.nextStep ?? getDefaultNextStep(job.recommendedAction),
    updatedAt: job.updatedAt ?? job.date ?? now
  };
}

export function getSavedJobs(): SavedJob[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as SavedJob[];
    return Array.isArray(parsed)
      ? parsed
          .map(migrateSavedJob)
          .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      : [];
  } catch {
    return [];
  }
}

export function subscribeToSavedJobs(callback: () => void) {
  if (!isBrowser()) {
    return () => undefined;
  }

  window.addEventListener(STORAGE_EVENT, callback);

  return () => window.removeEventListener(STORAGE_EVENT, callback);
}

export function saveJob(input: JobInput, result: AnalysisResult) {
  if (!isBrowser()) {
    return;
  }

  const now = new Date().toISOString();
  const nextJob: SavedJob = {
    id: createLocalId(),
    date: now,
    jobTitle: input.jobTitle,
    companyName: input.companyName,
    location: input.location,
    selectedStatus: input.workAuthorizationStatus,
    recommendedAction: result.recommendedAction,
    applicationStage: getDefaultStage(result.recommendedAction),
    overallScore: result.overallScore,
    workAuthorizationRisk: result.workAuthorizationRisk,
    skillMatch: result.skillMatchScore,
    analysisConfidence: result.analysisConfidence,
    confidenceReasons: result.confidenceReasons,
    matchedKeywords: result.matchedKeywords,
    missingKeywords: result.missingKeywords,
    evidenceSnippets: result.evidenceSnippets,
    recruiterMessage: result.outreachMessages.recruiterEmailBody,
    originalJobDescription: input.jobDescription,
    roleType: input.roleType,
    background: input.background,
    nextStep: getDefaultNextStep(result.recommendedAction),
    explanation: result.explanation,
    scoreBreakdown: result.scoreBreakdown,
    signals: result.signals,
    seniorityRisk: result.seniorityRisk,
    locationRisk: result.locationRisk,
    updatedAt: now
  };

  const existing = getSavedJobs();
  const nextKey = makeJobKey(nextJob);
  const deduped = existing.filter((job) => makeJobKey(job) !== nextKey);
  persistJobs([nextJob, ...deduped]);
}

export function deleteSavedJob(id: string) {
  if (!isBrowser()) {
    return;
  }

  const next = getSavedJobs().filter((job) => job.id !== id);
  persistJobs(next);
}

export function updateSavedJob(id: string, patch: SavedJobUpdate) {
  if (!isBrowser()) {
    return;
  }

  const next = getSavedJobs().map((job) =>
    job.id === id
      ? {
          ...job,
          ...patch,
          updatedAt: new Date().toISOString()
        }
      : job
  );

  persistJobs(next);
}

export function exportSavedJobs() {
  const payload: SavedJobsExport = {
    product: "ApplyTriage",
    version: STORAGE_VERSION,
    exportedAt: new Date().toISOString(),
    jobs: getSavedJobs()
  };

  return JSON.stringify(payload, null, 2);
}

export function importSavedJobs(serializedJobs: string) {
  if (!isBrowser()) {
    return { imported: 0, skipped: 0, total: 0 };
  }

  const parsed = JSON.parse(serializedJobs) as SavedJobsExport | SavedJob[];
  const incomingJobs = Array.isArray(parsed) ? parsed : parsed.jobs;

  if (!Array.isArray(incomingJobs)) {
    throw new Error("Import file does not contain saved jobs.");
  }

  const existing = getSavedJobs();
  const existingKeys = new Set(existing.map(makeJobKey));
  const imported: SavedJob[] = [];
  let skipped = 0;

  incomingJobs.forEach((job) => {
    const migratedJob = migrateSavedJob(job);
    const key = makeJobKey(migratedJob);

    if (existingKeys.has(key)) {
      skipped += 1;
      return;
    }

    existingKeys.add(key);
    imported.push({
      ...migratedJob,
      id: migratedJob.id || createLocalId(),
      updatedAt: new Date().toISOString()
    });
  });

  persistJobs([...imported, ...existing]);

  return {
    imported: imported.length,
    skipped,
    total: incomingJobs.length
  };
}
