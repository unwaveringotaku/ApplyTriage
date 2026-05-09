"use client";

import { ROLE_OPTIONS, WORK_AUTH_OPTIONS } from "@/lib/constants";
import { JobInput } from "@/types";

interface AnalyzerFormProps {
  input: JobInput;
  loading: boolean;
  validationError: string;
  onChange: <K extends keyof JobInput>(key: K, value: JobInput[K]) => void;
  onAnalyze: () => void;
  onSample: () => void;
  onClear: () => void;
}

export function AnalyzerForm({
  input,
  loading,
  validationError,
  onChange,
  onAnalyze,
  onSample,
  onClear
}: AnalyzerFormProps) {
  const descriptionLength = input.jobDescription.trim().length;
  const hasUsefulLength = descriptionLength >= 100;

  return (
    <section className="glass-card rounded-[2.15rem] border border-white/70 p-6 shadow-soft sm:p-8">
      <div className="flex flex-col gap-2">
        <div className="eyebrow">Analyze a role</div>
        <h1 className="mt-2 font-display text-4xl leading-tight text-slate-950">
          Paste the job description and get a decision fast.
        </h1>
        <p className="text-sm leading-7 text-slate-600">
          The first output is intentionally simple: apply, message first, apply with referral,
          or skip.
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5">
            30-second triage
          </span>
          <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5">
            Rule-based scoring
          </span>
          <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5">
            No login required
          </span>
        </div>
      </div>

      <form
        className="mt-8 grid gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          onAnalyze();
        }}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Job title
            <input
              value={input.jobTitle}
              onChange={(event) => onChange("jobTitle", event.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              placeholder="Associate Product Manager"
              aria-label="Job title"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Company name
            <input
              value={input.companyName}
              onChange={(event) => onChange("companyName", event.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              placeholder="Northstar Commerce"
              aria-label="Company name"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Location
          <input
            value={input.location}
            onChange={(event) => onChange("location", event.target.value)}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            placeholder="New York, NY (Hybrid)"
            aria-label="Location"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Job description
          <div
            id="job-description-helper"
            className="flex flex-col gap-2 rounded-[1.4rem] border border-slate-200 bg-slate-50/90 px-4 py-3 text-xs font-medium text-slate-500 sm:flex-row sm:items-center sm:justify-between"
          >
            <span>Paste at least 100 characters for a reliable triage result.</span>
            <span
              className={`inline-flex w-fit rounded-full px-3 py-1 ${
                hasUsefulLength
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {descriptionLength} chars
            </span>
          </div>
          <textarea
            value={input.jobDescription}
            onChange={(event) => onChange("jobDescription", event.target.value)}
            className="min-h-[240px] rounded-3xl border border-slate-200 bg-white px-4 py-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            placeholder="Paste the full job description here..."
            aria-label="Job description"
            aria-describedby="job-description-helper"
          />
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Work authorization status
            <select
              value={input.workAuthorizationStatus}
              onChange={(event) =>
                onChange("workAuthorizationStatus", event.target.value as JobInput["workAuthorizationStatus"])
              }
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              aria-label="Work authorization status"
            >
              {WORK_AUTH_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Target role type
            <select
              value={input.roleType}
              onChange={(event) => onChange("roleType", event.target.value as JobInput["roleType"])}
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              aria-label="Target role type"
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Your background / resume text (optional)
          <textarea
            value={input.background ?? ""}
            onChange={(event) => onChange("background", event.target.value)}
            className="min-h-[140px] rounded-3xl border border-slate-200 bg-white px-4 py-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            placeholder="Paste a short background, resume summary, or key project bullets for tighter fit scoring..."
            aria-label="Optional background or resume text"
          />
        </label>

        {validationError ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {validationError}
          </p>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.8fr)]">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 items-center justify-center rounded-full bg-teal-700 px-6 text-sm font-semibold text-white shadow-[0_18px_34px_-24px_rgba(15,118,110,0.7)] transition hover:-translate-y-0.5 hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-teal-400 disabled:shadow-none"
          >
            {loading ? "Analyzing..." : "Analyze Job"}
          </button>
          <button
            type="button"
            onClick={onSample}
            disabled={loading}
            className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Try Sample Job
          </button>
          <button
            type="button"
            onClick={onClear}
            disabled={loading}
            className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Clear
          </button>
        </div>

        <p className="text-xs leading-6 text-slate-500">
          Use the sample role if you want to preview the full experience before pasting your own
          job description.
        </p>
      </form>
    </section>
  );
}
