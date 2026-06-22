export type TicketType = 'Geral' | 'Impressoras' | 'Reset Senha' | 'Portal Pessoas' | 'MFA Reset' | 'Ligação Engano';

export interface Ticket {
  id: number;
  chamado: string;
  tipo: TicketType;
  criadoEm: string;
  nome: string;
  hospital?: string;
  operacao?: string;
  setor?: string;
  cpf?: string;
  ip?: string;
  descricao?: string;
  marca_modelo?: string;
  telefone?: string;
  erro?: string;
  motivo?: string;
  login?: string;
  status?: string;
}

export interface Macro {
  titulo: string;
  texto: string;
}

export interface LogPausa {
  id: number;
  data: string;
  tipoPausa: string;
  inicio: string;
  fim: string;
  status: 'Em Andamento' | 'Concluída no Tempo' | 'Interrompida (Manual)';
}

export interface AppConfig {
  brandColor: string;
  logoText: string;
  logoSub: string;
  logoDesc: string;
  customApiKey?: string;
}
