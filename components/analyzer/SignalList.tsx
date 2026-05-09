import { AnalysisResult, WorkAuthSignal } from "@/types";

function SignalGroup({
  title,
  signals,
  tone
}: {
  title: string;
  signals: WorkAuthSignal[];
  tone: string;
}) {
  return (
    <div className="space-y-3">
      <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${tone}`}>
        {title} {signals.length ? `(${signals.length})` : ""}
      </div>
      {signals.length ? (
        <div className="flex flex-wrap gap-2">
          {signals.map((signal) => (
            <span
              key={`${title}-${signal.phrase}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            >
              {signal.phrase}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm leading-7 text-slate-500">No signals found in this category.</p>
      )}
    </div>
  );
}

export function SignalList({ result }: { result: AnalysisResult }) {
  const totalSignals =
    result.signals.critical.length +
    result.signals.high.length +
    result.signals.medium.length +
    result.signals.positive.length;

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-soft sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">
        Work authorization signals found
      </p>
      <h2 className="mt-2 font-display text-3xl text-slate-950">What the posting actually says</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">{result.workAuthorizationSummary}</p>

      {totalSignals === 0 ? (
        <p className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600">
          Not enough explicit work authorization language found. Treat as unclear and verify with recruiter.
        </p>
      ) : (
        <div className="mt-6 grid gap-6">
          <SignalGroup
            title="Red flags found"
            signals={[...result.signals.critical, ...result.signals.high]}
            tone="bg-rose-100 text-rose-800"
          />
          <SignalGroup
            title="Yellow flags found"
            signals={result.signals.medium}
            tone="bg-amber-100 text-amber-800"
          />
          <SignalGroup
            title="Green signals found"
            signals={result.signals.positive}
            tone="bg-emerald-100 text-emerald-800"
          />
        </div>
      )}

      {result.evidenceSnippets.length ? (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50/90 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Evidence snippets
          </p>
          <div className="mt-4 grid gap-3">
            {result.evidenceSnippets.slice(0, 5).map((evidence) => (
              <div
                key={`${evidence.category}-${evidence.phrase}-${evidence.snippet}`}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {evidence.label}: {evidence.phrase}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{evidence.snippet}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
