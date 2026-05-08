/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Target, TrendingUp, Calendar, ArrowRight, CircleDashed } from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_GOALS } from '../mockData';

export default function GoalsView() {
  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="flex justify-between items-center mt-2">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Metas</h2>
        <button className="bg-blue-600 text-white p-2 rounded-full shadow-lg shadow-blue-100">
           <Target className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-20">
        {MOCK_GOALS.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          return (
            <motion.div 
              key={goal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4 relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className="text-base font-black text-gray-900 tracking-tight leading-none">{goal.name}</span>
                  <div className={`flex items-center gap-1 ${goal.status === 'active' ? 'text-blue-600' : 'text-gray-400'}`}>
                    <CircleDashed className={`w-3 h-3 ${goal.status === 'active' ? 'animate-spin-slow' : ''}`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{goal.status === 'active' ? 'En Curso' : 'Pendiente'}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xl font-black text-gray-900 font-mono">Q{goal.targetAmount.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Objetivo Final</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-gray-400">Progreso Actual</span>
                  <span className="text-blue-600">Q{goal.currentAmount.toLocaleString()} ({progress.toFixed(0)}%)</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-blue-600 rounded-full"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                 <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-[10px] font-medium text-gray-400 italic">Meta: {new Date(goal.deadline).toLocaleDateString('es-GT', { month: 'long', year: 'numeric' })}</span>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Aporte Sugerido</span>
                    <span className="text-xs font-black text-emerald-600 font-mono">+Q{goal.suggestedContribution}/mes</span>
                 </div>
              </div>

              <button className="mt-2 w-full bg-gray-50 hover:bg-gray-100 text-gray-500 py-3 rounded-2xl text-xs font-bold transition-colors flex items-center justify-center gap-2 active:scale-95">
                Registrar Aporte <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
        <h3 className="font-bold text-gray-900 text-sm">Otras Inspiraciones</h3>
        <ul className="flex flex-col gap-3">
          {['Irme a vivir solo', 'Salud Contigo', 'Vender Tacoma'].map((item, i) => (
            <li key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-200 group-hover:bg-blue-600" />
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">{item}</span>
              </div>
              <button className="text-[10px] font-bold text-blue-600 uppercase hover:underline">Activar Meta</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
