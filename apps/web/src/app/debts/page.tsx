import { ApiError, fetchDebts } from '@/lib/api';
import { debtStatusLabel } from '@/lib/labels';
import { PageContainer } from '@/components/shell/PageContainer';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { MoneyValue } from '@/components/ui/MoneyValue';
import { StatusBadge } from '@/components/ui/StatusBadge';

export const dynamic = 'force-dynamic';

function debtTone(balance: string, monthlyPayment: string) {
  const ratio = Number(monthlyPayment) / Math.max(Number(balance), 1);
  if (Number(balance) >= 30000) return 'danger';
  if (ratio >= 0.06) return 'warning';
  return 'accent';
}

export default async function DebtsPage() {
  let debts;
  try {
    debts = await fetchDebts();
  } catch (e) {
    const msg = e instanceof ApiError ? e.message : 'Error desconocido al cargar deudas.';
    return (
      <PageContainer title="Deudas">
        <ErrorState title="No se pudieron cargar las deudas" message={msg} />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Deudas">
      {debts.length === 0 ? (
        <EmptyState title="Sin deudas" message="No hay deudas registradas en la base de datos." />
      ) : (
        <section className="space-y-3">
          {debts.map((debt) => (
            <article key={debt.id} className="rounded-3xl bg-[var(--color-surface)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                    {debt.institution}
                  </p>
                  <h2 className="mt-1 truncate text-base font-black">{debt.name}</h2>
                </div>
                <StatusBadge tone={debtTone(debt.currentBalance, debt.monthlyPayment)}>
                  {debtStatusLabel(debt.status)}
                </StatusBadge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                <div>
                  <p className="text-[11px] text-[var(--color-muted)]">Saldo</p>
                  <MoneyValue value={debt.currentBalance} className="mt-1 block text-lg font-black" />
                </div>
                <div>
                  <p className="text-[11px] text-[var(--color-muted)]">Cuota</p>
                  <MoneyValue value={debt.monthlyPayment} className="mt-1 block text-lg font-black" />
                </div>
                <div>
                  <p className="text-[11px] text-[var(--color-muted)]">Tasa</p>
                  <p className="mt-1 font-mono text-lg font-black">{Number(debt.interestRate).toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-[11px] text-[var(--color-muted)]">Capital</p>
                  <p className="mt-1 text-sm font-bold">
                    {debt.allowsCapitalPayment ? `Desde cuota ${debt.capitalPaymentFrom ?? '-'}` : 'No aplica'}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </PageContainer>
  );
}
