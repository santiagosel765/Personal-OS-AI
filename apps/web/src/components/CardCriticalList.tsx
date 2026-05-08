import { formatGTQ, type CardDTO } from '@personal-os/shared';

const statusLabel: Record<CardDTO['status'], string> = {
  ACTIVE: 'Activa',
  BLOCKED: 'Bloqueada',
  PENDING_CANCELLATION: 'Por cancelar',
  CANCELLED: 'Cancelada',
  FROZEN: 'Congelada',
};

export function CardCriticalList({ cards }: { cards: CardDTO[] }) {
  if (cards.length === 0) return null;
  return (
    <section className="rounded-2xl bg-[var(--color-surface)] p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">
        Tarjetas críticas
      </h2>
      <ul className="space-y-2">
        {cards.map((c) => (
          <li key={c.id} className="rounded-xl bg-[var(--color-surface-2)] p-3">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-medium">{c.name}</p>
              <span className="rounded-full bg-[var(--color-warning)]/20 px-2 py-0.5 text-[10px] uppercase text-[var(--color-warning)]">
                {statusLabel[c.status]}
              </span>
            </div>
            <p className="text-[11px] text-[var(--color-muted)]">
              {c.bank} · saldo {formatGTQ(c.currentBalance)}
            </p>
            {c.actionRequired ? (
              <p className="mt-1 text-xs text-[var(--color-warning)]">{c.actionRequired}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
