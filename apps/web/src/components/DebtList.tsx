import { formatGTQ, type DebtDTO } from '@personal-os/shared';

export function DebtList({ debts }: { debts: DebtDTO[] }) {
  if (debts.length === 0) return null;
  const active = debts.filter((d) => d.status === 'ACTIVE');
  if (active.length === 0) return null;
  return (
    <section className="rounded-2xl bg-[var(--color-surface)] p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">
        Deudas activas
      </h2>
      <ul className="space-y-2">
        {active.map((d) => (
          <li
            key={d.id}
            className="flex items-center justify-between rounded-xl bg-[var(--color-surface-2)] px-3 py-2"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{d.name}</p>
              <p className="text-[11px] text-[var(--color-muted)]">
                {d.institution} · cuota {formatGTQ(d.monthlyPayment)}
              </p>
            </div>
            <p className="text-sm font-semibold">{formatGTQ(d.currentBalance)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
