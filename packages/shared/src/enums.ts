// Enums compartidos. Reflejan exactamente los enums de Prisma para evitar drift.
// Si cambias uno aquí, cámbialo también en packages/db/prisma/schema.prisma.

export const AccountType = {
  CHECKING: 'CHECKING',
  SAVINGS: 'SAVINGS',
  CASH: 'CASH',
  CREDIT: 'CREDIT',
  INVESTMENT: 'INVESTMENT',
  EMERGENCY: 'EMERGENCY',
} as const;
export type AccountType = (typeof AccountType)[keyof typeof AccountType];

export const TransactionType = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
  TRANSFER: 'TRANSFER',
  DEBT_PAYMENT: 'DEBT_PAYMENT',
} as const;
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

export const PaymentMethod = {
  CASH: 'CASH',
  DEBIT: 'DEBIT',
  CREDIT: 'CREDIT',
  TRANSFER: 'TRANSFER',
  OTHER: 'OTHER',
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const CategoryType = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
} as const;
export type CategoryType = (typeof CategoryType)[keyof typeof CategoryType];

export const DebtStatus = {
  ACTIVE: 'ACTIVE',
  PAID: 'PAID',
  FROZEN: 'FROZEN',
  IN_DEFAULT: 'IN_DEFAULT',
} as const;
export type DebtStatus = (typeof DebtStatus)[keyof typeof DebtStatus];

export const CardStatus = {
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
  PENDING_CANCELLATION: 'PENDING_CANCELLATION',
  CANCELLED: 'CANCELLED',
  FROZEN: 'FROZEN',
} as const;
export type CardStatus = (typeof CardStatus)[keyof typeof CardStatus];

export const GoalStatus = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  PAUSED: 'PAUSED',
  CANCELLED: 'CANCELLED',
} as const;
export type GoalStatus = (typeof GoalStatus)[keyof typeof GoalStatus];

export const GoalPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const;
export type GoalPriority = (typeof GoalPriority)[keyof typeof GoalPriority];

export const EventType = {
  PLANNED: 'PLANNED',
  SUDDEN: 'SUDDEN',
  RECURRING: 'RECURRING',
} as const;
export type EventType = (typeof EventType)[keyof typeof EventType];
