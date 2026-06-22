import React, { useState } from 'react';
import { Ticket, TicketType } from '../types';
import { 
  FileText, 
  Printer, 
  ShieldCheck, 
  UserCheck, 
  PhoneMissed,
  Plus,
  Trash2,
  Copy,
  Save,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';
import * as Tooltip from '@radix-ui/react-tooltip';

interface TicketFormsProps {
  onSave: (ticket: Ticket) => void;
}

export function TicketForms({ onSave }: TicketFormsProps) {
  const [ticketType, setTicketType] = useState<TicketType>('Geral');
  const [formData, setFormData] = useState<Partial<Ticket>>({
    chamado: '',
    nome: '',
    descricao: '',
    hospital: '',
    cpf: '',
    ip: '',
    setor: '',
    telefone: '',
    operacao: '',
    erro: '',
    motivo: '',
    login: ''
  });

  const types = [
    { id: 'Geral', label: 'Geral', icon: FileText },
    { id: 'Impressoras', label: 'Impressoras', icon: Printer },
    { id: 'Reset Senha', label: 'Reset Senha', icon: ShieldCheck },
    { id: 'Portal Pessoas', label: 'Portal Pessoas', icon: UserCheck },
    { id: 'MFA Reset', label: 'MFA Reset', icon: ShieldCheck },
    { id: 'Ligação Engano', label: 'Engano', icon: PhoneMissed },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const generateOutput = () => {
    const o = formData;
    switch (ticketType) {
      case 'Geral':
        return `🔹 TIPO: Chamado Geral\n👤 Nome: ${o.nome || '—'}\n🪪 CPF: ${o.cpf || '—'}\n📍 Centro de Custo: ${o.hospital || '—'}\n📍 Setor: ${o.setor || '—'}\n💻 IP/Host: ${o.ip || '—'}\n\n📝 Descrição:\n${o.descricao || '—'}`;
      case 'Impressoras':
        return `🔹 TIPO: Impressoras\n👤 Nome: ${o.nome || '—'}\n📍 Centro de Custo: ${o.hospital || '—'}\n🖨️ IP/Host: ${o.ip || '—'}\n⚙️ Modelo: ${o.marca_modelo || '—'}\n\n📝 Descrição:\n${o.descricao || '—'}`;
      case 'Reset Senha':
        return `🔹 TIPO: Reset de Senha / Acesso\nSISTEMA: Reset Dasa\n\n👤 Solicitante: ${o.nome || '—'}\n📞 Telefone/Ramal: ${o.telefone || '—'}\n📍 Centro de Custo: ${o.operacao || '—'}\n\n📝 Detalhes:\n${o.descricao || 'Solicitação de reset de senha padrão.'}`;
      case 'Portal Pessoas':
        return `🔹 TIPO: Incidente - Portal Pessoas\n⚠️ ERRO: ${o.erro || 'Não especificado'}\n\n👤 Colaborador: ${o.nome || '—'}\n🪪 CPF/Matrícula: ${o.cpf || '—'}\n📍 Centro de Custo: ${o.operacao || '—'}\n\n📝 Mais Informações:\n${o.descricao || '—'}`;
      case 'MFA Reset':
        return `🔹 TIPO: Reset de MFA (Autenticador)\n⚙️ MOTIVO: ${o.motivo}\n\n👤 Colaborador: ${o.nome || '—'}\n📧 Login/Email: ${o.login || '—'}\n📞 Telefone de Contato: ${o.telefone || '—'}\n\n📝 Mais Informações:\n${o.descricao || '—'}`;
      case 'Ligação Engano':
        return `🔹 TIPO: Ligação Engano / Orientação\n⚙️ ASSUNTO: ${o.motivo}\n\n👤 Solicitante: ${o.nome || '—'}\n📞 Ramal/Telefone: ${o.telefone || '—'}\n📍 Centro de Custo: ${o.hospital || '—'}\n\n📝 Mais Informações/Orientações passadas:\n${o.descricao || '—'}`;
      default:
        return '';
    }
  };

  const copyToClipboard = () => {
    const text = generateOutput();
    navigator.clipboard.writeText(text);
    toast.success('Texto copiado!');
  };

  const handleSave = () => {
    if (!formData.chamado) {
      toast.error('Informe o número do chamado!');
      return;
    }
    const ticket: Ticket = {
      id: Date.now(),
      chamado: formData.chamado!,
      tipo: ticketType,
      criadoEm: new Date().toISOString(),
      nome: formData.nome || 'Anônimo',
      ...formData
    };
    onSave(ticket);
    setFormData({
      chamado: '',
      nome: '',
      descricao: '',
      hospital: '',
      cpf: '',
      ip: '',
      setor: '',
      telefone: '',
      operacao: '',
      erro: '',
      motivo: '',
      login: ''
    });
  };

  return (
    <Tooltip.Provider>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2 space-y-6">
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <button
              key={type.id}
              onClick={() => setTicketType(type.id as TicketType)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                ticketType === type.id 
                  ? "bg-brand text-white border-brand shadow-lg shadow-brand/20" 
                  : "bg-[var(--panel)] text-[var(--muted)] border-[var(--panel-border)] hover:border-brand/50"
              )}
            >
              <type.icon size={16} />
              {type.label}
            </button>
          ))}
        </div>

        <div className="card-style">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="md:col-span-1">
                <label htmlFor="chamado">Número do Chamado *</label>
                <input id="chamado" value={formData.chamado} onChange={handleInputChange} className="input-style" placeholder="Ex: INC-12345" />
             </div>
             <div className="md:col-span-1">
                <label htmlFor="nome">Nome do Solicitante</label>
                <input id="nome" value={formData.nome} onChange={handleInputChange} className="input-style" placeholder="Nome Completo" />
             </div>

              {ticketType === 'Geral' && (
                <>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <label htmlFor="cpf" className="mb-0">CPF</label>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <button type="button" className="text-[var(--muted)] hover:text-brand transition-colors focus:outline-none"><HelpCircle size={14} /></button>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content className="px-3 py-1.5 bg-slate-900 text-white text-[10px] rounded shadow-xl animate-in fade-in zoom-in-95" sideOffset={5}>
                            Formato: 000.000.000-00
                            <Tooltip.Arrow className="fill-slate-900" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </div>
                    <input id="cpf" value={formData.cpf} onChange={handleInputChange} className="input-style" placeholder="000.000.000-00" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <label htmlFor="ip" className="mb-0">IP / Hostname</label>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <button type="button" className="text-[var(--muted)] hover:text-brand transition-colors focus:outline-none"><HelpCircle size={14} /></button>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content className="px-3 py-1.5 bg-slate-900 text-white text-[10px] rounded shadow-xl animate-in fade-in zoom-in-95" sideOffset={5}>
                            Ex: 10.12.34.56 ou SRV-APP-01
                            <Tooltip.Arrow className="fill-slate-900" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </div>
                    <input id="ip" value={formData.ip} onChange={handleInputChange} className="input-style" placeholder="10.x.x.x" />
                  </div>
                  <div><label htmlFor="hospital">Centro de Custo</label><input id="hospital" value={formData.hospital} onChange={handleInputChange} className="input-style" placeholder="Ex: Hospital Brasília" /></div>
                  <div><label htmlFor="setor">Setor</label><input id="setor" value={formData.setor} onChange={handleInputChange} className="input-style" placeholder="Ex: UTI" /></div>
                </>
              )}

             {ticketType === 'Impressoras' && (
               <>
                 <div><label htmlFor="hospital">Centro de Custo</label><input id="hospital" value={formData.hospital} onChange={handleInputChange} className="input-style" /></div>
                 <div><label htmlFor="ip">IP da Impressora</label><input id="ip" value={formData.ip} onChange={handleInputChange} className="input-style" /></div>
                 <div><label htmlFor="marca_modelo">Marca / Modelo</label><input id="marca_modelo" value={formData.marca_modelo} onChange={handleInputChange} className="input-style" placeholder="Ex: HP LaserJet" /></div>
               </>
             )}

             {ticketType === 'Reset Senha' && (
               <>
                 <div><label htmlFor="telefone">Telefone / Ramal</label><input id="telefone" value={formData.telefone} onChange={handleInputChange} className="input-style" /></div>
                 <div><label htmlFor="operacao">Centro de Custo</label><input id="operacao" value={formData.operacao} onChange={handleInputChange} className="input-style" /></div>
               </>
             )}

             {ticketType === 'Portal Pessoas' && (
               <>
                 <div><label htmlFor="cpf">CPF / Matrícula</label><input id="cpf" value={formData.cpf} onChange={handleInputChange} className="input-style" /></div>
                 <div><label htmlFor="operacao">Centro de Custo</label><input id="operacao" value={formData.operacao} onChange={handleInputChange} className="input-style" /></div>
                 <div className="md:col-span-2"><label htmlFor="erro">Erro Apresentado</label><input id="erro" value={formData.erro} onChange={handleInputChange} className="input-style" /></div>
               </>
             )}

             {ticketType === 'MFA Reset' && (
               <>
                 <div><label htmlFor="login">Login / E-mail</label><input id="login" value={formData.login} onChange={handleInputChange} className="input-style" /></div>
                 <div><label htmlFor="telefone">Telefone</label><input id="telefone" value={formData.telefone} onChange={handleInputChange} className="input-style" /></div>
                 <div className="md:col-span-2">
                    <label htmlFor="motivo">Motivo</label>
                    <select id="motivo" value={formData.motivo} onChange={handleInputChange} className="input-style">
                      <option value="">Selecione...</option>
                      <option value="Troca de aparelho">Troca de aparelho</option>
                      <option value="Desinstalou o app">Desinstalou o app</option>
                      <option value="Não recebe código">Não recebe código</option>
                    </select>
                 </div>
               </>
             )}

             <div className="md:col-span-2">
                <label htmlFor="descricao">Descrição / Detalhes</label>
                <textarea id="descricao" value={formData.descricao} onChange={handleInputChange} className="input-style min-h-[150px]" placeholder="Relate o ocorrido..." />
             </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card-style bg-brand/5 border-brand/20">
          <h3 className="text-sm font-black uppercase tracking-widest text-brand mb-4">Pré-visualização</h3>
          <div className="bg-[var(--field-bg)] border border-[var(--field-border)] rounded-xl p-4 font-mono text-xs whitespace-pre-wrap leading-relaxed min-h-[250px]">
            {generateOutput()}
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={copyToClipboard} className="btn-primary flex-1">
              <Copy size={18} />
              Copiar
            </button>
            <button onClick={handleSave} className="btn-secondary flex-1 border-brand/20 text-brand font-bold">
              <Save size={18} />
              Salvar
            </button>
          </div>
        </div>

        <div className="card-style bg-transparent border-dashed border-2 flex flex-col items-center justify-center py-12 text-center">
           <div className="w-16 h-16 rounded-full bg-[var(--panel-border)] flex items-center justify-center text-[var(--muted)] mb-4">
              <Plus size={32} />
           </div>
           <p className="text-sm text-[var(--muted)] px-8 font-medium">
             Os dados salvos serão armazenados apenas localmente no seu navegador.
           </p>
        </div>
      </div>
      </div>
    </Tooltip.Provider>
  );
}
