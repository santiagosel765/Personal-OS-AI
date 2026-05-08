import { formatGTQ, type AccountDTO } from '@personal-os/shared';

export function AccountList({ accounts }: { accounts: AccountDTO[] }) {
  if (accounts.length === 0) return null;
  return (
    <section className="rounded-2xl bg-[var(--color-surface)] p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">Cuentas</h2>
      <ul className="space-y-2">
        {accounts.map((a) => (
          <li
            key={a.id}
            className="flex items-center justify-between rounded-xl bg-[var(--color-surface-2)] px-3 py-2"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{a.name}</p>
              <p className="text-[11px] text-[var(--color-muted)]">
                {a.bank ?? a.type}
                {a.isReserved ? ' · Reservado' : ''}
              </p>
            </div>
            <p className={`text-sm font-semibold ${a.isReserved ? 'text-[var(--color-muted)]' : ''}`}>
              {formatGTQ(a.currentBalance)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
