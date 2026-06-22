import React, { useState } from 'react';
import { Ticket } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Search, 
  Filter, 
  Trash2, 
  ExternalLink, 
  MoreHorizontal,
  ChevronDown,
  Download,
  Calendar
} from 'lucide-react';
import { saveToLocalStorage } from '../lib/storage';
import { toast } from 'react-hot-toast';

interface HistoryProps {
  tickets: Ticket[];
  onUpdate: (tickets: Ticket[]) => void;
}

export function History({ tickets, onUpdate }: HistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Todos');

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.chamado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'Todos' || t.tipo === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const deleteTicket = (id: number) => {
    if (confirm('Tem certeza que deseja apagar este registro?')) {
      const newTickets = tickets.filter(t => t.id !== id);
      onUpdate(newTickets);
      saveToLocalStorage('sonda_tickets', newTickets);
      toast.success('Registro removido');
    }
  };

  const deleteHistory = () => {
    if (confirm('ATENÇÃO: Isso apagará TODO o histórico de chamados salvos. Continuar?')) {
      onUpdate([]);
      saveToLocalStorage('sonda_tickets', []);
      toast.success('Histórico limpo');
    }
  };

  const exportCSV = () => {
    if (tickets.length === 0) return toast.error('Nenhum dado para exportar');
    
    const headers = ['ID', 'Chamado', 'Tipo', 'Data', 'Nome', 'Descrição'];
    const rows = tickets.map(t => [
      t.id,
      t.chamado,
      t.tipo,
      format(new Date(t.criadoEm), 'dd/MM/yyyy HH:mm'),
      t.nome,
      (t.descricao || '').replace(/\n/g, ' ')
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + headers.join(',') + "\n"
      + rows.map(e => e.join(',')).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `historico_sonda_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Histórico Local</h2>
          <p className="text-sm text-[var(--muted)]">{tickets.length} chamados registrados</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="btn-secondary text-sm">
            <Download size={16} />
            Exportar CSV
          </button>
          <button onClick={deleteHistory} className="btn-danger text-sm bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white">
            <Trash2 size={16} />
            Limpar Tudo
          </button>
        </div>
      </div>

      <div className="card-style p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por chamado, nome ou tipo..." 
            className="input-style pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
           <select className="input-style" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
             <option value="Todos">Todas as Categorias</option>
             <option value="Geral">Geral</option>
             <option value="Impressoras">Impressoras</option>
             <option value="Reset Senha">Reset Senha</option>
             <option value="Portal Pessoas">Portal Pessoas</option>
             <option value="MFA Reset">MFA Reset</option>
           </select>
        </div>
      </div>

      <div className="card-style p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[var(--field-bg)] border-b border-[var(--panel-border)]">
              <tr>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-[var(--muted)]">Chamado</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-[var(--muted)]">Tipo</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-[var(--muted)]">Data/Hora</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-[var(--muted)]">Solicitante</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-[var(--muted)] text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--panel-border)]">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-[var(--field-bg)]/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-brand">{t.chamado}</div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="px-2 py-1 rounded-md bg-brand/10 text-brand text-[10px] font-black uppercase tracking-wider">
                         {t.tipo}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--muted)]">
                       <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {format(new Date(t.criadoEm), "dd MMM, HH:mm", { locale: ptBR })}
                       </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{t.nome}</td>
                    <td className="px-6 py-4">
                       <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 rounded-lg hover:bg-brand/10 text-brand" title="Ver Detalhes">
                            <ExternalLink size={18} />
                          </button>
                          <button onClick={() => deleteTicket(t.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500" title="Excluir">
                            <Trash2 size={18} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-[var(--muted)]">
                    Nenhum chamado encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
