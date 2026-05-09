"use client";

import { useState } from "react";

import { CopyButton } from "@/components/CopyButton";
import { APPLICATION_STAGE_OPTIONS } from "@/lib/constants";
import { formatDate, getActionStyles, getRiskStyles } from "@/lib/presentation";
import { ApplicationStage, RecommendedAction, SavedJob } from "@/types";

interface SavedJobCardProps {
  job: SavedJob;
  onDelete: (id: string) => void;
  onUpdate: (id: string, patch: Partial<SavedJob>) => void;
}

const ACTION_ACCENTS: Record<RecommendedAction, string> = {
  "APPLY NOW": "from-emerald-200/70 via-teal-100/40 to-transparent",
  "MESSAGE RECRUITER FIRST": "from-sky-200/70 via-blue-100/40 to-transparent",
  "APPLY WITH REFERRAL": "from-violet-200/70 via-fuchsia-100/35 to-transparent",
  SKIP: "from-rose-200/70 via-orange-100/35 to-transparent"
};

export function SavedJobCard({ job, onDelete, onUpdate }: SavedJobCardProps) {
  const [expanded, setExpanded] = useState(false);
  const previewKeywords = job.matchedKeywords.slice(0, 4);
  const previewGaps = job.missingKeywords.slice(0, 3);

  return (
    <article className="relative overflow-hidden rounded-[2.2rem] border border-slate-200 bg-white/94 p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-[0_26px_60px_-34px_rgba(15,23,42,0.2)]">
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-r ${ACTION_ACCENTS[job.recommendedAction]}`}
      />
      <div className="relative">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Saved {formatDate(job.date)}
              </span>
              <span className="inline-flex rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {job.roleType}
              </span>
              <span className="inline-flex rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {job.applicationStage}
              </span>
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              {job.companyName || "Company not provided"}
            </p>
            <h2 className="mt-2 font-display text-3xl leading-tight text-slate-950">
              {job.jobTitle || "Untitled role"}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {job.explanation}
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              {job.location || "Location not provided"}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <span
              className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ring-1 ${getActionStyles(
                job.recommendedAction
              )}`}
            >
              {job.recommendedAction}
            </span>
            <span
              className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ring-1 ${getRiskStyles(
                job.workAuthorizationRisk
              )}`}
            >
              {job.workAuthorizationRisk} auth risk
            </span>
            <span
              className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ring-1 ${getRiskStyles(
                job.analysisConfidence
              )}`}
            >
              {job.analysisConfidence} confidence
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="metric-tile rounded-[1.55rem] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Score</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{job.overallScore}</p>
          </div>
          <div className="metric-tile rounded-[1.55rem] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Skill match</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{job.skillMatch}</p>
          </div>
          <div className="metric-tile rounded-[1.55rem] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">{job.selectedStatus}</p>
          </div>
          <div className="metric-tile rounded-[1.55rem] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Role track</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">{job.roleType}</p>
          </div>
          <div className="metric-tile rounded-[1.55rem] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Next stage</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">{job.applicationStage}</p>
          </div>
        </div>

        {previewKeywords.length ? (
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            <div className="rounded-[1.45rem] border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Top match signals
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {previewKeywords.map((keyword) => (
                  <span
                    key={`${job.id}-preview-${keyword}`}
                    className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[1.45rem] border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Resume gaps to review
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {previewGaps.length ? (
                  previewGaps.map((keyword) => (
                    <span
                      key={`${job.id}-gap-${keyword}`}
                      className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                    >
                      {keyword}
                    </span>
                  ))
                ) : (
                  <span className="text-sm leading-7 text-slate-500">
                    No major resume keyword gaps were stored for this role.
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            aria-expanded={expanded}
            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
          >
            {expanded ? "Hide details" : "View details"}
          </button>
          <label className="sr-only" htmlFor={`stage-${job.id}`}>
            Application stage
          </label>
          <select
            id={`stage-${job.id}`}
            value={job.applicationStage}
            onChange={(event) =>
              onUpdate(job.id, { applicationStage: event.target.value as ApplicationStage })
            }
            className="h-11 w-full rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition hover:border-slate-300 hover:bg-slate-50 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            aria-label="Application stage"
          >
            {APPLICATION_STAGE_OPTIONS.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
          <CopyButton
            text={job.recruiterMessage}
            label="Copy recruiter message"
            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
          />
          <button
            type="button"
            onClick={() => onDelete(job.id)}
            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-50"
          >
            Delete
          </button>
        </div>

        {expanded ? (
          <div className="mt-6 border-t border-slate-200/80 pt-6">
            <div className="grid gap-5">
              <div className="grid gap-5 lg:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Next step
                  <input
                    value={job.nextStep ?? ""}
                    onChange={(event) => onUpdate(job.id, { nextStep: event.target.value })}
                    className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                    placeholder="Send recruiter note, tailor resume, follow up..."
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Follow-up date
                  <input
                    type="date"
                    value={job.followUpDate ?? ""}
                    onChange={(event) => onUpdate(job.id, { followUpDate: event.target.value })}
                    className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                  />
                </label>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Job URL
                  <input
                    value={job.sourceUrl ?? ""}
                    onChange={(event) => onUpdate(job.id, { sourceUrl: event.target.value })}
                    className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                    placeholder="https://..."
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Notes
                  <textarea
                    value={job.notes ?? ""}
                    onChange={(event) => onUpdate(job.id, { notes: event.target.value })}
                    className="min-h-[96px] rounded-3xl border border-slate-200 bg-white px-4 py-4 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                    placeholder="Recruiter name, referral target, application notes..."
                  />
                </label>
              </div>

              <div className="metric-tile rounded-[1.8rem] p-5">
                <p className="text-sm font-semibold text-slate-950">Explanation</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{job.explanation}</p>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <div className="metric-tile rounded-[1.8rem] p-5">
                  <p className="text-sm font-semibold text-slate-950">Matched keywords</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.matchedKeywords.length ? (
                      job.matchedKeywords.map((keyword) => (
                        <span
                          key={`${job.id}-${keyword}`}
                          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                        >
                          {keyword}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">No matched keywords stored.</span>
                    )}
                  </div>
                </div>

                <div className="metric-tile rounded-[1.8rem] p-5">
                  <p className="text-sm font-semibold text-slate-950">Missing keywords</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.missingKeywords.length ? (
                      job.missingKeywords.map((keyword) => (
                        <span
                          key={`${job.id}-missing-${keyword}`}
                          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                        >
                          {keyword}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">No missing keyword suggestions stored.</span>
                    )}
                  </div>
                </div>
              </div>

              {job.evidenceSnippets.length ? (
                <div className="metric-tile rounded-[1.8rem] p-5">
                  <p className="text-sm font-semibold text-slate-950">Evidence snippets</p>
                  <div className="mt-4 grid gap-3">
                    {job.evidenceSnippets.slice(0, 5).map((evidence) => (
                      <div
                        key={`${job.id}-${evidence.category}-${evidence.phrase}-${evidence.snippet}`}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          {evidence.label}: {evidence.phrase}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          {evidence.snippet}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="metric-tile rounded-[1.8rem] p-5">
                <p className="text-sm font-semibold text-slate-950">Original job description</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {job.originalJobDescription}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
