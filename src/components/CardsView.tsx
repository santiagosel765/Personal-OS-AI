/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CreditCard as CardIcon, AlertTriangle, ShieldOff, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_CARDS } from '../mockData';

export default function CardsView() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-black uppercase">Activa</span>;
      case 'blocked': return <span className="bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded text-[10px] font-black uppercase">Bloqueada</span>;
      case 'pending_cancellation': return <span className="bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded text-[10px] font-black uppercase">Por Cancelar</span>;
      case 'cancelled': return <span className="bg-gray-50 text-gray-400 border border-gray-100 px-2 py-0.5 rounded text-[10px] font-black uppercase">Cancelada</span>;
      default: return null;
    }
  };

  const getCardStyle = (id: string) => {
    switch (id) {
      case 'promerica': return 'from-emerald-900 to-emerald-700';
      case 'bam_oro': return 'from-amber-600 to-amber-500';
      case 'bam_blanca': return 'from-gray-300 to-gray-100';
      case 'amex_bac': return 'from-blue-900 to-blue-700';
      default: return 'from-gray-800 to-gray-600';
    }
  };

  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="flex justify-between items-center mt-2">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Tarjetas</h2>
        <button className="bg-gray-100 p-2 rounded-full text-gray-500">
           <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {MOCK_CARDS.map((card) => (
          <motion.div 
            key={card.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-4"
          >
            {/* Visual Card */}
            <div className={`w-full aspect-[1.6/1] bg-gradient-to-br ${getCardStyle(card.id)} rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between text-white border border-white/10`}>
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                   <span className="text-xs font-bold opacity-60 uppercase tracking-widest">{card.name}</span>
                   <span className="text-[10px] font-mono opacity-40">•••• •••• •••• 1234</span>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-xl backdrop-blur-sm flex items-center justify-center">
                  <CardIcon className="w-5 h-5" />
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest leading-none mb-1">Monto para Limpiar</span>
                <span className="text-3xl font-black font-mono">Q{(card.revolvingBalance + card.principalBalance).toLocaleString()}</span>
              </div>

              {card.status === 'blocked' && (
                <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                  <div className="bg-white/90 px-4 py-2 rounded-2xl flex items-center gap-2 transform -rotate-3 shadow-lg">
                    <ShieldOff className="w-4 h-4 text-rose-600" />
                    <span className="text-xs font-black text-gray-900 uppercase tracking-tighter">NO USAR</span>
                  </div>
                </div>
              )}
            </div>

            {/* Info and Actions */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-center">
                 <div className="flex flex-col gap-1">
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Estado Actual</span>
                   {getStatusBadge(card.status)}
                 </div>
                 <div className="flex flex-col items-end gap-1 text-right">
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Límite</span>
                   <span className="text-sm font-bold text-gray-900 font-mono">Q{card.limit.toLocaleString()}</span>
                 </div>
              </div>

              {card.actionRequired && (
                <div className="bg-blue-50/50 p-4 rounded-2xl flex items-start gap-3 ring-1 ring-blue-50">
                  <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-blue-900 uppercase tracking-tight">Acción Recomendada</span>
                    <p className="text-xs text-blue-800 font-medium leading-tight">{card.actionRequired}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                 <button className="flex-1 bg-gray-900 text-white py-3 rounded-2xl text-xs font-black uppercase tracking-tight active:scale-95 transition-transform">
                   Registrar Pago
                 </button>
                 <button className="w-14 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center active:scale-95 transition-transform">
                   <MoreHorizontal className="w-5 h-5" />
                 </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
