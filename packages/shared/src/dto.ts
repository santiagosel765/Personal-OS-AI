import type {
  AccountType,
  CardStatus,
  DebtStatus,
  GoalPriority,
  GoalStatus,
  TransactionType,
  PaymentMethod,
  EventType,
} from './enums';

// Los Decimal de Prisma se serializan como string en JSON. Mantenemos string en DTOs
// para no perder precisión. El cliente los parsea con Number() o Decimal cuando lo necesite.

export interface AccountDTO {
  id: string;
  name: string;
  bank: string | null;
  type: AccountType;
  currency: string;
  initialBalance: string;
  currentBalance: string;
  purpose: string | null;
  isReserved: boolean;
  isActive: boolean;
  notes: string | null;
}

export interface DebtDTO {
  id: string;
  institution: string;
  name: string;
  type: string;
  initialAmount: string;
  currentBalance: string;
  interestRate: string;
  monthlyPayment: string;
  paymentDay: number | null;
  totalMonths: number | null;
  remainingMonths: number | null;
  allowsCapitalPayment: boolean;
  capitalPaymentFrom: number | null;
  status: DebtStatus;
  notes: string | null;
}

export interface CardDTO {
  id: string;
  bank: string;
  name: string;
  status: CardStatus;
  creditLimit: string | null;
  currentBalance: string;
  revolvingBalance: string | null;
  principalBalance: string | null;
  minimumPayment: string | null;
  statementBalance: string | null;
  cutDate: number | null;
  paymentDate: number | null;
  actionRequired: string | null;
  notes: string | null;
}

export interface GoalDTO {
  id: string;
  name: string;
  category: string;
  targetAmount: string;
  currentAmount: string;
  targetDate: string | null;
  priority: GoalPriority;
  status: GoalStatus;
  notes: string | null;
}

export interface TransactionDTO {
  id: string;
  accountId: string;
  accountToId: string | null;
  categoryId: string | null;
  type: TransactionType;
  amount: string;
  currency: string;
  date: string;
  description: string;
  paymentMethod: PaymentMethod | null;
  merchant: string | null;
  isNecessary: boolean | null;
  isImpulsive: boolean | null;
  classifiedByAi: boolean;
  notes: string | null;
  account?: {
    id: string;
    name: string;
    bank: string | null;
  };
  accountTo?: {
    id: string;
    name: string;
    bank: string | null;
  } | null;
  category?: {
    id: string;
    name: string;
    type: string;
  } | null;
}

export interface EventDTO {
  id: string;
  name: string;
  type: EventType;
  startDate: string;
  endDate: string | null;
  estimatedBudget: string | null;
  actualSpent: string | null;
  location: string | null;
  notes: string | null;
}

export interface DashboardAlert {
  id: string;
  level: 'info' | 'warning' | 'critical';
  message: string;
}

export interface DashboardDTO {
  /** Suma de cuentas no reservadas y activas. */
  availableReal: string;
  /** Suma de cuentas reservadas. */
  reserved: string;
  /** Suma de monthlyPayment de deudas ACTIVE. */
  monthlyDebt: string;
  /** Próximo ingreso mensual del usuario. */
  nextIncome: string;
  /** Presupuesto semanal del usuario. */
  weeklyBudget: string;
  /** Gastado en la semana en curso (lunes 00:00 - hoy). */
  weeklySpent: string;
  /** Tarjetas que requieren atención (BLOCKED, PENDING_CANCELLATION o saldo > 80% límite). */
  cardsCritical: CardDTO[];
  accounts: AccountDTO[];
  debts: DebtDTO[];
  goals: GoalDTO[];
  alerts: DashboardAlert[];
}
