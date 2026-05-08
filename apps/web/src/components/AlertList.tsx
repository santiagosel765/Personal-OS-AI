import type { DashboardAlert } from '@personal-os/shared';

const tone: Record<DashboardAlert['level'], string> = {
  info: 'border-white/10 bg-[var(--color-surface)] text-[var(--color-text)]',
  warning: 'border-[var(--color-warning)]/40 bg-[var(--color-warning)]/10 text-[var(--color-warning)]',
  critical: 'border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 text-[var(--color-danger)]',
};

export function AlertList({ alerts }: { alerts: DashboardAlert[] }) {
  if (alerts.length === 0) return null;
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">Alertas</h2>
      <ul className="space-y-2">
        {alerts.map((a) => (
          <li key={a.id} className={`rounded-xl border p-3 text-sm ${tone[a.level]}`}>
            {a.message}
          </li>
        ))}
      </ul>
    </section>
  );
}
