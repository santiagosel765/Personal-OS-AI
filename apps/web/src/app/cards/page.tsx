import { ApiError, fetchCards } from '@/lib/api';
import { cardStatusLabel } from '@/lib/labels';
import { PageContainer } from '@/components/shell/PageContainer';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { MoneyValue } from '@/components/ui/MoneyValue';
import { StatusBadge } from '@/components/ui/StatusBadge';

export const dynamic = 'force-dynamic';

function cardTone(status: string, currentBalance: string) {
  if (status === 'BLOCKED') return 'danger';
  if (status === 'PENDING_CANCELLATION') return 'warning';
  if (Number(currentBalance) > 0) return 'accent';
  return 'success';
}

export default async function CardsPage() {
  let cards;
  try {
    cards = await fetchCards();
  } catch (e) {
    const msg = e instanceof ApiError ? e.message : 'Error desconocido al cargar tarjetas.';
    return (
      <PageContainer title="Tarjetas">
        <ErrorState title="No se pudieron cargar las tarjetas" message={msg} />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Tarjetas">
      {cards.length === 0 ? (
        <EmptyState title="Sin tarjetas" message="No hay tarjetas registradas en la base de datos." />
      ) : (
        <section className="grid gap-3 md:grid-cols-2">
          {cards.map((card) => (
            <article key={card.id} className="rounded-3xl bg-[var(--color-surface)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                    {card.bank}
                  </p>
                  <h2 className="mt-1 text-lg font-black">{card.name}</h2>
                </div>
                <StatusBadge tone={cardTone(card.status, card.currentBalance)}>
                  {cardStatusLabel(card.status)}
                </StatusBadge>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] text-[var(--color-muted)]">Saldo actual</p>
                  <MoneyValue value={card.currentBalance} className="mt-1 block text-lg font-black" />
                </div>
                <div>
                  <p className="text-[11px] text-[var(--color-muted)]">Limite</p>
                  <MoneyValue value={card.creditLimit ?? 0} className="mt-1 block text-lg font-black" />
                </div>
              </div>

              {card.actionRequired ? (
                <div className="mt-4 rounded-2xl bg-white/5 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
                    Accion requerida
                  </p>
                  <p className="mt-1 text-sm font-semibold">{card.actionRequired}</p>
                </div>
              ) : null}
            </article>
          ))}
        </section>
      )}
    </PageContainer>
  );
}
