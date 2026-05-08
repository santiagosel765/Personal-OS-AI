/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Helpers de finanzas. Funciones puras, sin React, sin librerías externas.
 * Reglas duras (ver docs/WORKING_RULES.md):
 *  - El dinero reservado nunca se cuenta como disponible.
 *  - Las transferencias no son ni gasto ni ingreso del patrimonio total.
 */

import { Account, Debt, Transaction } from '../types';
import { endOfWeek, startOfWeek } from './date';

export interface Projections {
  pendingIncome: number;
  pendingReceivables: number;
  pendingExpenses: number;
  weeklyBudgetTarget: number;
  nextIncomeDateISO: string;
}

export interface WeeklyBudgetProgress {
  spent: number;
  target: number;
  /** 0..100, redondeado. Puede pasar de 100 si se sobregira. */
  percent: number;
}

export function sumByType(accounts: Account[], type: Account['type']): number {
  return accounts.filter((a) => a.type === type).reduce((s, a) => s + a.balance, 0);
}

export function computeReserved(accounts: Account[]): number {
  return sumByType(accounts, 'reserved');
}

/**
 * Disponible Real = saldo en cuentas `available` + ingresos pendientes
 *                 + cuentas por cobrar pendientes − gastos pendientes.
 * Excluye explícitamente lo reservado.
 */
export function computeAvailableReal(accounts: Account[], projections: Projections): number {
  const liquid = sumByType(accounts, 'available');
  return (
    liquid +
    projections.pendingIncome +
    projections.pendingReceivables -
    projections.pendingExpenses
  );
}

export function computeMonthlyDebtTotal(debts: Debt[]): number {
  return debts.reduce((s, d) => s + d.monthlyQuota, 0);
}

/** Total gastado en la semana (lunes-domingo) que contiene `weekOf`. */
export function weeklySpent(transactions: Transaction[], weekOf: Date): number {
  const start = startOfWeek(weekOf);
  const end = endOfWeek(weekOf);
  return transactions
    .filter((t) => {
      if (t.type !== 'expense') return false;
      const d = new Date(t.date);
      return d >= start && d <= end;
    })
    .reduce((s, t) => s + t.amount, 0);
}

export function weeklyBudgetProgress(
  transactions: Transaction[],
  target: number,
  weekOf: Date,
): WeeklyBudgetProgress {
  const spent = weeklySpent(transactions, weekOf);
  const percent = target > 0 ? Math.round((spent / target) * 100) : 0;
  return { spent, target, percent };
}

export function sumIncomesByAccount(transactions: Transaction[], accountId: string): number {
  return transactions
    .filter((t) => t.type === 'income' && t.accountId === accountId)
    .reduce((s, t) => s + t.amount, 0);
}

export function sumExpensesByAccount(transactions: Transaction[], accountId: string): number {
  return transactions
    .filter((t) => t.type === 'expense' && t.accountId === accountId)
    .reduce((s, t) => s + t.amount, 0);
}

/**
 * Formato monetario consistente con el visual de la demo: "Q1,234.56".
 * Guatemala usa coma como separador de miles y punto decimal — coincide con en-US.
 */
export function formatQ(amount: number, decimals = 2): string {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
  return `Q${formatted}`;
}
