/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Landmark, CreditCard, ChevronRight, Zap, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_DEBTS } from '../mockData';

export default function DebtsView() {
  const totalMonthlyDebt = MOCK_DEBTS.reduce((acc, curr) => acc + curr.monthlyQuota, 0);

  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="flex justify-between items-center mt-2">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Deudas Fijas</h2>
        <div className="bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
           <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">En Recuperación</span>
        </div>
      </div>

      <div className="bg-rose-600 p-6 rounded-3xl text-white shadow-xl flex flex-col gap-1 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10">
          <Landmark className="w-32 h-32 -mb-8 -mr-8" />
        </div>
        <span className="text-[10px] font-bold text-rose-100 uppercase tracking-widest">Cuota Mensual Total</span>
        <span className="text-3xl font-black font-mono">Q{totalMonthlyDebt.toLocaleString()}</span>
        <div className="flex justify-between items-end mt-4 pt-4 border-t border-rose-500/30">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-rose-200 uppercase tracking-widest leading-none">Próximo Pago</span>
            <span className="text-sm font-bold mt-1">15 de Mayo</span>
          </div>
          <button className="bg-white text-rose-600 px-4 py-2 rounded-2xl text-xs font-bold shadow-sm active:scale-95 transition-transform">
            Pagar Cuota
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-gray-900 text-sm px-1 uppercase tracking-widest">Desglose de Compromisos</h3>
        {MOCK_DEBTS.map((debt) => (
          <motion.div 
            key={debt.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4 relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${
              debt.priority === 'high' ? 'bg-rose-500' : debt.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
            }`} />
            
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gray-50">
                  <Landmark className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800 tracking-tight">{debt.name}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cuota: Q{debt.monthlyQuota}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                 <span className="text-sm font-black text-gray-900 font-mono">Q{debt.totalBalance.toLocaleString()}</span>
                 <span className="text-[10px] text-gray-400 font-medium tracking-tight">Saldo remanente</span>
              </div>
            </div>

            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl">
              <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Interés</span>
                 <span className="text-xs font-bold text-gray-800">{debt.interestRate}% <span className="text-[8px] font-normal text-gray-400">Anual</span></span>
              </div>
              <div className="flex gap-2">
                 <button className="bg-white border border-gray-200 text-gray-900 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight shadow-sm active:scale-95 transition-transform">
                   Abono Capital
                 </button>
                 <button className="bg-gray-900 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight shadow-sm active:scale-95 transition-transform">
                   Pagar
                 </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
