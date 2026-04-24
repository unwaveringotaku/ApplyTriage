import { AnalysisResult, JobInput, SavedJob } from "@/types";

const STORAGE_KEY = "apply-triage-saved-jobs";
const STORAGE_EVENT = "apply-triage-storage";

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
      ? parsed.sort((left, right) => right.date.localeCompare(left.date))
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

  const nextJob: SavedJob = {
    id: createLocalId(),
    date: new Date().toISOString(),
    jobTitle: input.jobTitle,
    companyName: input.companyName,
    location: input.location,
    selectedStatus: input.workAuthorizationStatus,
    recommendedAction: result.recommendedAction,
    overallScore: result.overallScore,
    workAuthorizationRisk: result.workAuthorizationRisk,
    skillMatch: result.skillMatchScore,
    matchedKeywords: result.matchedKeywords,
    missingKeywords: result.missingKeywords,
    recruiterMessage: result.outreachMessages.recruiterEmailBody,
    originalJobDescription: input.jobDescription,
    roleType: input.roleType,
    background: input.background,
    explanation: result.explanation,
    scoreBreakdown: result.scoreBreakdown,
    signals: result.signals,
    seniorityRisk: result.seniorityRisk,
    locationRisk: result.locationRisk
  };

  const existing = getSavedJobs();
  const nextKey = makeJobKey(nextJob);
  const deduped = existing.filter((job) => makeJobKey(job) !== nextKey);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([nextJob, ...deduped].slice(0, 50)));
  emitStorageUpdate();
}

export function deleteSavedJob(id: string) {
  if (!isBrowser()) {
    return;
  }

  const next = getSavedJobs().filter((job) => job.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  emitStorageUpdate();
}
