/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransactionType = 'expense' | 'income' | 'transfer';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  subCategory?: string;
  account: string;
  method: string;
  type: TransactionType;
  isNecessary: boolean;
  relatedEventId?: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  type: 'available' | 'reserved' | 'savings' | 'emergency';
  color: string;
}

export interface Debt {
  id: string;
  name: string;
  totalBalance: number;
  monthlyQuota: number;
  interestRate: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  nextPaymentDate: string;
}

export interface CreditCard {
  id: string;
  name: string;
  status: 'active' | 'blocked' | 'pending_cancellation' | 'cancelled';
  revolvingBalance: number;
  principalBalance: number;
  limit: number;
  actionRequired?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  status: 'active' | 'paused' | 'completed' | 'pending';
  suggestedContribution: number;
}

export interface AppEvent {
  id: string;
  name: string;
  type: 'planned' | 'sudden';
  budgetedAmount: number;
  actualSpent: number;
  date: string;
  status: 'on_track' | 'over_budget' | 'under_budget';
  expenses: string[]; // transaction ids
}
