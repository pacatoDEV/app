import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  BookOpen, 
  Terminal, 
  MessageSquare, 
  Clock, 
  Settings,
  Search,
  ChevronRight,
  Share2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AppConfig } from '../types';
import { toast } from 'react-hot-toast';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  config: AppConfig;
}

export function Sidebar({ activeTab, setActiveTab, config }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tickets', label: 'Abrir Chamado', icon: FileText },
    { id: 'history', label: 'Histórico', icon: History },
    { id: 'search', label: 'Soluções AI', icon: Search },
    { id: 'divider-1', type: 'divider', label: 'Ferramentas' },
    { id: 'macros', label: 'Scripts/Modelos', icon: MessageSquare },
    { id: 'scripts', label: 'Manutenção .bat', icon: Terminal },
    { id: 'resources', label: 'Recursos', icon: BookOpen },
    { id: 'pausas', label: 'Controle de Pausa', icon: Clock },
    { id: 'divider-2', type: 'divider', label: 'Sistema' },
    { id: 'configs', label: 'Configurações', icon: Settings },
  ];

  return (
    <aside className="w-64 h-full bg-[var(--panel)] border-r border-[var(--panel-border)] flex flex-col z-20 shadow-lg">
      <div className="p-8">
        <div className="flex flex-col gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <div className="w-6 h-6 bg-white rounded-lg rotate-45" />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tight text-slate-800 dark:text-white leading-none mb-1">{config.logoText}</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">{config.logoSub}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 pb-8 space-y-1">
        {menuItems.map((item) => {
          if (item.type === 'divider') {
            return (
              <div key={item.id} className="px-4 py-2 mt-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]/50">
                  {item.label}
                </span>
              </div>
            );
          }

          const Icon = item.icon!;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-brand/10 text-brand font-bold shadow-sm" 
                  : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--panel-border)]/30"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={cn("transition-colors", isActive ? "text-brand" : "group-hover:text-brand")} />
                <span className="text-sm">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={14} className="animate-in fade-in slide-in-from-left-2" />}
            </button>
          );
        })}
      </nav>

    <div className="p-4 border-t border-[var(--panel-border)] bg-[var(--bg)]/30 space-y-3">
        <button 
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link da aplicação copiado!');
          }}
          className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-indigo-600/20 hover:bg-indigo-600 hover:text-white transition-all"
        >
          <Share2 size={14} />
          Compartilhar Link
        </button>

        <div className="p-3 rounded-xl bg-[var(--panel-border)]/50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Status</p>
            <p className="text-[11px] font-black text-[var(--text)]">Sistema Online</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
