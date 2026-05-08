export function LoadingState({ label = 'Cargando...' }: { label?: string }) {
  return (
    <div className="rounded-3xl bg-[var(--color-surface)] p-5">
      <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
      <div className="mt-4 h-14 animate-pulse rounded-2xl bg-white/5" />
      <p className="mt-3 text-xs text-[var(--color-muted)]">{label}</p>
    </div>
  );
}
