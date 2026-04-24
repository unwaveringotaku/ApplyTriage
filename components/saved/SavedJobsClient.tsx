"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Disclaimer } from "@/components/Disclaimer";
import { SavedJobCard } from "@/components/saved/SavedJobCard";
import { deleteSavedJob, getSavedJobs, subscribeToSavedJobs } from "@/lib/storage";
import { SavedJob } from "@/types";

export function SavedJobsClient() {
  const [jobs, setJobs] = useState<SavedJob[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const savedCountLabel = hydrated ? `${jobs.length}` : "—";

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
              Saved analyses are stored in localStorage for this MVP, so you can keep track of the
              roles worth following up on without setting up an account.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="metric-tile min-w-[11rem] rounded-[1.7rem] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Saved analyses
              </p>
              <p className="mt-3 text-4xl font-semibold text-slate-950">{savedCountLabel}</p>
            </div>
            <div className="metric-tile min-w-[11rem] rounded-[1.7rem] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Storage
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-950">Local only</p>
              <p className="mt-2 text-sm text-slate-600">No login required for the MVP.</p>
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
        ) : hydrated ? (
          jobs.map((job) => <SavedJobCard key={job.id} job={job} onDelete={handleDelete} />)
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
