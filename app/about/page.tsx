import { Disclaimer } from "@/components/Disclaimer";

const nextIdeas = [
  "Browser extension for LinkedIn, Handshake, Indeed, and company career pages",
  "Company sponsorship history database",
  "Resume upload and comparison",
  "Recruiter response tracker",
  "Application analytics dashboard",
  "School career center version"
];

const steps = [
  "Paste a job description",
  "Select your work authorization status",
  "Get a clear application recommendation",
  "Copy recruiter outreach or resume keywords",
  "Save viable roles to your shortlist"
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-soft sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">
          About ApplyTriage
        </p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-slate-950 sm:text-5xl">
          Why ApplyTriage exists
        </h1>
        <p className="mt-6 text-base leading-8 text-slate-600">
          Most job platforms help students find more jobs. ApplyTriage helps students decide
          which jobs are worth their limited time. International students often face unclear work
          authorization language, especially around OPT, STEM OPT, CPT, and future sponsorship.
          ApplyTriage scans job descriptions for risk signals, skill alignment, and outreach
          strategy so students can make a faster decision: apply, message first, apply with
          referral, or skip.
        </p>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-soft sm:p-10">
          <h2 className="font-display text-3xl">How it works</h2>
          <ol className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-soft sm:p-10">
          <h2 className="font-display text-3xl text-slate-950">What I would build next</h2>
          <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
            {nextIdeas.map((idea) => (
              <li
                key={idea}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                {idea}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mt-10">
        <Disclaimer compact>
          ApplyTriage is not legal or immigration advice. It helps identify potential risk
          signals in job descriptions so students can make more informed application decisions.
        </Disclaimer>
      </div>
    </div>
  );
}
