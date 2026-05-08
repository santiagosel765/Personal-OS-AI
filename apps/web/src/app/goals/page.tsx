import { ApiError, fetchGoals } from '@/lib/api';
import { formatDate, goalStatusLabel, priorityLabel } from '@/lib/labels';
import { PageContainer } from '@/components/shell/PageContainer';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { MoneyValue } from '@/components/ui/MoneyValue';
import { StatusBadge } from '@/components/ui/StatusBadge';

export const dynamic = 'force-dynamic';

function priorityTone(priority: string) {
  if (priority === 'CRITICAL') return 'danger';
  if (priority === 'HIGH') return 'warning';
  if (priority === 'MEDIUM') return 'accent';
  return 'muted';
}

export default async function GoalsPage() {
  let goals;
  try {
    goals = await fetchGoals();
  } catch (e) {
    const msg = e instanceof ApiError ? e.message : 'Error desconocido al cargar metas.';
    return (
      <PageContainer title="Metas">
        <ErrorState title="No se pudieron cargar las metas" message={msg} />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Metas">
      {goals.length === 0 ? (
        <EmptyState title="Sin metas" message="No hay metas registradas en la base de datos." />
      ) : (
        <section className="space-y-3">
          {goals.map((goal) => {
            const target = Number(goal.targetAmount);
            const current = Number(goal.currentAmount);
            const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;
            return (
              <article key={goal.id} className="rounded-3xl bg-[var(--color-surface)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-black">{goal.name}</h2>
                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      {goal.category} · {goal.targetDate ? formatDate(goal.targetDate) : 'Sin fecha objetivo'}
                    </p>
                  </div>
                  <StatusBadge tone={priorityTone(goal.priority)}>{priorityLabel(goal.priority)}</StatusBadge>
                </div>

                <div className="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[11px] text-[var(--color-muted)]">Actual</p>
                    <MoneyValue value={goal.currentAmount} className="mt-1 block text-lg font-black" />
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-[var(--color-muted)]">Objetivo</p>
                    <MoneyValue value={goal.targetAmount} className="mt-1 block text-lg font-black" />
                  </div>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-[var(--color-accent)]" style={{ width: `${progress}%` }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-[var(--color-muted)]">
                  <span>{progress.toFixed(0)}%</span>
                  <span>{goalStatusLabel(goal.status)}</span>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </PageContainer>
  );
}
