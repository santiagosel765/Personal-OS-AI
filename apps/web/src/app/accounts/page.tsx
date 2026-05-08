import { ApiError, fetchAccounts } from '@/lib/api';
import { accountTypeLabel } from '@/lib/labels';
import { PageContainer } from '@/components/shell/PageContainer';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { MoneyValue } from '@/components/ui/MoneyValue';
import { StatusBadge } from '@/components/ui/StatusBadge';

export const dynamic = 'force-dynamic';

export default async function AccountsPage() {
  let accounts;
  try {
    accounts = await fetchAccounts();
  } catch (e) {
    const msg = e instanceof ApiError ? e.message : 'Error desconocido al cargar cuentas.';
    return (
      <PageContainer title="Cuentas">
        <ErrorState title="No se pudieron cargar las cuentas" message={msg} />
      </PageContainer>
    );
  }

  const available = accounts.filter((account) => !account.isReserved);
  const reserved = accounts.filter((account) => account.isReserved);
  const totalAvailable = available.reduce((sum, account) => sum + Number(account.currentBalance), 0);
  const totalReserved = reserved.reduce((sum, account) => sum + Number(account.currentBalance), 0);

  return (
    <PageContainer title="Cuentas">
      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-3xl bg-[var(--color-surface)] p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">Disponible</p>
          <MoneyValue value={totalAvailable} className="mt-2 block text-3xl font-black text-[var(--color-success)]" />
        </div>
        <div className="rounded-3xl bg-[var(--color-surface)] p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">Reservado</p>
          <MoneyValue value={totalReserved} className="mt-2 block text-3xl font-black text-[var(--color-warning)]" />
          <p className="mt-1 text-xs text-[var(--color-muted)]">No cuenta como disponible.</p>
        </div>
      </section>

      {accounts.length === 0 ? (
        <EmptyState title="Sin cuentas" message="Todavia no hay cuentas registradas en la base de datos." />
      ) : (
        <section className="space-y-3">
          {accounts.map((account) => (
            <article key={account.id} className="rounded-3xl bg-[var(--color-surface)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-base font-black">{account.name}</p>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    {account.bank ?? 'Sin banco'} · {accountTypeLabel(account.type)}
                  </p>
                </div>
                <StatusBadge tone={account.isReserved ? 'warning' : 'success'}>
                  {account.isReserved ? 'Reservada' : 'Disponible'}
                </StatusBadge>
              </div>
              <MoneyValue value={account.currentBalance} className="mt-4 block text-2xl font-black" />
              {account.purpose ? <p className="mt-2 text-xs text-[var(--color-muted)]">{account.purpose}</p> : null}
            </article>
          ))}
        </section>
      )}
    </PageContainer>
  );
}
