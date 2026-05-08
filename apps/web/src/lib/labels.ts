import type {
  AccountDTO,
  CardDTO,
  DebtDTO,
  EventDTO,
  GoalDTO,
  TransactionDTO,
} from '@personal-os/shared';

export function accountTypeLabel(type: AccountDTO['type']) {
  const labels: Record<AccountDTO['type'], string> = {
    CHECKING: 'Monetaria',
    SAVINGS: 'Ahorro',
    CASH: 'Efectivo',
    CREDIT: 'Credito',
    INVESTMENT: 'Inversion',
    EMERGENCY: 'Emergencia',
  };
  return labels[type];
}

export function cardStatusLabel(status: CardDTO['status']) {
  const labels: Record<CardDTO['status'], string> = {
    ACTIVE: 'Activa',
    BLOCKED: 'Bloqueada',
    PENDING_CANCELLATION: 'Por cancelar',
    CANCELLED: 'Cancelada',
    FROZEN: 'Congelada',
  };
  return labels[status];
}

export function debtStatusLabel(status: DebtDTO['status']) {
  const labels: Record<DebtDTO['status'], string> = {
    ACTIVE: 'Activa',
    PAID: 'Pagada',
    FROZEN: 'Congelada',
    IN_DEFAULT: 'En mora',
  };
  return labels[status];
}

export function goalStatusLabel(status: GoalDTO['status']) {
  const labels: Record<GoalDTO['status'], string> = {
    ACTIVE: 'Activa',
    COMPLETED: 'Completada',
    PAUSED: 'Pausada',
    CANCELLED: 'Cancelada',
  };
  return labels[status];
}

export function priorityLabel(priority: GoalDTO['priority']) {
  const labels: Record<GoalDTO['priority'], string> = {
    LOW: 'Baja',
    MEDIUM: 'Media',
    HIGH: 'Alta',
    CRITICAL: 'Critica',
  };
  return labels[priority];
}

export function transactionTypeLabel(type: TransactionDTO['type']) {
  const labels: Record<TransactionDTO['type'], string> = {
    INCOME: 'Ingreso',
    EXPENSE: 'Gasto',
    TRANSFER: 'Transferencia',
    DEBT_PAYMENT: 'Pago deuda',
  };
  return labels[type];
}

export function paymentMethodLabel(method: TransactionDTO['paymentMethod']) {
  if (!method) return 'Sin metodo';
  const labels: Record<NonNullable<TransactionDTO['paymentMethod']>, string> = {
    CASH: 'Efectivo',
    DEBIT: 'Debito',
    CREDIT: 'Credito',
    TRANSFER: 'Transferencia',
    OTHER: 'Otro',
  };
  return labels[method];
}

export function eventTypeLabel(type: EventDTO['type']) {
  const labels: Record<EventDTO['type'], string> = {
    PLANNED: 'Planificado',
    SUDDEN: 'Imprevisto',
    RECURRING: 'Recurrente',
  };
  return labels[type];
}

export function formatDate(value: string | null | undefined) {
  if (!value) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-GT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}
