/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TicketForms } from './components/TicketForms';
import { History } from './components/History';
import { Resources } from './components/Resources';
import { Scripts } from './components/Scripts';
import { Macros } from './components/Macros';
import { Pausas } from './components/Pausas';
import { SolutionSearch } from './components/SolutionSearch';
import { Configs } from './components/Configs';
import { Chatbot } from './components/Chatbot';
import { Ticket, TicketType, AppConfig } from './types';
import { getFromLocalStorage, saveToLocalStorage } from './lib/storage';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { Search } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [config, setConfig] = useState<AppConfig>({
    brandColor: '#4f46e5',
    logoText: 'SONDA',
    logoSub: 'Service Desk',
    logoDesc: 'Gerenciador de Chamados'
  });
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setActiveTab('search');
        searchButtonRef.current?.focus();
      }
      if (e.altKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setActiveTab('history');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--brand', config.brandColor);
  }, [config.brandColor]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('sonda_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const addTicket = (ticket: Ticket) => {
    const newTickets = [ticket, ...tickets];
    setTickets(newTickets);
    saveToLocalStorage('sonda_tickets', newTickets);
    toast.success('Chamado salvo no histórico!');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard tickets={tickets} config={config} />;
      case 'tickets': return <TicketForms onSave={addTicket} />;
      case 'history': return <History tickets={tickets} onUpdate={setTickets} />;
      case 'resources': return <Resources />;
      case 'scripts': return <Scripts />;
      case 'macros': return <Macros />;
      case 'pausas': return <Pausas />;
      case 'search': return <SolutionSearch />;
      case 'configs': return <Configs config={config} onUpdate={setConfig} />;
      default: return <Dashboard tickets={tickets} config={config} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} config={config} />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 px-8 flex items-center justify-between border-b border-[var(--panel-border)] bg-[var(--panel)]/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
             <button 
              ref={searchButtonRef}
              onClick={() => setActiveTab('search')}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--field-bg)] border border-[var(--field-border)] text-[var(--muted)] hover:text-[var(--text)] transition-colors group focus:ring-2 focus:ring-brand focus:outline-none"
             >
               <Search size={16} className="group-hover:text-brand" />
               <span className="text-sm">Pesquisar soluções...</span>
               <kbd className="text-[10px] bg-[var(--panel-border)] px-1.5 rounded ml-2 opacity-50">Alt + S</kbd>
             </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[var(--panel-border)] transition-colors"
              title="Trocar Tema"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold text-xs ring-2 ring-brand/10">
              SD
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Chatbot tickets={tickets} />

      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: 'var(--panel)',
          color: 'var(--text)',
          border: '1px solid var(--panel-border)',
        }
      }} />
    </div>
  );
}
