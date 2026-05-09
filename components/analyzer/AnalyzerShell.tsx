"use client";

import { useEffect, useRef, useState } from "react";

import { Disclaimer } from "@/components/Disclaimer";
import { SAMPLE_JOB } from "@/lib/constants";
import { analyzeJobDescription } from "@/lib/analysis";
import { saveJob } from "@/lib/storage";
import { AnalysisResult, JobInput } from "@/types";
import { AnalyzerForm } from "@/components/analyzer/AnalyzerForm";
import { DecisionCard } from "@/components/analyzer/DecisionCard";
import { OutreachCard } from "@/components/analyzer/OutreachCard";
import { ScoreBreakdown } from "@/components/analyzer/ScoreBreakdown";
import { SignalList } from "@/components/analyzer/SignalList";
import { SkillMatchCard } from "@/components/analyzer/SkillMatchCard";

const DEFAULT_INPUT: JobInput = {
  jobTitle: "",
  companyName: "",
  location: "",
  jobDescription: "",
  workAuthorizationStatus: "STEM OPT",
  roleType: "Product Management",
  background: ""
};

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function requestAnalysis(payload: JobInput) {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = (await response.json()) as { result?: AnalysisResult };

      if (data.result) {
        return data.result;
      }
    }
  } catch {
    // Keep the showcase resilient if the API route is unavailable in a static preview.
  }

  return analyzeJobDescription(payload);
}

export function AnalyzerShell({ autoLoadSample = false }: { autoLoadSample?: boolean }) {
  const hasAutoLoadedSample = useRef(false);
  const requestSequenceRef = useRef(0);
  const [input, setInput] = useState<JobInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [validationError, setValidationError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  function updateField<K extends keyof JobInput>(key: K, value: JobInput[K]) {
    setInput((current) => ({ ...current, [key]: value }));
    setValidationError("");
    setIsSaved(false);
  }

  async function runAnalysis(nextInput?: JobInput) {
    const payload = nextInput ?? input;

    if (payload.jobDescription.trim().length < 100) {
      setValidationError("Paste at least 100 characters from a job description for a useful analysis.");
      return;
    }

    requestSequenceRef.current += 1;
    const currentRequest = requestSequenceRef.current;
    setLoading(true);
    setValidationError("");
    setIsSaved(false);
    await sleep(600);

    if (currentRequest !== requestSequenceRef.current) {
      return;
    }

    const nextResult = await requestAnalysis(payload);
    setResult(nextResult);
    setLoading(false);
  }

  function loadSample() {
    const sampleInput: JobInput = {
      jobTitle: SAMPLE_JOB.jobTitle,
      companyName: SAMPLE_JOB.companyName,
      location: SAMPLE_JOB.location,
      jobDescription: SAMPLE_JOB.jobDescription,
      workAuthorizationStatus: SAMPLE_JOB.workAuthorizationStatus,
      roleType: SAMPLE_JOB.roleType,
      background: SAMPLE_JOB.background
    };

    setInput(sampleInput);
    setValidationError("");
    setIsSaved(false);
    void runAnalysis(sampleInput);
  }

  function clearAll() {
    requestSequenceRef.current += 1;
    setInput(DEFAULT_INPUT);
    setResult(null);
    setValidationError("");
    setLoading(false);
    setIsSaved(false);
  }

  function handleSave() {
    if (!result || isSaved) {
      return;
    }

    saveJob(input, result);
    setIsSaved(true);
  }

  useEffect(() => {
    if (autoLoadSample && !hasAutoLoadedSample.current) {
      hasAutoLoadedSample.current = true;
      loadSample();
    }
  }, [autoLoadSample]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6 xl:sticky xl:top-28 xl:self-start">
          <AnalyzerForm
            input={input}
            loading={loading}
            validationError={validationError}
            onChange={updateField}
            onAnalyze={() => void runAnalysis()}
            onSample={loadSample}
            onClear={clearAll}
          />
          <Disclaimer tone="neutral" compact>
            ApplyTriage is not legal or immigration advice. It helps identify potential risk
            signals in job descriptions so students can make more informed application decisions.
          </Disclaimer>
        </div>

        <div className="space-y-6">
          {loading ? (
            <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-soft sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">
                Analyzing
              </p>
              <h2 className="mt-2 font-display text-3xl text-slate-950">
                Scanning work authorization, fit, and resume gaps
              </h2>
              <div className="mt-6 space-y-4">
                <div className="h-4 w-48 animate-pulse rounded-full bg-slate-200" />
                <div className="h-24 animate-pulse rounded-3xl bg-slate-100" />
                <div className="h-24 animate-pulse rounded-3xl bg-slate-100" />
              </div>
            </section>
          ) : result ? (
            <>
              <DecisionCard result={result} onSave={handleSave} isSaved={isSaved} />
              <ScoreBreakdown result={result} />
              <SignalList result={result} />
              <SkillMatchCard result={result} />
              <OutreachCard result={result} />

              <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-soft sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">
                  Resume tailoring notes
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-5">
                    <p className="text-sm font-semibold text-slate-950">Work authorization</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{result.workAuthorizationSummary}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-5">
                    <p className="text-sm font-semibold text-slate-950">Seniority</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{result.senioritySummary}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-5">
                    <p className="text-sm font-semibold text-slate-950">Location</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{result.locationSummary}</p>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <section className="relative overflow-hidden rounded-[2.2rem] border border-dashed border-slate-300 bg-white/86 p-8 shadow-soft">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-teal-100/60 via-transparent to-blue-100/60" />
              <div className="relative">
                <div className="eyebrow">What you’ll see</div>
              <h2 className="mt-2 font-display text-3xl leading-tight text-slate-950 sm:text-4xl">
                One clear decision first, then the evidence behind it.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                Once you analyze a job, ApplyTriage will show the recommendation badge at the
                top, followed by score breakdown, authorization signals, matched and missing
                keywords, outreach templates, and a save-to-shortlist action.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div className="metric-tile rounded-[1.8rem] p-5">
                  <p className="text-sm font-semibold text-slate-950">Recommended actions</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Apply Now, Message Recruiter First, Apply With Referral, or Skip.
                  </p>
                </div>
                <div className="metric-tile rounded-[1.8rem] p-5">
                  <p className="text-sm font-semibold text-slate-950">What drives the result</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Work authorization language, skill match, seniority, location friction, and
                    role alignment.
                  </p>
                </div>
                <div className="metric-tile rounded-[1.8rem] p-5">
                  <p className="text-sm font-semibold text-slate-950">Start faster</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Use the sample job if you want to see the full result experience before pasting
                    your own role.
                  </p>
                </div>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={loadSample}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_18px_34px_-24px_rgba(15,23,42,0.6)] transition hover:-translate-y-0.5 hover:bg-slate-900"
                >
                  Try Sample Job
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
                >
                  Clear form
                </button>
              </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
