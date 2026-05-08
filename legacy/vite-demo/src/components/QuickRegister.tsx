/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  PlusCircle, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Loader2,
  Trash2,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuickRegisterProps {
  onComplete: () => void;
}

export default function QuickRegister({ onComplete }: QuickRegisterProps) {
  const [input, setInput] = useState('');
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);

  const handleInterpret = () => {
    if (!input.trim()) return;
    
    setIsInterpreting(true);
    // Simulate AI Latency
    setTimeout(() => {
      // Mock Interpretation Logic
      if (input.toLowerCase().includes('gasté')) {
        setParsedData({
          type: 'Gasto',
          amount: 'Q28.00',
          category: 'Comida',
          subCategory: 'Almuerzo',
          account: 'BI (Banco Ind.)',
          method: 'Efectivo',
          necessary: true,
          confidence: 96,
          original: input
        });
      } else if (input.toLowerCase().includes('moví') || input.toLowerCase().includes('pagué')) {
        setParsedData({
          type: 'Transferencia / Pago',
          amount: 'Q500.00',
          category: 'Servicios',
          account: 'BI → BAC',
          method: 'Transferencia',
          necessary: true,
          confidence: 92,
          original: input
        });
      } else {
        setParsedData({
          type: 'Gasto',
          amount: 'Q?.??',
          category: 'Otros',
          account: 'Desconocido',
          method: 'Efectivo',
          necessary: true,
          confidence: 60,
          original: input
        });
      }
      setIsInterpreting(false);
    }, 1500);
  };

  const handleConfirm = () => {
    // Reset and close
    setParsedData(null);
    setInput('');
    onComplete();
  };

  return (
    <div className="p-4 flex flex-col gap-6 pt-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Registro <span className="text-blue-600 italic">IA</span></h2>
        <p className="text-sm text-gray-400 font-medium leading-relaxed uppercase tracking-widest">Habla con tu sistema personal</p>
      </div>

      {/* Input Area */}
      <div className="relative group">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ej: Gasté Q28 en almuerzo efectivo BI..."
          className="w-full h-40 p-5 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all text-lg font-medium placeholder:text-gray-200 resize-none"
        />
        <div className="absolute bottom-4 right-4 flex gap-2">
          {input && (
            <button 
              onClick={() => setInput('')}
              className="p-3 bg-gray-100 text-gray-400 hover:text-gray-600 rounded-2xl transition-colors"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          )}
          <button 
            disabled={!input || isInterpreting}
            onClick={handleInterpret}
            className={`p-3 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
              !input || isInterpreting ? 'bg-gray-100 text-gray-300' : 'bg-blue-600 text-white active:scale-95 shadow-blue-200'
            }`}
          >
            {isInterpreting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Result Cards */}
      <AnimatePresence>
        {parsedData && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="flex flex-col gap-4"
          >
            <div className="bg-white border-2 border-blue-600 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
               {/* Confidence Badge */}
               <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-xl text-[10px] font-black uppercase tracking-tighter">
                IA Confianza: {parsedData.confidence}%
              </div>

              <div className="flex flex-col gap-5 mt-2">
                <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Interpretación</span>
                    <span className="text-2xl font-black text-gray-900">{parsedData.amount}</span>
                  </div>
                  <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-blue-100">
                    {parsedData.type}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Categoría</span>
                    <span className="text-sm font-bold text-gray-800">{parsedData.category}</span>
                    {parsedData.subCategory && <span className="text-[10px] text-gray-400 font-medium">/ {parsedData.subCategory}</span>}
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Origen</span>
                    <span className="text-sm font-bold text-gray-800">{parsedData.account}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Método</span>
                    <span className="text-sm font-bold text-gray-800">{parsedData.method}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">¿Necesario?</span>
                    <span className={`text-sm font-bold ${parsedData.necessary ? 'text-blue-600' : 'text-rose-600'}`}>
                      {parsedData.necessary ? 'SÍ' : 'NO / IMPULSIVO'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={handleConfirm}
                    className="flex-1 bg-gray-900 border-2 border-gray-900 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <CheckCircle2 className="w-5 h-5" /> Confirmar
                  </button>
                  <button 
                    onClick={() => setParsedData(null)}
                    className="flex-shrink-0 bg-white border-2 border-gray-100 text-gray-400 w-14 rounded-2xl flex items-center justify-center active:scale-95 transition-transform"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <p className="text-[10px] text-center text-gray-400 font-medium italic">
              "Para Personal OS IA, esta es una decisión inteligente que respeta tu meta semanal de Q1,000."
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!parsedData && !isInterpreting && (
        <div className="flex flex-col gap-8 mt-4">
          <div className="flex flex-col gap-3">
             <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Ejemplos Rápidos</span>
             <div className="flex flex-wrap gap-2">
               {['Pagué Q500 internet BI', 'Compré pizza Q120 Cash', 'Moví Q1000 a BAC'].map(example => (
                 <button 
                   key={example}
                   onClick={() => setInput(example)}
                   className="text-xs bg-white border border-gray-100 px-3 py-2 rounded-xl text-gray-500 font-medium hover:border-blue-200 hover:text-blue-600 transition-colors"
                 >
                   {example}
                 </button>
               ))}
             </div>
          </div>
          
          <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-50 flex flex-col gap-3">
             <h4 className="text-sm font-bold text-blue-900">¿Cómo usarlo?</h4>
             <p className="text-xs text-blue-800/80 leading-relaxed font-medium">
               Simplemente escribe lo que hiciste de forma natural. La IA detectará montos, cuentas, categorías y si el gasto era necesario para tus metas actuales.
             </p>
          </div>
        </div>
      )}
    </div>
  );
}
