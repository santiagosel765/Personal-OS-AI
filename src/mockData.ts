/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Account, AppEvent, CreditCard, Debt, Goal, Transaction } from './types';

export const MOCK_ACCOUNTS: Account[] = [
  { id: 'bi', name: 'BI (Banco Ind.)', balance: 1700, type: 'available', color: 'bg-blue-500' },
  { id: 'bac', name: 'BAC Credomatic', balance: 1000, type: 'available', color: 'bg-red-500' },
  { id: 'bam_oro_res', name: 'Reservado BAM Oro', balance: 4300, type: 'reserved', color: 'bg-amber-600' },
  { id: 'emergency', name: 'Fondo Emergencia', balance: 0, type: 'emergency', color: 'bg-emerald-500' },
  { id: 'cash', name: 'Efectivo', balance: 0, type: 'available', color: 'bg-gray-400' },
];

export const MOCK_DEBTS: Debt[] = [
  { 
    id: 'bac_casa', 
    name: 'BAC Casa', 
    totalBalance: 21845.88, 
    monthlyQuota: 863.50, 
    interestRate: 16, 
    priority: 'medium', 
    nextPaymentDate: '2026-05-30' 
  },
  { 
    id: 'bam_tacoma', 
    name: 'BAM Tacoma', 
    totalBalance: 38906.63, 
    monthlyQuota: 2600.00, 
    interestRate: 24, 
    priority: 'high', 
    nextPaymentDate: '2026-05-15' 
  },
  { 
    id: 'promerica_fin', 
    name: 'Promerica Financiamiento', 
    totalBalance: 18269.78, 
    monthlyQuota: 652.49, 
    interestRate: 0, 
    priority: 'low', 
    nextPaymentDate: '2026-05-25' 
  },
  { 
    id: 'bam_blanca_fin', 
    name: 'BAM Blanca Fin.', 
    totalBalance: 4027.77, 
    monthlyQuota: 138.89, 
    interestRate: 0, 
    priority: 'low', 
    nextPaymentDate: '2026-05-25' 
  },
  { 
    id: 'extra_promerica', 
    name: 'Extra Fin. Promerica', 
    totalBalance: 19600, 
    monthlyQuota: 1347.08, 
    interestRate: 0, 
    priority: 'medium', 
    nextPaymentDate: '2026-05-28' 
  },
];

export const MOCK_CARDS: CreditCard[] = [
  { id: 'promerica', name: 'Promerica', status: 'blocked', revolvingBalance: 0, principalBalance: 0, limit: 15000, actionRequired: 'No usar / Bloqueada' },
  { id: 'bam_oro', name: 'BAM Oro', status: 'blocked', revolvingBalance: 0, principalBalance: 4300, limit: 20000, actionRequired: 'Pagar financiamientos y dar de baja' },
  { id: 'bam_blanca', name: 'BAM Blanca', status: 'active', revolvingBalance: 1720.74, principalBalance: 0, limit: 10000, actionRequired: 'Limpiar saldo revolvente' },
  { id: 'amex_bac', name: 'AMEX BAC', status: 'active', revolvingBalance: 8750.00, principalBalance: 0, limit: 30000, actionRequired: 'Pagar fuerte en junio' },
];

export const MOCK_GOALS: Goal[] = [
  { id: 'cancel_bam', name: 'Cancelar BAM Oro', targetAmount: 4300, currentAmount: 0, deadline: '2026-07-01', status: 'active', suggestedContribution: 500 },
  { id: 'amex_zero', name: 'AMEX en cero', targetAmount: 8750, currentAmount: 0, deadline: '2026-07-31', status: 'active', suggestedContribution: 2000 },
  { id: 'emergency_fund', name: 'Fondo Emergencia', targetAmount: 25000, currentAmount: 0, deadline: '2027-05-01', status: 'active', suggestedContribution: 1000 },
  { id: 'garmin', name: 'Garmin Forerunner 265', targetAmount: 4500, currentAmount: 400, deadline: '2026-12-01', status: 'pending', suggestedContribution: 300 },
];

export const MOCK_EVENTS: AppEvent[] = [
  { 
    id: 'cena_rest', 
    name: 'Cena Restaurante', 
    type: 'sudden', 
    budgetedAmount: 250, 
    actualSpent: 300, 
    date: '2026-05-07', 
    status: 'over_budget', 
    expenses: ['t1'] 
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { 
    id: 't1', 
    date: '2026-05-07', 
    description: 'Cena Restaurante', 
    amount: 300, 
    category: 'Comida', 
    subCategory: 'Cena', 
    account: 'BI', 
    method: 'Efectivo', 
    type: 'expense', 
    isNecessary: false,
    relatedEventId: 'cena_rest'
  },
  { 
    id: 't2', 
    date: '2026-05-07', 
    description: 'Internet', 
    amount: 500, 
    category: 'Servicios', 
    account: 'BI', 
    method: 'Transferencia', 
    type: 'expense', 
    isNecessary: true 
  },
  { 
    id: 't3', 
    date: '2026-05-07', 
    description: 'Almuerzo efectivo BI', 
    amount: 28, 
    category: 'Comida', 
    subCategory: 'Almuerzo', 
    account: 'BI', 
    method: 'Efectivo', 
    type: 'expense', 
    isNecessary: true 
  }
];
