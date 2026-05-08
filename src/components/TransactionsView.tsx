/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownRight, CalendarDays } from 'lucide-react';
import { MOCK_TRANSACTIONS } from '../mockData';

export default function TransactionsView() {
  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="flex justify-between items-center mt-2">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Actividad</h2>
        <div className="flex gap-2">
          <button className="bg-white p-2 rounded-xl text-gray-400 border border-gray-100 shadow-sm">
            <Search className="w-5 h-5" />
          </button>
          <button className="bg-white p-2 rounded-xl text-gray-400 border border-gray-100 shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-gray-900 p-6 rounded-3xl text-white shadow-xl flex flex-col gap-1 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gastado esta semana</span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black">Q828.00</span>
          <span className="text-xs font-medium text-gray-500">de Q1,000</span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full mt-4">
          <div className="w-[82%] h-full bg-blue-500 rounded-full" />
        </div>
      </div>

      <div className="flex flex-col gap-6 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <CalendarDays className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">7 de Mayo, 2026</span>
        </div>

        <div className="flex flex-col gap-3">
          {MOCK_TRANSACTIONS.map((t) => (
            <div key={t.id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  t.type === 'expense' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {t.type === 'expense' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800 tracking-tight">{t.description}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{t.category}</span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full" />
                    <span className="text-[10px] font-bold text-blue-600 uppercase">{t.account}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-sm font-black font-mono ${t.type === 'expense' ? 'text-gray-900' : 'text-emerald-600'}`}>
                  {t.type === 'expense' ? '-' : '+'} Q{t.amount.toFixed(2)}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-400 font-bold uppercase">{t.method}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <button className="text-sm font-bold text-blue-600 hover:underline">Cargar más transacciones</button>
      </div>
    </div>
  );
}
