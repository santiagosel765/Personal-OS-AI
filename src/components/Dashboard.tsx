/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  TrendingUp, 
  Wallet, 
  Calendar, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Zap,
  ArrowRight,
  CalendarDays
} from 'lucide-react';
import { motion } from 'motion/react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
  colorClass: string;
  onClick?: () => void;
}

const MetricCard = ({ title, value, subtitle, icon, trend, colorClass, onClick }: MetricCardProps) => (
  <motion.button
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-3 text-left w-full relative overflow-hidden"
  >
    <div className={`w-10 h-10 rounded-2xl ${colorClass} flex items-center justify-center text-white`}>
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</span>
      <span className="text-xl font-bold text-gray-900">{value}</span>
      {subtitle && <span className="text-[10px] text-gray-400 font-medium">{subtitle}</span>}
      {trend && (
        <div className={`flex items-center gap-1 mt-1 ${trend.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trend.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          <span className="text-[10px] font-bold">{trend.value}</span>
        </div>
      )}
    </div>
  </motion.button>
);

export default function Dashboard({ onNavigate }: { onNavigate: (view: any) => void }) {
  const budgetProgress = 68; // Example: 680 spent out of 1000

  return (
    <div className="p-4 flex flex-col gap-6">
      {/* Saludo y Fecha */}
      <div className="flex flex-col mt-2">
        <span className="text-sm font-medium text-gray-400">Jueves, 7 de mayo de 2026</span>
        <h2 className="text-2xl font-bold text-gray-900 leading-tight">Hola, Personal OS AI 👋</h2>
      </div>

      {/* Main Alert */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-amber-50 border border-amber-100 p-4 rounded-3xl flex gap-3 items-start"
      >
        <div className="bg-amber-100 p-2 rounded-xl">
          <AlertCircle className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold text-amber-900">Alerta de Riesgo: Medio</span>
          <p className="text-xs text-amber-800 leading-relaxed">
            Te quedan **Q5,200** hasta el 29 de mayo. Mantén el ritmo de recuperación. No tocar Q4,300 reservados.
          </p>
        </div>
      </motion.div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard 
          title="Disponible Real" 
          value="Q5,200.00" 
          subtitle="Hasta el 29 de mayo"
          icon={<Wallet className="w-5 h-5" />} 
          colorClass="bg-blue-600"
          onClick={() => onNavigate('accounts')}
        />
        <MetricCard 
          title="Reservado" 
          value="Q4,300.00" 
          subtitle="BAM Oro Financiamientos"
          icon={<ShieldCheck className="w-5 h-5" />} 
          colorClass="bg-amber-500"
          onClick={() => onNavigate('accounts')}
        />
        <MetricCard 
          title="Deuda Mensual" 
          value="Q5,601.96" 
          subtitle="Fijo e Inevitable"
          icon={<Zap className="w-5 h-5" />} 
          colorClass="bg-rose-500"
          onClick={() => onNavigate('debts')}
        />
        <MetricCard 
          title="Próximo Ingreso" 
          value="Q2,400.00" 
          subtitle="15 de Mayo"
          icon={<Calendar className="w-5 h-5" />} 
          colorClass="bg-emerald-500"
        />
      </div>

      {/* Weekly Budget Progress */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Presupuesto Semanal</span>
            <span className="text-2xl font-black text-gray-900">Q680.00 <span className="text-sm font-normal text-gray-400">/ Q1,000</span></span>
          </div>
          <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${budgetProgress > 90 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
            {100 - budgetProgress}% Restante
          </div>
        </div>
        
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${budgetProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full ${budgetProgress > 90 ? 'bg-rose-500' : budgetProgress > 70 ? 'bg-amber-500' : 'bg-blue-600'}`}
          />
        </div>

        <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
          Vas bien. Has gastado el <span className="font-bold text-gray-700">{budgetProgress}%</span> de tu meta semanal. Evita salidas no planificadas hoy.
        </p>
      </div>

      {/* Cards Status Summary */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-gray-900">Tarjetas Críticas</h3>
          <button onClick={() => onNavigate('cards')} className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
            Ver todas <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-gradient-to-br from-indigo-800 to-indigo-600 rounded shadow-sm" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-800 tracking-tight">AMEX BAC</span>
                <span className="text-[10px] font-medium text-gray-400 italic">Meta: Dejar en cero</span>
              </div>
            </div>
            <span className="font-mono text-sm font-bold text-rose-600">Q8,750.00</span>
          </div>
          
          <div className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3 opacity-60">
              <div className="w-10 h-6 bg-gradient-to-br from-amber-600 to-amber-400 rounded shadow-sm" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-800 tracking-tight">BAM ORO</span>
                <span className="text-[10px] font-medium text-rose-600 font-bold uppercase">Bloqueada</span>
              </div>
            </div>
            <span className="font-mono text-sm font-bold text-gray-400">Q4,300.00</span>
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-2 gap-3 mb-10">
        <button 
          onClick={() => onNavigate('events')}
          className="bg-white p-4 rounded-3xl border border-gray-100 flex flex-col gap-3 group active:bg-gray-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 transition-transform group-active:scale-95">
            <CalendarDays className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-gray-800">Eventos</span>
        </button>
        <button 
          onClick={() => onNavigate('goals')}
          className="bg-white p-4 rounded-3xl border border-gray-100 flex flex-col gap-3 group active:bg-gray-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 transition-transform group-active:scale-95">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-gray-800">Metas</span>
        </button>
      </div>
    </div>
  );
}
