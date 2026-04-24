"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/analyze", label: "Analyze Job" },
  { href: "/saved", label: "Saved Jobs" },
  { href: "/about", label: "About" }
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-[1.85rem] border border-white/80 bg-white/80 px-4 py-4 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.35)] lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <Link href="/" className="flex items-center gap-3 self-start lg:self-auto">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold tracking-[0.2em] text-white shadow-[0_16px_30px_-22px_rgba(15,23,42,0.68)]">
              AT
            </span>
            <div className="min-w-0">
              <p className="font-display text-2xl leading-none text-slate-950">ApplyTriage</p>
              <p className="mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:hidden">
                30-second job triage
              </p>
              <p className="mt-1 hidden text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 sm:block">
                Paste job. Get decision. Move on.
              </p>
            </div>
          </Link>

          <nav
            aria-label="Primary"
            className="flex w-full items-center gap-2 overflow-x-auto rounded-full border border-slate-200/80 bg-slate-50/90 p-1 pb-1 lg:w-auto lg:justify-end"
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-semibold whitespace-nowrap transition ${
                    isActive
                      ? "bg-slate-950 text-white shadow-[0_16px_28px_-22px_rgba(15,23,42,0.72)]"
                      : "text-slate-600 hover:bg-white hover:text-slate-950"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
