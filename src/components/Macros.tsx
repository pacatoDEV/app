import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Copy, Trash2, Search, Filter } from 'lucide-react';
import { Macro } from '../types';
import { getFromLocalStorage, saveToLocalStorage } from '../lib/storage';
import { toast } from 'react-hot-toast';

export function Macros() {
  const defaultMacros: Macro[] = [
    { titulo: "Saudação Chat", texto: "Olá! Meu nome é [NOME] e serei responsável pelo seu atendimento. Em que posso auxiliá-lo?" },
    { titulo: "Transferência RH", texto: "A TI Dasa não realiza atendimentos relacionados ao RH (11) 4040-2850. Pedimos, por gentileza, que o chamado seja aberto na categoria correta." },
    { titulo: "Falta de Contato", texto: "Por falta de contato, informamos que este chat será encerrado. Caso a situação persista, solicito que entre em contato novamente." },
  ];

  const [macros, setMacros] = useState<Macro[]>([]);
  const [newMacro, setNewMacro] = useState({ titulo: '', texto: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const saved = getFromLocalStorage<Macro[]>('sonda_macros', defaultMacros);
    setMacros(saved);
  }, []);

  const addMacro = () => {
    if (!newMacro.titulo || !newMacro.texto) return toast.error('Preencha título e texto!');
    const updated = [newMacro, ...macros];
    setMacros(updated);
    saveToLocalStorage('sonda_macros', updated);
    setNewMacro({ titulo: '', texto: '' });
    toast.success('Macro salva!');
  };

  const deleteMacro = (index: number) => {
    if (confirm('Deseja excluir esta macro?')) {
      const updated = macros.filter((_, i) => i !== index);
      setMacros(updated);
      saveToLocalStorage('sonda_macros', updated);
      toast.success('Macro removida');
    }
  };

  const copyMacro = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Texto copiado!');
  };

  const filteredMacros = macros.filter(m => 
    m.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.texto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <div className="card-style border-brand/20 bg-brand/5">
              <h3 className="font-bold flex items-center gap-2 mb-4">
                 <Plus size={18} className="text-brand" />
                 Nova Macro
              </h3>
              <div className="space-y-4">
                 <div>
                    <label>Título do Script</label>
                    <input 
                      value={newMacro.titulo} 
                      onChange={(e) => setNewMacro({ ...newMacro, titulo: e.target.value })}
                      className="input-style" 
                      placeholder="Ex: Encerramento" 
                    />
                 </div>
                 <div>
                    <label>Texto / Resposta</label>
                    <textarea 
                      value={newMacro.texto} 
                      onChange={(e) => setNewMacro({ ...newMacro, texto: e.target.value })}
                      className="input-style min-h-[150px]" 
                      placeholder="Cole aqui o texto padrão..." 
                    />
                 </div>
                 <button onClick={addMacro} className="btn-primary w-full justify-center">Salvar Script</button>
              </div>
           </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="card-style p-4 flex gap-4">
             <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar scripts..." 
                  className="input-style pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {filteredMacros.map((m, i) => (
                <div key={i} className="card-style group border-l-4 border-l-brand hover:border-brand/40 transition-all">
                   <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-brand">{m.titulo}</h4>
                      <button onClick={() => deleteMacro(i)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Trash2 size={16} />
                      </button>
                   </div>
                   <div className="bg-[var(--field-bg)] border border-[var(--field-border)] p-3 rounded-lg text-xs leading-relaxed mb-4 line-clamp-4 text-[var(--muted)]">
                      {m.texto}
                   </div>
                   <button onClick={() => copyMacro(m.texto)} className="btn-secondary w-full text-xs font-bold gap-2">
                      <Copy size={14} />
                      Copiar Script
                   </button>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
