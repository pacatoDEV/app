import React from 'react';
import { Ticket, AppConfig } from '../types';
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  Printer,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  tickets: Ticket[];
  config: AppConfig;
}

export function Dashboard({ tickets, config }: DashboardProps) {
  const stats = [
    { label: 'Total Hoje', value: tickets.filter(t => new Date(t.criadoEm).toDateString() === new Date().toDateString()).length, icon: TrendingUp, color: 'text-brand', bg: 'bg-brand/10' },
    { label: 'Total Geral', value: tickets.length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Pausas Hoje', value: 0, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Alertas', value: 0, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  const categoryStats = [
    { label: 'Geral', count: tickets.filter(t => t.tipo === 'Geral').length, icon: FileText },
    { label: 'Impressoras', count: tickets.filter(t => t.tipo === 'Impressoras').length, icon: Printer },
    { label: 'Reset Senha', count: tickets.filter(t => t.tipo === 'Reset Senha').length, icon: ShieldCheck },
    { label: 'Portal Pessoas', count: tickets.filter(t => t.tipo === 'Portal Pessoas').length, icon: UserCheck },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tight mb-2 text-slate-800 dark:text-white">Olá, Colaborador</h2>
          <p className="text-[var(--muted)] text-lg font-medium">{config.logoDesc}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Sistema Online
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-auto gap-4 md:h-[600px]">
        {/* Big Volume Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="md:col-span-2 md:row-span-2 card-style flex flex-col justify-between overflow-hidden relative group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
            <TrendingUp size={180} />
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">Estatísticas</span>
            </div>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white leading-tight mb-4">Volume por Categoria</h3>
            <p className="text-[var(--muted)] font-medium mb-8">Acompanhamento em tempo real das demandas enviadas pelo Service Desk.</p>
            
            <div className="grid grid-cols-2 gap-3">
              {categoryStats.map((cat) => (
                <div key={cat.label} className="p-4 rounded-2xl bg-[var(--field-bg)] border border-[var(--panel-border)] flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                    <cat.icon size={20} />
                  </div>
                  <div className="text-left">
                    <div className="text-xl font-black">{cat.count}</div>
                    <div className="text-[10px] uppercase font-black text-[var(--muted)]">{cat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button className="btn-primary w-fit mt-8">Ver Relatório Completo</button>
        </motion.div>

        {/* Info Card 1: Hoje */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-1 md:row-span-1 card-style bg-brand text-white border-none shadow-xl shadow-brand/20 flex flex-col justify-between p-8"
        >
          <h3 className="text-lg font-bold">Chamados Hoje</h3>
          <p className="text-white/70 text-sm mt-1">Produtividade diária</p>
          <div className="text-6xl font-black mt-4 tracking-tighter">
            {stats[0].value}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
            <TrendingUp size={14} />
            <span>+12% vs Ontem</span>
          </div>
        </motion.div>

        {/* Info Card 2: Geral */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.2 }}
           className="md:col-span-1 md:row-span-1 card-style flex flex-col justify-between"
        >
          <div className="text-[var(--muted)] text-[10px] font-black uppercase tracking-widest mb-1">Base Total</div>
          <div className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter">{stats[1].value}</div>
          <div className="mt-4 h-1.5 w-full bg-[var(--field-bg)] rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-3/4" />
          </div>
          <div className="text-[10px] text-[var(--muted)] mt-2 italic font-medium">Sinconizado com localDB</div>
        </motion.div>

        {/* Large Productivity CTA */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
           className="md:col-span-2 md:row-span-1 card-style bg-slate-900 border-none flex items-center justify-between p-8"
        >
          <div className="space-y-1">
            <h3 className="text-white font-black text-2xl">Pesquisa AI Ativa</h3>
            <p className="text-slate-400 text-sm font-medium">Consulte a base de conhecimento inteligente.</p>
          </div>
          <div className="flex -space-x-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-brand/20 flex items-center justify-center text-brand font-bold text-xs">AI</div>
            ))}
            <div className="w-12 h-12 rounded-full border-4 border-slate-900 bg-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-lg">+</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
