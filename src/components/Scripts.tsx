import React from 'react';
import { Terminal, Download, HardDrive, Info, Settings2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function Scripts() {
  const downloadBat = (type: 'limpeza' | 'info' | 'spooler') => {
    let code = "@echo off\n";
    let name = "script.bat";
    
    if (type === 'limpeza') {
      name = "Limpeza_Sonda.bat";
      code += "echo Limpando arquivos temporarios...\ndel /s /f /q %temp%\\*.*\nipconfig /flushdns\necho Concluido!\npause";
    } else if (type === 'info') {
      name = "InfoRede_Sonda.bat";
      code += "ipconfig /all > %USERPROFILE%\\Desktop\\InfoRede.txt\nhostname >> %USERPROFILE%\\Desktop\\InfoRede.txt\necho Informativo salvo na Area de Trabalho!\npause";
    } else if (type === 'spooler') {
      name = "Spooler_Sonda.bat";
      code += "net stop spooler\ndel /Q /F /S \"%systemroot%\\System32\\Spool\\Printers\\*.*\"\nnet start spooler\necho Spooler Reiniciado!\npause";
    }

    const blob = new Blob([code], { type: "application/bat" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    toast.success(`${name} gerado!`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Scripts de Manutenção</h2>
        <p className="text-[var(--muted)]">Gere arquivos .bat para auxiliar nos atendimentos remotos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { id: 'limpeza', title: 'Limpeza Profunda', desc: 'Limpa arquivos temporários e efetua flush de DNS.', icon: Settings2, color: 'text-brand' },
          { id: 'info', title: 'Coleta de Info', desc: 'Gera log com IP e Hostname na área de trabalho.', icon: Info, color: 'text-emerald-500' },
          { id: 'spooler', title: 'Reset Spooler', desc: 'Reinicia o serviço de impressão e limpa fila.', icon: Terminal, color: 'text-amber-500' },
        ].map((s) => (
          <div key={s.id} className="card-style flex flex-col justify-between group hover:border-brand/50 transition-all">
            <div>
              <div className={cn("w-12 h-12 rounded-xl bg-current/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110", s.color)}>
                 <s.icon size={24} />
              </div>
              <h3 className="font-bold mb-2">{s.title}</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed mb-6">{s.desc}</p>
            </div>
            <button onClick={() => downloadBat(s.id as any)} className="btn-secondary w-full justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider">
               <Download size={14} />
               Baixar .bat
            </button>
          </div>
        ))}
      </div>

      <div className="card-style border-brand/20 bg-brand/[0.02]">
        <div className="flex items-start gap-4">
           <div className="p-3 bg-brand/10 text-brand rounded-xl">
              <HardDrive size={24} />
           </div>
           <div className="flex-1">
              <h3 className="font-bold mb-4">Requisitos Ideais de Hardware (DASA)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 {[
                   { label: 'Processador', value: 'Core i3+ (6ª Gen)' },
                   { label: 'Memória RAM', value: '8GB DDR4+' },
                   { label: 'S.O.', value: 'Windows 10/11 x64' },
                   { label: 'Armazenamento', value: 'SSD 240GB+' },
                 ].map((req) => (
                   <div key={req.label} className="p-3 rounded-lg bg-[var(--field-bg)] border border-[var(--field-border)]">
                      <p className="text-[10px] uppercase font-black tracking-widest text-[var(--muted)] mb-1">{req.label}</p>
                      <p className="text-sm font-bold">{req.value}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

import { cn } from '../lib/utils';
