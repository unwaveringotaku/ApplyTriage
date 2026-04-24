import { AnalysisResult } from "@/types";

const SCORE_CONFIG = [
  { key: "skillMatch", label: "Skill match", max: 35 },
  { key: "workAuthorizationCompatibility", label: "Work authorization compatibility", max: 25 },
  { key: "seniorityMatch", label: "Seniority match", max: 20 },
  { key: "locationMatch", label: "Location match", max: 10 },
  { key: "roleMatch", label: "Role match", max: 10 }
] as const;

export function ScoreBreakdown({ result }: { result: AnalysisResult }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-soft sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">
            Score breakdown
          </p>
          <h2 className="mt-2 font-display text-3xl text-slate-950">Why the score landed here</h2>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Total
          </p>
          <p className="text-2xl font-semibold text-slate-950">{result.scoreBreakdown.overall}/100</p>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {SCORE_CONFIG.map((item) => {
          const value = result.scoreBreakdown[item.key];
          const percentage = Math.round((value / item.max) * 100);

          return (
            <div key={item.key}>
              <div className="mb-2 flex items-center justify-between gap-4 text-sm text-slate-600">
                <span>{item.label}</span>
                <span className="font-semibold text-slate-950">
                  {value}/{item.max}
                </span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-teal-600 to-blue-600 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
