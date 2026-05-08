import { ApiError, fetchEvents } from '@/lib/api';
import { eventTypeLabel, formatDate } from '@/lib/labels';
import { PageContainer } from '@/components/shell/PageContainer';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { MoneyValue } from '@/components/ui/MoneyValue';
import { StatusBadge } from '@/components/ui/StatusBadge';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  let events;
  try {
    events = await fetchEvents();
  } catch (e) {
    const msg = e instanceof ApiError ? e.message : 'Error desconocido al cargar eventos.';
    return (
      <PageContainer title="Eventos">
        <ErrorState title="No se pudieron cargar los eventos" message={msg} />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Eventos">
      {events.length === 0 ? (
        <EmptyState
          title="Sin eventos"
          message="La tabla de eventos existe, pero el seed actual no tiene eventos registrados."
        />
      ) : (
        <section className="space-y-3">
          {events.map((event) => (
            <article key={event.id} className="rounded-3xl bg-[var(--color-surface)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-black">{event.name}</h2>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    {formatDate(event.startDate)}
                    {event.endDate ? ` - ${formatDate(event.endDate)}` : ''}
                  </p>
                </div>
                <StatusBadge tone="accent">{eventTypeLabel(event.type)}</StatusBadge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] text-[var(--color-muted)]">Presupuesto</p>
                  <MoneyValue value={event.estimatedBudget ?? 0} className="mt-1 block text-lg font-black" />
                </div>
                <div>
                  <p className="text-[11px] text-[var(--color-muted)]">Gastado</p>
                  <MoneyValue value={event.actualSpent ?? 0} className="mt-1 block text-lg font-black" />
                </div>
              </div>
              {event.location ? <p className="mt-3 text-xs text-[var(--color-muted)]">{event.location}</p> : null}
            </article>
          ))}
        </section>
      )}
    </PageContainer>
  );
}
