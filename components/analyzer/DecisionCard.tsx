import { CopyButton } from "@/components/CopyButton";
import { getActionStyles, getRiskStyles } from "@/lib/presentation";
import { AnalysisResult, RecommendedAction } from "@/types";

interface DecisionCardProps {
  result: AnalysisResult;
  onSave: () => void;
  isSaved: boolean;
}

const ACTION_DETAILS: Record<
  RecommendedAction,
  {
    eyebrow: string;
    nextStep: string;
    accent: string;
  }
> = {
  "APPLY NOW": {
    eyebrow: "Strong green light",
    nextStep: "Tailor the resume bullets quickly and submit while the role is still fresh.",
    accent: "from-emerald-400/18 via-teal-400/12 to-transparent"
  },
  "MESSAGE RECRUITER FIRST": {
    eyebrow: "Clarify candidate eligibility first",
    nextStep: "Send the short recruiter note, confirm the work authorization fit, then apply with context.",
    accent: "from-sky-400/18 via-blue-400/12 to-transparent"
  },
  "APPLY WITH REFERRAL": {
    eyebrow: "Warm intro recommended",
    nextStep: "Use the outreach template or a referral to de-risk the application before tailoring deeply.",
    accent: "from-violet-400/18 via-fuchsia-400/12 to-transparent"
  },
  SKIP: {
    eyebrow: "Protect your application bandwidth",
    nextStep: "Move on and spend your next application slot on roles with clearer eligibility and stronger fit.",
    accent: "from-rose-400/18 via-orange-400/10 to-transparent"
  }
};

export function DecisionCard({ result, onSave, isSaved }: DecisionCardProps) {
  const actionDetail = ACTION_DETAILS[result.recommendedAction];
  const topStrengths = result.matchedKeywords.slice(0, 3);
  const topWatchouts = [
    ...result.signals.critical,
    ...result.signals.high,
    ...result.signals.medium
  ]
    .map((signal) => signal.phrase)
    .slice(0, 3);

  return (
    <section className="relative overflow-hidden rounded-[2.35rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-soft sm:p-8">
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-r ${actionDetail.accent}`} />
      <div className="relative">
        <div className="flex flex-col gap-6 xl:grid xl:grid-cols-[1.08fr_0.92fr]">
          <div>
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              First answer
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">
              {actionDetail.eyebrow}
            </p>
            <div
              className={`mt-3 inline-flex rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] ring-1 ${getActionStyles(
                result.recommendedAction
              )}`}
            >
              {result.recommendedAction}
            </div>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
              {result.explanation}
            </p>

            <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Best next move
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-200">{actionDetail.nextStep}</p>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  What helped
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {topStrengths.length ? (
                    topStrengths.map((keyword) => (
                      <span
                        key={`strength-${keyword}`}
                        className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs font-medium text-slate-200"
                      >
                        {keyword}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm leading-7 text-slate-300">
                      No strong skill signals surfaced clearly from the posting.
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Main watchouts
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {topWatchouts.length ? (
                    topWatchouts.map((phrase) => (
                      <span
                        key={`watchout-${phrase}`}
                        className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs font-medium text-slate-200"
                      >
                        {phrase}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm leading-7 text-slate-300">
                      The posting does not include many explicit authorization warnings.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.65rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Overall fit score
              </p>
              <p className="mt-3 text-5xl font-semibold">{result.overallScore}</p>
              <p className="mt-1 text-sm text-slate-300">out of 100</p>
            </div>
            <div className="rounded-[1.65rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Skill match
              </p>
              <p className="mt-3 text-5xl font-semibold">{result.skillMatchScore}</p>
              <p className="mt-1 text-sm text-slate-300">out of 35</p>
            </div>
            <div className="rounded-[1.65rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Work auth compatibility
              </p>
              <p className="mt-3 text-4xl font-semibold">{result.workAuthorizationCompatibilityScore}</p>
              <p className="mt-1 text-sm text-slate-300">out of 25</p>
            </div>
            <div className="rounded-[1.65rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Role match
              </p>
              <p className="mt-3 text-4xl font-semibold">{result.roleMatchScore}</p>
              <p className="mt-1 text-sm text-slate-300">out of 10</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <span
            className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ring-1 ${getRiskStyles(
              result.workAuthorizationRisk
            )}`}
          >
            Work authorization risk: {result.workAuthorizationRisk}
          </span>
          <div
            className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ring-1 ${getRiskStyles(
              result.seniorityRisk
            )}`}
          >
            Seniority risk: {result.seniorityRisk}
          </div>
          <div
            className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ring-1 ${getRiskStyles(
              result.locationRisk
            )}`}
          >
            Location risk: {result.locationRisk}
          </div>
          <div
            className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ring-1 ${getRiskStyles(
              result.analysisConfidence
            )}`}
          >
            Analysis confidence: {result.analysisConfidence}
          </div>
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200">
            Decision first. Evidence below.
          </div>
        </div>

        {result.confidenceReasons.length ? (
          <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Confidence notes
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.confidenceReasons.map((reason) => (
                <span
                  key={reason}
                  className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs font-medium text-slate-200"
                >
                  {reason}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <CopyButton
            text={result.outreachMessages.recruiterEmailBody}
            label="Copy recruiter message"
            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-white px-4 text-sm font-semibold text-slate-900 shadow-[0_18px_34px_-24px_rgba(255,255,255,0.7)] transition hover:-translate-y-0.5 hover:bg-slate-100"
          />
          <CopyButton
            text={result.resumeKeywordSuggestions.join(", ")}
            label="Copy resume keywords"
            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
          />
          <button
            type="button"
            onClick={onSave}
            disabled={isSaved}
            aria-pressed={isSaved}
            className={`inline-flex h-11 w-full items-center justify-center rounded-full px-4 text-sm font-semibold transition ${
              isSaved
                ? "border border-emerald-300 bg-emerald-50 text-emerald-900 shadow-[0_14px_28px_-20px_rgba(16,185,129,0.9)]"
                : "border border-white/15 bg-white/5 text-white hover:-translate-y-0.5 hover:bg-white/10"
            } disabled:cursor-not-allowed`}
          >
            {isSaved ? "Saved to shortlist" : "Save analysis"}
          </button>
        </div>
      </div>
    </section>
  );
}
