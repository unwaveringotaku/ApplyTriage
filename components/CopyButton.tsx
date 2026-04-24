"use client";

import { useEffect, useRef, useState } from "react";

import { copyToClipboard } from "@/lib/clipboard";

interface CopyButtonProps {
  text: string;
  label: string;
  ariaLabel?: string;
  className?: string;
}

export function CopyButton({ text, label, ariaLabel, className }: CopyButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const resetTimeoutRef = useRef<number | null>(null);
  const isDisabled = text.trim().length === 0;
  const statusClasses =
    status === "copied"
      ? "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-[0_10px_28px_-18px_rgba(16,185,129,0.75)]"
      : status === "failed"
        ? "border-rose-300 bg-rose-50 text-rose-700 shadow-[0_10px_28px_-18px_rgba(244,63,94,0.72)]"
        : "";
  const dotClasses =
    status === "copied"
      ? "bg-emerald-500"
      : status === "failed"
        ? "bg-rose-500"
        : "bg-current opacity-40";
  const visibleLabel =
    status === "copied" ? "Copied to clipboard" : status === "failed" ? "Copy failed" : label;
  const srFeedback =
    status === "copied"
      ? `${label} copied to clipboard.`
      : status === "failed"
        ? `Could not copy ${label.toLowerCase()}.`
        : "";

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    if (isDisabled) {
      return;
    }

    if (resetTimeoutRef.current) {
      window.clearTimeout(resetTimeoutRef.current);
    }

    const success = await copyToClipboard(text);
    if (!success) {
      setStatus("failed");
      resetTimeoutRef.current = window.setTimeout(() => setStatus("idle"), 1800);
      return;
    }

    setStatus("copied");
    resetTimeoutRef.current = window.setTimeout(() => setStatus("idle"), 1600);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={isDisabled}
      aria-label={ariaLabel ?? label}
      aria-live="polite"
      className={
        `${className ??
          "inline-flex h-10 items-center justify-center rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"} ${statusClasses} disabled:cursor-not-allowed disabled:opacity-60`
      }
    >
      <span aria-hidden className={`mr-2 h-2 w-2 rounded-full ${dotClasses}`} />
      {visibleLabel}
      <span className="sr-only">{srFeedback}</span>
    </button>
  );
}
