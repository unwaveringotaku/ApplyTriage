import Link from "next/link";

import { Disclaimer } from "@/components/Disclaimer";
import { Hero } from "@/components/Hero";

const featureCards = [
  {
    title: "Work Authorization Risk",
    description:
      "Flags phrases like “no sponsorship,” “authorized to work,” “permanent work authorization,” “OPT/CPT considered,” and “H-1B sponsorship available.”"
  },
  {
    title: "Application Decision",
    description:
      "Turns a long job description into a clear next step: Apply, Message First, Apply with Referral, or Skip."
  },
  {
    title: "Outreach Generator",
    description:
      "Creates a recruiter message that clarifies work authorization without sounding awkward or desperate."
  }
];

const whyCards = [
  {
    title: "Students waste time applying to roles that may never consider them.",
    detail: "A clearer first-pass decision means fewer applications lost to avoidable eligibility mismatches."
  },
  {
    title: "Work authorization language is often vague or buried.",
    detail: "Critical phrases are easy to miss when you are speed-reading dozens of job descriptions."
  },
  {
    title: "Better triage means fewer wasted applications and better outreach.",
    detail: "The strongest roles rise to the top faster, and the unclear ones get a better first message."
  }
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <Hero />

      <section className="mt-14 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="soft-panel-dark rounded-[2.2rem] p-8 text-white sm:p-10">
          <div className="eyebrow border-white/10 bg-white/5 text-teal-300">What you get</div>
          <h2 className="mt-6 font-display text-4xl leading-tight">
            One paste gives you the signal, the decision, and the next message.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
            ApplyTriage is built to reduce hesitation. The recommendation comes first, then the
            evidence, then the recruiter outreach you need if the role is unclear.
          </p>
          <Link
            href="/analyze"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-slate-950 shadow-[0_18px_38px_-24px_rgba(255,255,255,0.55)] transition hover:-translate-y-0.5 hover:bg-slate-100"
          >
            Start an analysis
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featureCards.map((card, index) => (
            <article
              key={card.title}
              className="glass-card hover-lift rounded-[2rem] border border-white/70 p-6 shadow-soft"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="eyebrow">Core feature</div>
                <span className="text-sm font-semibold tracking-[0.18em] text-slate-300">
                  0{index + 1}
                </span>
              </div>
              <h2 className="mt-5 font-display text-2xl leading-tight text-slate-950">
                {card.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-[2.2rem] border border-slate-200 bg-white/90 p-8 shadow-soft sm:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="eyebrow">Why this matters</div>
            <h2 className="mt-2 max-w-2xl font-display text-4xl leading-tight text-slate-950">
              Better triage means more focus on the roles that can actually move forward.
            </h2>
          </div>
          <Link
            href="/analyze"
            className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
          >
            Analyze a Job
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {whyCards.map((card, index) => (
            <div
              key={card.title}
              className="metric-tile rounded-[1.8rem] p-6"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                0{index + 1}
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-950">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{card.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="soft-panel-dark rounded-[2.2rem] p-8 text-white sm:p-10">
          <div className="eyebrow border-white/10 bg-white/5 text-teal-300">30-second workflow</div>
          <h2 className="mt-3 font-display text-4xl leading-tight">
            Built for students who need faster decisions, not more application chaos.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
            ApplyTriage makes the first answer obvious, then gives you the recruiter message,
            keyword gaps, and save-to-shortlist flow right away.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              Paste the role
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              Get the first answer
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              Save or move on
            </div>
          </div>
        </div>

        <div className="soft-panel rounded-[2.2rem] p-8 sm:p-10">
          <div className="eyebrow text-blue-700">Next step</div>
          <h2 className="mt-3 font-display text-3xl text-slate-950">
            Paste job. Get decision. Move on.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Start with a live analysis or jump into a realistic sample product role to see the
            MVP in action.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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

          <div className="mt-8">
            <Disclaimer compact tone="neutral">
              ApplyTriage is not legal or immigration advice. Always verify work authorization
              requirements directly with employers or qualified advisors.
            </Disclaimer>
          </div>
        </div>
      </section>
    </div>
  );
}
