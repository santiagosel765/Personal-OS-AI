/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  ArrowLeftRight,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_ACCOUNTS, MOCK_TRANSACTIONS } from '../mockData';
import { sumExpensesByAccount, sumIncomesByAccount } from '../lib/finance';

interface AccountDetailViewProps {
  accountId: string;
  onBack: () => void;
}

export default function AccountDetailView({ accountId, onBack }: AccountDetailViewProps) {
  const account = MOCK_ACCOUNTS.find(a => a.id === accountId);
  const transactions = MOCK_TRANSACTIONS.filter(
    t => t.accountId === accountId || t.accountToId === accountId
  );

  if (!account) return <div>Cuenta no encontrada</div>;

  const totalExpenses = sumExpensesByAccount(MOCK_TRANSACTIONS, accountId);
  const totalIncomes = sumIncomesByAccount(MOCK_TRANSACTIONS, accountId);

  return (
    <div className="flex flex-col min-h-full">
      {/* Detail Header */}
      <div className="p-4 bg-white border-b border-gray-100 flex items-center gap-3">
        <button onClick={onBack} className="p-2 bg-gray-50 rounded-full text-gray-500 active:scale-90 transition-transform">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col">
          <h2 className="font-black text-gray-900 tracking-tight text-xl">{account.name}</h2>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Detalle de Cuenta</span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-6">
        {/* Balance Card */}
        <div className="bg-gray-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="w-24 h-24" />
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Saldo Disponible Actual</span>
          <span className="text-4xl font-black font-mono">Q{account.balance.toLocaleString()}</span>
          
          <div className="grid grid-cols-2 gap-4 w-full mt-8 pt-6 border-t border-white/10">
            <div className="flex flex-col items-center">
               <div className="flex items-center gap-1 text-emerald-400 mb-1">
                 <TrendingDown className="w-3 h-3" />
                 <span className="text-[10px] font-black uppercase">Ingresos</span>
               </div>
               <span className="text-sm font-bold font-mono">Q{totalIncomes.toLocaleString()}</span>
            </div>
            <div className="flex flex-col items-center">
               <div className="flex items-center gap-1 text-rose-400 mb-1">
                 <TrendingUp className="w-3 h-3" />
                 <span className="text-[10px] font-black uppercase">Gastos</span>
               </div>
               <span className="text-sm font-bold font-mono">Q{totalExpenses.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-blue-600 text-white p-4 rounded-3xl font-bold flex flex-col items-center justify-center gap-2 shadow-lg shadow-blue-100 active:scale-95 transition-all">
            <Plus className="w-5 h-5" />
            <span className="text-xs uppercase tracking-tight">Nuevo Gasto</span>
          </button>
          <button className="bg-white border border-gray-100 text-gray-900 p-4 rounded-3xl font-bold flex flex-col items-center justify-center gap-2 shadow-sm active:scale-95 transition-all">
            <ArrowLeftRight className="w-5 h-5 text-blue-600" />
            <span className="text-xs uppercase tracking-tight">Transferir</span>
          </button>
        </div>

        {/* Monthly Summary */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-sm text-gray-900 uppercase tracking-widest px-1">Resumen Mensual</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Total Ingresos</span>
                <span className="text-base font-black text-emerald-600 font-mono">Q{totalIncomes.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Total Gastos</span>
                <span className="text-base font-black text-rose-600 font-mono">Q{totalExpenses.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="flex flex-col gap-4 mt-2">
          <h3 className="font-bold text-sm text-gray-900 uppercase tracking-widest px-1">Movimientos Recientes</h3>
          
          {transactions.length > 0 ? (
            <div className="flex flex-col gap-3">
              {transactions.map((t) => (
                <div key={t.id} className="bg-white p-4 rounded-2xl border border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      t.type === 'expense' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {t.type === 'expense' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-800 tracking-tight">{t.description}</span>
                      <span className="text-[10px] font-medium text-gray-400">{new Date(t.date).toLocaleDateString('es-GT')}</span>
                    </div>
                  </div>
                  <span className={`text-sm font-black font-mono ${t.type === 'expense' ? 'text-gray-900' : 'text-emerald-600'}`}>
                    {t.type === 'expense' ? '-' : '+'} Q{t.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 border-dashed text-center">
              <span className="text-sm font-bold text-gray-400 text-center block leading-relaxed">No hay movimientos registrados para esta cuenta hoy.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
