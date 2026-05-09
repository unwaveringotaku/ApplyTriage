"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { Disclaimer } from "@/components/Disclaimer";
import { SavedJobCard } from "@/components/saved/SavedJobCard";
import { APPLICATION_STAGE_OPTIONS } from "@/lib/constants";
import {
  deleteSavedJob,
  exportSavedJobs,
  getSavedJobs,
  importSavedJobs,
  subscribeToSavedJobs,
  updateSavedJob
} from "@/lib/storage";
import { ApplicationStage, SavedJob } from "@/types";

export function SavedJobsClient() {
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const [jobs, setJobs] = useState<SavedJob[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [stageFilter, setStageFilter] = useState<ApplicationStage | "All">("All");
  const [importExportMessage, setImportExportMessage] = useState("");
  const savedCountLabel = hydrated ? `${jobs.length}` : "—";
  const filteredJobs =
    stageFilter === "All" ? jobs : jobs.filter((job) => job.applicationStage === stageFilter);
  const followUpCount = jobs.filter((job) => job.followUpDate).length;

  useEffect(() => {
    function loadJobs() {
      setJobs(getSavedJobs());
      setHydrated(true);
    }

    loadJobs();
    window.addEventListener("storage", loadJobs);
    const unsubscribe = subscribeToSavedJobs(loadJobs);

    return () => {
      window.removeEventListener("storage", loadJobs);
      unsubscribe();
    };
  }, []);

  function handleDelete(id: string) {
    deleteSavedJob(id);
    setJobs((current) => current.filter((job) => job.id !== id));
  }

  function handleUpdate(id: string, patch: Partial<SavedJob>) {
    updateSavedJob(id, patch);
    setJobs(getSavedJobs());
  }

  function handleExport() {
    const blob = new Blob([exportSavedJobs()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `apply-triage-saved-jobs-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setImportExportMessage("Saved jobs exported.");
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const result = importSavedJobs(await file.text());
      setJobs(getSavedJobs());
      setImportExportMessage(
        `Imported ${result.imported} saved jobs. Skipped ${result.skipped} duplicates.`
      );
    } catch {
      setImportExportMessage("Import failed. Use a valid ApplyTriage export file.");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[2.2rem] border border-slate-200 bg-white/92 p-8 shadow-soft sm:p-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-teal-100/70 via-transparent to-blue-100/70" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="eyebrow">Saved jobs</div>
            <h1 className="mt-3 font-display text-4xl leading-tight text-slate-950 sm:text-5xl">
              Your shortlist stays local and easy to revisit.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              Saved analyses now include stages, notes, next steps, follow-up dates, and portable
              exports while keeping the finalist demo lightweight and account-free.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={handleExport}
                disabled={!hydrated || jobs.length === 0}
                className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_18px_34px_-24px_rgba(15,23,42,0.62)] transition hover:-translate-y-0.5 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Export data
              </button>
              <button
                type="button"
                onClick={() => importInputRef.current?.click()}
                className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
              >
                Import data
              </button>
              <input
                ref={importInputRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={handleImport}
                aria-label="Import saved jobs JSON"
              />
            </div>
            {importExportMessage ? (
              <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {importExportMessage}
              </p>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="metric-tile min-w-[11rem] rounded-[1.7rem] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Saved analyses
              </p>
              <p className="mt-3 text-4xl font-semibold text-slate-950">{savedCountLabel}</p>
            </div>
            <div className="metric-tile min-w-[11rem] rounded-[1.7rem] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Follow-ups
              </p>
              <p className="mt-3 text-4xl font-semibold text-slate-950">
                {hydrated ? followUpCount : "—"}
              </p>
            </div>
            <div className="metric-tile min-w-[11rem] rounded-[1.7rem] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Storage
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-950">Local only</p>
              <p className="mt-2 text-sm text-slate-600">Export-ready and account-free.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6">
        <Disclaimer tone="neutral" compact>
          ApplyTriage is not legal or immigration advice. Always verify work authorization
          requirements directly with employers or qualified advisors.
        </Disclaimer>
      </div>

      {hydrated && jobs.length > 0 ? (
        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white/90 p-4 shadow-soft">
          <div className="flex gap-2 overflow-x-auto rounded-full border border-slate-200/80 bg-slate-50/90 p-1">
            {(["All", ...APPLICATION_STAGE_OPTIONS] as const).map((stage) => {
              const isActive = stageFilter === stage;

              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setStageFilter(stage)}
                  className={`inline-flex h-10 items-center justify-center whitespace-nowrap rounded-full px-4 text-sm font-semibold transition ${
                    isActive
                      ? "bg-slate-950 text-white shadow-[0_16px_28px_-22px_rgba(15,23,42,0.72)]"
                      : "text-slate-600 hover:bg-white hover:text-slate-950"
                  }`}
                >
                  {stage}
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="mt-8 grid gap-6">
        {hydrated && jobs.length === 0 ? (
          <div className="relative overflow-hidden rounded-[2.2rem] border border-dashed border-slate-300 bg-white/86 p-10 text-center shadow-soft">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-teal-100/60 via-transparent to-blue-100/60" />
            <div className="relative">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.75rem] bg-slate-950 text-lg font-semibold tracking-[0.2em] text-white">
              AT
            </div>
            <h2 className="mt-6 font-display text-3xl text-slate-950">No saved jobs yet.</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Analyze a few roles and the strongest ones will stay here as your application
              shortlist.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/analyze"
                className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_18px_34px_-24px_rgba(15,23,42,0.62)] transition hover:-translate-y-0.5 hover:bg-slate-900"
              >
                Analyze a Job
              </Link>
              <Link
                href="/analyze?sample=1"
                className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
              >
                Try Sample Job
              </Link>
            </div>
            </div>
          </div>
        ) : hydrated && filteredJobs.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/86 p-8 text-center shadow-soft">
            <h2 className="font-display text-3xl text-slate-950">No jobs in this stage yet.</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Move saved roles through the pipeline as you message, apply, and follow up.
            </p>
          </div>
        ) : hydrated ? (
          filteredJobs.map((job) => (
            <SavedJobCard
              key={job.id}
              job={job}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))
        ) : (
          <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-soft">
            <div className="h-4 w-40 animate-pulse rounded-full bg-slate-200" />
            <div className="mt-4 h-32 animate-pulse rounded-3xl bg-slate-100" />
          </div>
        )}
      </section>
    </div>
  );
}
