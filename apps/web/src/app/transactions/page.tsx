import { ApiError, fetchTransactions } from '@/lib/api';
import { formatDate, paymentMethodLabel, transactionTypeLabel } from '@/lib/labels';
import { PageContainer } from '@/components/shell/PageContainer';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { MoneyValue } from '@/components/ui/MoneyValue';
import { StatusBadge } from '@/components/ui/StatusBadge';

export const dynamic = 'force-dynamic';

export default async function TransactionsPage() {
  let transactions;
  try {
    transactions = await fetchTransactions();
  } catch (e) {
    const msg = e instanceof ApiError ? e.message : 'Error desconocido al cargar transacciones.';
    return (
      <PageContainer title="Transacciones">
        <ErrorState title="No se pudieron cargar las transacciones" message={msg} />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Transacciones" eyebrow="Historial">
      {transactions.length === 0 ? (
        <EmptyState title="Sin transacciones" message="No hay movimientos reales registrados en la base de datos." />
      ) : (
        <section className="space-y-3">
          {transactions.map((transaction) => {
            const isIncome = transaction.type === 'INCOME';
            const isExpense = transaction.type === 'EXPENSE' || transaction.type === 'DEBT_PAYMENT';
            return (
              <article key={transaction.id} className="rounded-3xl bg-[var(--color-surface)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black">{transaction.description}</p>
                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      {formatDate(transaction.date)} · {transaction.account?.name ?? transaction.accountId}
                    </p>
                  </div>
                  <MoneyValue
                    value={transaction.amount}
                    className={`text-base font-black ${
                      isIncome ? 'text-[var(--color-success)]' : isExpense ? 'text-[var(--color-danger)]' : ''
                    }`}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge tone={isIncome ? 'success' : isExpense ? 'danger' : 'accent'}>
                    {transactionTypeLabel(transaction.type)}
                  </StatusBadge>
                  <StatusBadge>{transaction.category?.name ?? 'Sin categoria'}</StatusBadge>
                  <StatusBadge>{paymentMethodLabel(transaction.paymentMethod)}</StatusBadge>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </PageContainer>
  );
}
