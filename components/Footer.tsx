export function Footer() {
  return (
    <footer className="border-t border-white/70 bg-white/70">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="glass-card flex flex-col gap-4 rounded-[2rem] border border-white/80 px-5 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-display text-2xl text-slate-950">ApplyTriage</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Paste job. Get decision. Move on.
            </p>
          </div>
          <div className="text-sm leading-7 text-slate-500 lg:text-right">
            <p>Built for the Codex Creator Challenge.</p>
            <p>Not legal or immigration advice.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
