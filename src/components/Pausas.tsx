import React, { useState, useEffect } from 'react';
import { Clock, Play, Square, AlertTriangle, List, Download, Trash2 } from 'lucide-react';
import { LogPausa } from '../types';
import { format } from 'date-fns';
import { getFromLocalStorage, saveToLocalStorage } from '../lib/storage';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';

export function Pausas() {
  const [activePausa, setActivePausa] = useState<LogPausa | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [logs, setLogs] = useState<LogPausa[]>([]);
  const [agenda, setAgenda] = useState({ p1: '', almoco: '', p2: '' });

  useEffect(() => {
    const savedLogs = getFromLocalStorage<LogPausa[]>('sonda_pausa_logs', []);
    setLogs(savedLogs);

    const savedAgenda = getFromLocalStorage('sonda_agenda', { p1: '', almoco: '', p2: '' });
    setAgenda(savedAgenda);

    // Recovery if page refreshed while taking break
    const lastPausa = savedLogs.find(l => l.status === 'Em Andamento');
    if (lastPausa) {
      // Calculate remaining time simplified logic for this applet
      setActivePausa(lastPausa);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activePausa && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && activePausa) {
      handlePausaEnd(true);
    }
    return () => clearInterval(interval);
  }, [activePausa, timeLeft]);

  const handlePausaStart = (minutos: number, tipo: string) => {
    if (activePausa) return toast.error('Já existe uma pausa em andamento!');

    const now = new Date();
    const newPausa: LogPausa = {
      id: Date.now(),
      data: format(now, 'dd/MM/yyyy'),
      tipoPausa: tipo,
      inicio: format(now, 'HH:mm'),
      fim: '--:--',
      status: 'Em Andamento'
    };

    setActivePausa(newPausa);
    setTimeLeft(minutos * 60);
    
    const newLogs = [...logs, newPausa];
    setLogs(newLogs);
    saveToLocalStorage('sonda_pausa_logs', newLogs);
    
    toast.success(`Pausa ${tipo} iniciada!`);
  };

  const handlePausaEnd = (onTime: boolean) => {
    if (!activePausa) return;

    const now = new Date();
    const newLogs = logs.map(l => {
      if (l.id === activePausa.id) {
        return {
          ...l,
          fim: format(now, 'HH:mm'),
          status: onTime ? 'Concluída no Tempo' : 'Interrompida (Manual)'
        } as LogPausa;
      }
      return l;
    });

    setLogs(newLogs);
    saveToLocalStorage('sonda_pausa_logs', newLogs);
    setActivePausa(null);
    setTimeLeft(0);
    
    if (onTime) {
      toast('⏰ Tempo esgotado! Retorne ao trabalho.', { icon: '👮‍♂️', duration: 10000 });
      new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3').play().catch(() => {});
    } else {
      toast.success('Pausa encerrada manualmente.');
    }
  };

  const exportCSV = () => {
    if (logs.length === 0) return toast.error('Nenhum dado para exportar');
    
    const headers = ['Data', 'Tipo', 'Início', 'Fim', 'Status'];
    const rows = logs.map(log => [
      log.data,
      log.tipoPausa,
      log.inicio,
      log.fim,
      log.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + headers.join(',') + "\n"
      + rows.map(e => e.map(val => `"${val}"`).join(',')).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `log_pausas_sonda_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success('Log exportado com sucesso!');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-style flex flex-col items-center justify-center text-center p-12 relative overflow-hidden">
           {activePausa && (
             <div className="absolute inset-0 bg-brand/5 animate-pulse" />
           )}
           
           <div className={cn(
             "text-7xl font-black font-mono mb-6 transition-colors",
             timeLeft < 60 && activePausa ? "text-red-500 animate-bounce" : "text-brand"
           )}>
              {activePausa ? formatTime(timeLeft) : '00:00'}
           </div>
           
           <p className="text-[var(--muted)] font-medium mb-8">
             {activePausa ? `Pausa: ${activePausa.tipoPausa}` : 'Nenhuma pausa ativa'}
           </p>

           <div className="flex gap-4">
              {!activePausa ? (
                <>
                  <button onClick={() => handlePausaStart(10, 'Curta A')} className="btn-secondary px-8">10m (A)</button>
                  <button onClick={() => handlePausaStart(10, 'Curta B')} className="btn-secondary px-8">10m (B)</button>
                  <button onClick={() => handlePausaStart(20, 'Almoço')} className="btn-primary px-8">Almoço (20m)</button>
                </>
              ) : (
                <button onClick={() => handlePausaEnd(false)} className="btn-danger px-12">
                   <Square size={20} fill="currentColor" />
                   Interromper
                </button>
              )}
           </div>
        </div>

        <div className="card-style bg-amber-500/5 border-amber-500/20">
           <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="text-amber-500" />
              <h3 className="font-bold">Agendar Lembretes de Ponto</h3>
           </div>
           <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'p1', label: 'Pausa Curta 1', icon: Clock },
                { id: 'almoco', label: 'Horário Almoço', icon: Clock },
                { id: 'p2', label: 'Pausa Curta 2', icon: Clock },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-[var(--field-bg)] border border-[var(--field-border)]">
                   <div className="flex items-center gap-3">
                      <item.icon size={18} className="text-amber-500" />
                      <span className="text-sm font-bold">{item.label}</span>
                   </div>
                   <input 
                    type="time" 
                    value={agenda[item.id as keyof typeof agenda]} 
                    onChange={(e) => {
                      const newAgenda = { ...agenda, [item.id]: e.target.value };
                      setAgenda(newAgenda);
                      saveToLocalStorage('sonda_agenda', newAgenda);
                    }}
                    className="bg-transparent border-none outline-none font-bold text-brand" 
                   />
                </div>
              ))}
           </div>
           <p className="mt-6 text-[10px] text-amber-500/70 font-bold uppercase tracking-widest text-center">
              Alertas automáticos 5 minutos antes do horário.
           </p>
        </div>
      </div>

      <div className="card-style p-0 overflow-hidden">
        <div className="p-6 border-b border-[var(--panel-border)] flex items-center justify-between">
           <div className="flex items-center gap-3">
              <List className="text-brand" />
              <h3 className="font-bold">Arquivo de Ponto / Log</h3>
           </div>
           <div className="flex items-center gap-4">
              <button onClick={exportCSV} className="flex items-center gap-1.5 text-xs text-brand font-bold hover:underline">
                <Download size={14} />
                Exportar CSV
              </button>
              <button onClick={() => setLogs([])} className="text-xs text-red-500 font-bold hover:underline">Limpar Log</button>
           </div>
        </div>
        <table className="w-full text-left text-sm">
           <thead className="bg-[var(--field-bg)]">
              <tr>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4 text-center">Início</th>
                <th className="px-6 py-4 text-center">Fim</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-[var(--panel-border)]">
              {logs.length > 0 ? (
                logs.slice().reverse().map(log => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 text-[var(--muted)]">{log.data}</td>
                    <td className="px-6 py-4 font-bold">{log.tipoPausa}</td>
                    <td className="px-6 py-4 text-center font-mono">{log.inicio}</td>
                    <td className="px-6 py-4 text-center font-mono">{log.fim}</td>
                    <td className="px-6 py-4 text-right px-6">
                       <span className={cn(
                         "px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider",
                         log.status === 'Em Andamento' ? 'bg-brand/10 text-brand' : 
                         log.status === 'Concluída no Tempo' ? 'bg-emerald-500/10 text-emerald-500' :
                         'bg-red-500/10 text-red-500'
                       )}>
                         {log.status}
                       </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="py-20 text-center text-[var(--muted)]">Nenhum registro de ponto ainda.</td></tr>
              )}
           </tbody>
        </table>
      </div>
    </div>
  );
}
