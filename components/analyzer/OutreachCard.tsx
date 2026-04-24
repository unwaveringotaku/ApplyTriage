import { CopyButton } from "@/components/CopyButton";
import { AnalysisResult } from "@/types";

function MessageBlock({
  title,
  text
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</p>
        </div>
        <CopyButton
          text={text}
          label="Copy"
          className="inline-flex h-10 w-full items-center justify-center rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
        />
      </div>
      <div className="mt-4 whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-700">
        {text}
      </div>
    </div>
  );
}

export function OutreachCard({ result }: { result: AnalysisResult }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-soft sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">
        Recruiter outreach
      </p>
      <h2 className="mt-2 font-display text-3xl text-slate-950">
        Templates you can actually send
      </h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        These messages are template-based and grounded in the risk level, role, and work
        authorization status you selected.
      </p>

      <div className="mt-6 grid gap-5">
        <MessageBlock title="LinkedIn connection note" text={result.outreachMessages.linkedinNote} />
        <MessageBlock
          title={result.outreachMessages.recruiterEmailSubject}
          text={result.outreachMessages.recruiterEmailBody}
        />
        <MessageBlock
          title="Work authorization clarification paragraph"
          text={result.outreachMessages.workAuthorizationParagraph}
        />
        <MessageBlock title="Follow-up message" text={result.outreachMessages.followUpMessage} />
      </div>
    </section>
  );
}
