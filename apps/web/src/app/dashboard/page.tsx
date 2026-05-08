import { fetchDashboard, ApiError } from '@/lib/api';
import { formatGTQ } from '@personal-os/shared';
import { KpiCard } from '@/components/KpiCard';
import { AccountList } from '@/components/AccountList';
import { AlertList } from '@/components/AlertList';
import { CardCriticalList } from '@/components/CardCriticalList';
import { DebtList } from '@/components/DebtList';
import { PageContainer } from '@/components/shell/PageContainer';
import { ErrorState } from '@/components/ui/ErrorState';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let data;
  try {
    data = await fetchDashboard();
  } catch (e) {
    const msg = e instanceof ApiError ? e.message : 'Error desconocido al cargar el dashboard.';
    return (
      <PageContainer title="Dashboard">
        <ErrorState title="No se pudo cargar el dashboard" message={msg} />
      </PageContainer>
    );
  }

  const weeklyRemaining = Number(data.weeklyBudget) - Number(data.weeklySpent);

  return (
    <PageContainer title="Dashboard">
      <section className="grid grid-cols-2 gap-3">
        <KpiCard label="Disponible real" value={formatGTQ(data.availableReal)} tone="accent" />
        <KpiCard label="Reservado" value={formatGTQ(data.reserved)} tone="muted" subtitle="No tocar" />
        <KpiCard label="Cuota mensual" value={formatGTQ(data.monthlyDebt)} tone="warning" subtitle="Deudas activas" />
        <KpiCard label="Próximo ingreso" value={formatGTQ(data.nextIncome)} tone="success" />
      </section>

      <section className="rounded-2xl bg-[var(--color-surface)] p-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">Semana</h2>
          <span className={`text-xs ${weeklyRemaining < 0 ? 'text-[var(--color-danger)]' : 'text-[var(--color-muted)]'}`}>
            {weeklyRemaining < 0 ? 'Excedido' : 'Restante'} {formatGTQ(Math.abs(weeklyRemaining))}
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-semibold">{formatGTQ(data.weeklySpent)}</span>
          <span className="text-sm text-[var(--color-muted)]">/ {formatGTQ(data.weeklyBudget)}</span>
        </div>
      </section>

      <AlertList alerts={data.alerts} />
      <CardCriticalList cards={data.cardsCritical} />
      <AccountList accounts={data.accounts} />
      <DebtList debts={data.debts} />
    </PageContainer>
  );
}
