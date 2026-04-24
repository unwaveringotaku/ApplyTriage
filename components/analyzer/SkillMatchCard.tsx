import { CopyButton } from "@/components/CopyButton";
import { AnalysisResult } from "@/types";

function KeywordList({
  title,
  description,
  keywords,
  tone
}: {
  title: string;
  description: string;
  keywords: string[];
  tone: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5">
      <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${tone}`}>
        {title}
      </div>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {keywords.length ? (
          keywords.map((keyword) => (
            <span
              key={`${title}-${keyword}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            >
              {keyword}
            </span>
          ))
        ) : (
          <span className="text-sm text-slate-500">None surfaced clearly from the posting.</span>
        )}
      </div>
    </div>
  );
}

export function SkillMatchCard({ result }: { result: AnalysisResult }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-soft sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">
            Skill match
          </p>
          <h2 className="mt-2 font-display text-3xl text-slate-950">
            Matched strengths and missing resume keywords
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{result.roleSummary}</p>
        </div>
        <CopyButton
          text={result.resumeKeywordSuggestions.join(", ")}
          label="Copy resume keywords"
          className="inline-flex h-10 w-full items-center justify-center rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <KeywordList
          title="Matched keywords"
          description="These terms appeared in the posting and signal what the role values."
          keywords={result.matchedKeywords}
          tone="bg-emerald-100 text-emerald-800"
        />
        <KeywordList
          title="Missing keywords"
          description="These are useful resume-tailoring prompts if they reflect genuine work you have done."
          keywords={result.resumeKeywordSuggestions}
          tone="bg-amber-100 text-amber-800"
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Background alignment
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {result.backgroundAlignedKeywords.length ? (
              result.backgroundAlignedKeywords.map((keyword) => (
                <span
                  key={`background-${keyword}`}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                >
                  {keyword}
                </span>
              ))
            ) : (
              <p className="text-sm leading-7 text-slate-500">
                Add your background for a tighter alignment check against the role.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Resume tailoring notes
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600">{result.recommendedResumeFocus}</p>
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-900">
            Only add keywords that reflect real experience.
          </p>
        </div>
      </div>
    </section>
  );
}
