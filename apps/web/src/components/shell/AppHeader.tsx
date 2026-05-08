export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[var(--color-bg)]/90 px-4 py-3 backdrop-blur md:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--color-accent)] text-sm font-black text-white">
            P
          </div>
          <div>
            <p className="text-sm font-black leading-tight">Personal OS</p>
            <p className="text-[11px] text-[var(--color-muted)]">Finanzas MVP</p>
          </div>
        </div>
        <div className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold text-[var(--color-muted)]">
          GTQ
        </div>
      </div>
    </header>
  );
}
