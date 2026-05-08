export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-center">
      <p className="text-sm font-semibold text-[var(--color-text)]">{title}</p>
      <p className="mt-1 text-xs leading-5 text-[var(--color-muted)]">{message}</p>
    </div>
  );
}
