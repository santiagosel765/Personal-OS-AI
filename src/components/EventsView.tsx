/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CalendarDays, AlertCircle, CheckCircle2, History, Plus, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_EVENTS } from '../mockData';

export default function EventsView() {
  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="flex justify-between items-center mt-2">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Eventos</h2>
        <button className="bg-orange-500 text-white p-2 rounded-full shadow-lg shadow-orange-100">
           <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {MOCK_EVENTS.map((event) => {
          const diff = event.budgetedAmount - event.actualSpent;
          const isOver = diff < 0;

          return (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
            >
              <div className="p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${event.type === 'planned' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                      <CalendarDays className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-black text-gray-900 tracking-tight">{event.name}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                        {event.type === 'planned' ? 'Planificado' : 'Repentino (Inesperado)'}
                      </span>
                    </div>
                  </div>
                  {isOver ? (
                    <div className="bg-rose-50 text-rose-600 p-1.5 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="bg-emerald-50 text-emerald-600 p-1.5 rounded-lg">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Presupuesto</span>
                    <span className="text-base font-bold text-gray-800 font-mono">Q{event.budgetedAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gasto Real</span>
                    <span className={`text-base font-black font-mono ${isOver ? 'text-rose-600' : 'text-emerald-600'}`}>
                      Q{event.actualSpent.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className={`p-3 rounded-2xl flex items-center justify-between ${isOver ? 'bg-rose-50/50 text-rose-700 ring-1 ring-rose-100' : 'bg-emerald-50/50 text-emerald-700 ring-1 ring-emerald-100'}`}>
                  <span className="text-[10px] font-black uppercase tracking-tight">Estado</span>
                  <span className="text-xs font-bold uppercase tracking-tight">
                    {isOver ? `Q${Math.abs(diff).toFixed(2)} Sobre Presupuesto` : `Q${diff.toFixed(2)} Bajo Presupuesto`}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50/80 p-4 border-t border-gray-100 flex flex-col gap-3">
                 <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gastos Relacionados</span>
                    <History className="w-3 h-3 text-gray-300" />
                 </div>
                 <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-gray-100 shadow-xs">
                    <span className="text-xs font-bold text-gray-700 italic">Cena Restaurante</span>
                    <span className="text-xs font-black font-mono text-gray-900">Q300.00</span>
                 </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-3">
         <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Ideas de Próximos Eventos</h3>
         <div className="flex flex-col gap-2">
           {['Viaje a Antigua', 'Reparación Tacoma', 'Salida Fin de Semana'].map((idea, i) => (
             <button key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group active:scale-[0.99] transition-all">
                <span className="text-sm font-bold text-gray-800 tracking-tight">{idea}</span>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-colors" />
             </button>
           ))}
         </div>
      </div>
    </div>
  );
}
