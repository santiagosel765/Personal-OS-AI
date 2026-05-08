/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Plus, ArrowLeftRight, Wallet, ShieldCheck, Heart, Landmark } from 'lucide-react';
import { motion } from 'motion/react';
import { MOCK_ACCOUNTS } from '../mockData';
import { formatQ, sumByType } from '../lib/finance';

interface AccountsViewProps {
  onAccountClick: (id: string) => void;
}

export default function AccountsView({ onAccountClick }: AccountsViewProps) {
  const disponibleEnCuentas = sumByType(MOCK_ACCOUNTS, 'available');
  const reservado = sumByType(MOCK_ACCOUNTS, 'reserved');

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'available': return 'Disponible';
      case 'reserved': return 'Reservado (⚠️ No Tocar)';
      case 'emergency': return 'Fondo de Emergencia';
      case 'savings': return 'Ahorro';
      default: return 'Cuenta';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'available': return <Wallet className="w-5 h-5 text-blue-600" />;
      case 'reserved': return <ShieldCheck className="w-5 h-5 text-amber-600" />;
      case 'emergency': return <Heart className="w-5 h-5 text-rose-600" />;
      case 'savings': return <Landmark className="w-5 h-5 text-emerald-600" />;
      default: return <Wallet className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="flex justify-between items-center mt-2">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Cuentas</h2>
        <button className="bg-gray-100 p-2 rounded-full text-gray-500">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {MOCK_ACCOUNTS.map((account) => (
          <motion.button 
            key={account.id}
            onClick={() => onAccountClick(account.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4 text-left w-full hover:border-blue-100 transition-colors"
          >
            <div className="flex justify-between items-start w-full">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-gray-50`}>
                  {getIcon(account.type)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800">{account.name}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    account.type === 'reserved' ? 'text-amber-600' : 'text-gray-400'
                  }`}>
                    {getTypeLabel(account.type)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                 <span className="text-xl font-black text-gray-900 font-mono">Q{account.balance.toLocaleString()}</span>
                 <span className="text-[10px] text-gray-400 font-medium tracking-tight">Saldo actualizado hoy</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <button className="mt-4 w-full bg-blue-600 text-white p-4 rounded-3xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 group active:scale-95 transition-all">
        <ArrowLeftRight className="w-5 h-5 transition-transform group-hover:rotate-180" />
        Registrar Transferencia
      </button>

      <div className="bg-gray-100 p-6 rounded-3xl border border-gray-200 border-dashed flex flex-col gap-2 text-center">
        <span className="text-sm font-bold text-gray-400">
          Disponible en cuentas: <span className="text-gray-600">{formatQ(disponibleEnCuentas)}</span>
        </span>
        <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">
          Reservado: {formatQ(reservado)} · No tocar
        </span>
      </div>
    </div>
  );
}
