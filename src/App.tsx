/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowLeftRight, 
  CreditCard as CardIcon, 
  Target, 
  Settings,
  PlusCircle,
  History,
  AlertCircle,
  TrendingUp,
  CalendarDays
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

// Views (Components to be created)
import Dashboard from './components/Dashboard';
import AccountsView from './components/AccountsView';
import TransactionsView from './components/TransactionsView';
import DebtsView from './components/DebtsView';
import CardsView from './components/CardsView';
import GoalsView from './components/GoalsView';
import EventsView from './components/EventsView';
import QuickRegister from './components/QuickRegister';
import AccountDetailView from './components/AccountDetailView';

type ViewType = 'dashboard' | 'accounts' | 'transactions' | 'debts' | 'cards' | 'goals' | 'events' | 'register' | 'settings' | 'account-detail';

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Inicio' },
    { id: 'accounts', icon: Wallet, label: 'Cuentas' },
    { id: 'register', icon: PlusCircle, label: 'Registrar', highlight: true },
    { id: 'transactions', icon: History, label: 'Historial' },
    { id: 'goals', icon: Target, label: 'Metas' },
  ];

  const handleAccountClick = (id: string) => {
    setSelectedAccountId(id);
    setActiveView('account-detail');
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard onNavigate={setActiveView} />;
      case 'accounts': return <AccountsView onAccountClick={handleAccountClick} />;
      case 'transactions': return <TransactionsView />;
      case 'debts': return <DebtsView />;
      case 'cards': return <CardsView />;
      case 'goals': return <GoalsView />;
      case 'events': return <EventsView />;
      case 'account-detail': return <AccountDetailView accountId={selectedAccountId!} onBack={() => setActiveView('accounts')} />;
      case 'register': return <QuickRegister onComplete={() => setActiveView('dashboard')} />;
      case 'settings': return <div className="p-8 text-center pt-24">Configuración pronto...</div>;
      default: return <Dashboard onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-md mx-auto relative overflow-hidden shadow-2xl ring-1 ring-gray-200">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">P</div>
          <h1 className="font-bold text-lg tracking-tight">Personal OS</h1>
        </div>
        <button 
          onClick={() => setActiveView('settings')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-500" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as ViewType)}
            className={`flex flex-col items-center gap-1 transition-all ${
              item.highlight 
                ? 'bg-blue-600 p-3 rounded-full -mt-10 shadow-lg text-white' 
                : activeView === item.id 
                  ? 'text-blue-600' 
                  : 'text-gray-400'
            }`}
          >
            <item.icon className={item.highlight ? 'w-6 h-6' : 'w-5 h-5'} />
            {!item.highlight && <span className="text-[10px] font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
}

