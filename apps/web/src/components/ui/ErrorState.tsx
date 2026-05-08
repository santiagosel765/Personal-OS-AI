export function ErrorState({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-3xl border border-[var(--color-danger)]/35 bg-[var(--color-danger)]/10 p-5">
      <p className="text-sm font-semibold text-[var(--color-danger)]">{title}</p>
      <p className="mt-1 text-xs leading-5 text-[var(--color-muted)]">{message}</p>
    </div>
  );
}
