import Link from "next/link";

const proofPoints = [
  {
    label: "100-point fit score",
    detail: "A quick read on fit, risk, location, and seniority."
  },
  {
    label: "Work auth signal scan",
    detail: "Flags buried sponsorship language before you waste an application."
  },
  {
    label: "Recruiter-ready outreach",
    detail: "Copy a clean message when the posting is unclear."
  }
];

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/92 p-6 shadow-soft sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-r from-teal-100/70 via-transparent to-blue-100/70" />
      <div className="pointer-events-none absolute -right-16 top-12 h-52 w-52 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-teal-200/40 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.04fr_0.96fr] lg:items-start">
        <div>
          <div className="eyebrow">
            A 30-second application decision tool for international students
          </div>
          <p className="mt-6 text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
            Built for CPT, OPT, STEM OPT, and future sponsorship questions
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-[3.25rem] leading-[0.95] text-slate-950 sm:text-[4.8rem]">
            Should you apply,
            <span className="block text-teal-800">message first,</span>
            or skip?
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            ApplyTriage helps international students scan job descriptions for work
            authorization risk, role fit, missing keywords, and recruiter outreach strategy in
            under 30 seconds.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/analyze"
              className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white shadow-[0_18px_38px_-24px_rgba(15,23,42,0.7)] transition hover:-translate-y-0.5 hover:bg-slate-900 sm:w-auto"
            >
              Analyze a Job
            </Link>
            <Link
              href="/analyze?sample=1"
              className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white/90 px-6 text-sm font-semibold text-slate-700 shadow-[0_14px_32px_-28px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
            >
              Try Sample Job
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 text-sm text-slate-500">
            <span className="inline-flex rounded-full border border-slate-200 bg-white/80 px-3 py-1.5">
              Rule-based MVP
            </span>
            <span className="inline-flex rounded-full border border-slate-200 bg-white/80 px-3 py-1.5">
              No login required
            </span>
            <span className="inline-flex rounded-full border border-slate-200 bg-white/80 px-3 py-1.5">
              Built for shortlist speed
            </span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {proofPoints.map((point) => (
              <div key={point.label} className="metric-tile rounded-[1.7rem] p-4">
                <p className="text-sm font-semibold text-slate-950">{point.label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{point.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="soft-panel-dark relative overflow-hidden rounded-[2.2rem] p-6 text-white sm:p-7">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-r from-sky-400/18 via-transparent to-teal-400/12" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  Decision preview
                </p>
                <h2 className="mt-3 font-display text-4xl leading-[0.95]">Message recruiter first</h2>
                <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
                  The fit looks strong, but the posting says “authorized to work in the U.S.”
                  and adds hybrid onsite expectations, so it deserves one clean eligibility note
                  before you apply.
                </p>
              </div>
              <div className="space-y-2">
                <div className="inline-flex rounded-full bg-sky-400/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">
                  Medium risk
                </div>
                <div className="block rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                  Decision in 30 sec
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Overall score
                </p>
                <p className="mt-3 text-4xl font-semibold">78</p>
                <p className="mt-1 text-sm text-slate-300">out of 100</p>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Skill signal
                </p>
                <p className="mt-3 text-2xl font-semibold">SQL + product metrics</p>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Best next move
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  Ask one eligibility question, then decide whether to tailor and apply.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 text-sm text-slate-300">
              <div className="flex flex-col gap-2 rounded-2xl border border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <span>Matched strengths</span>
                <span className="font-semibold text-white">SQL, metrics, dashboards</span>
              </div>
              <div className="flex flex-col gap-2 rounded-2xl border border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <span>Missing keywords</span>
                <span className="font-semibold text-white">Experimentation, launch</span>
              </div>
              <div className="flex flex-col gap-2 rounded-2xl border border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <span>Decision output</span>
                <span className="font-semibold text-white">Paste job. Get decision. Move on.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
