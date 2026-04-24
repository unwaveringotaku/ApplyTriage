interface DisclaimerProps {
  children: React.ReactNode;
  tone?: "warm" | "neutral";
  compact?: boolean;
}

export function Disclaimer({
  children,
  tone = "warm",
  compact = false
}: DisclaimerProps) {
  const toneClasses =
    tone === "neutral"
      ? "border-slate-200 bg-white/90 text-slate-700"
      : "border-amber-200/90 bg-amber-50/92 text-amber-950";
  const labelClasses = tone === "neutral" ? "text-slate-500" : "text-amber-800";
  const dotClasses = tone === "neutral" ? "bg-slate-400" : "bg-amber-500";

  return (
    <div
      className={`rounded-[1.75rem] border ${toneClasses} ${
        compact ? "px-4 py-3" : "px-5 py-4"
      } shadow-[0_14px_40px_-28px_rgba(15,23,42,0.2)]`}
    >
      <div className="flex gap-3">
        <span className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${dotClasses}`} />
        <div>
          <p className={`text-[0.7rem] font-semibold uppercase tracking-[0.18em] ${labelClasses}`}>
            Not legal or immigration advice
          </p>
          <div
            className={`mt-1 ${compact ? "text-sm leading-7" : "text-sm leading-7 sm:text-[0.95rem]"}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
