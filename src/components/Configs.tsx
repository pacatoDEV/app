import React from 'react';
import { AppConfig } from '../types';
import { Palette, Type, Layout, RefreshCw, Sparkles } from 'lucide-react';
import { saveToLocalStorage } from '../lib/storage';
import { toast } from 'react-hot-toast';

interface ConfigsProps {
  config: AppConfig;
  onUpdate: (config: AppConfig) => void;
}

export function Configs({ config, onUpdate }: ConfigsProps) {
  const handleChange = (key: keyof AppConfig, value: string) => {
    const newConfig = { ...config, [key]: value };
    onUpdate(newConfig);
    saveToLocalStorage('sonda_config', newConfig);
  };

  const resetConfig = () => {
    if (confirm('Restaurar configurações padrões?')) {
      const defaultCfg = {
        brandColor: '#005dfa',
        logoText: 'SONDA',
        logoSub: 'Service Desk',
        logoDesc: 'Gerenciador de Chamados'
      };
      onUpdate(defaultCfg);
      saveToLocalStorage('sonda_config', defaultCfg);
      toast.success('Padrões restaurados');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Personalização visual</h2>
        <p className="text-[var(--muted)]">Ajuste o visual do painel conforme sua preferência ou unidade.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card-style space-y-6">
           <div className="flex items-center gap-3 mb-2 font-bold text-brand">
              <Type size={18} />
              <span>Identidade Visual</span>
           </div>
           
           <div>
              <label>Nome Principal (Logo)</label>
              <input 
                value={config.logoText} 
                onChange={(e) => handleChange('logoText', e.target.value)}
                className="input-style" 
              />
           </div>
           <div>
              <label>Subtítulo</label>
              <input 
                value={config.logoSub} 
                onChange={(e) => handleChange('logoSub', e.target.value)}
                className="input-style" 
              />
           </div>
           <div>
              <label>Descrição Curta</label>
              <input 
                value={config.logoDesc} 
                onChange={(e) => handleChange('logoDesc', e.target.value)}
                className="input-style" 
              />
           </div>
        </div>

        <div className="card-style space-y-6">
           <div className="flex items-center gap-3 mb-2 font-bold text-emerald-500">
              <Sparkles size={18} />
              <span>Inteligência Artificial</span>
           </div>
           
           <div className="space-y-4">
              <div>
                <label>Google Gemini API Key</label>
                <div className="flex gap-2">
                  <input 
                    type="password"
                    placeholder="Insira sua chave API pública"
                    value={config.customApiKey || ''} 
                    onChange={(e) => handleChange('customApiKey', e.target.value)}
                    className="input-style flex-1" 
                  />
                  <button 
                    onClick={() => toast.success('Configuração de IA atualizada!')}
                    className="btn-primary px-4 py-2 shrink-0 bg-emerald-600 hover:bg-emerald-700"
                  >
                    Salvar
                  </button>
                </div>
                <p className="mt-2 text-[10px] text-[var(--muted)] leading-relaxed italic">
                  Sua chave é salva apenas localmente neste navegador. Deixe em branco para usar a chave padrão do sistema.
                </p>
              </div>
           </div>
        </div>

        <div className="card-style space-y-6">
           <div className="flex items-center gap-3 mb-2 font-bold text-amber-500">
              <Palette size={18} />
              <span>Esquema de Cores</span>
           </div>
           
           <div>
              <label>Cor Principal (Brand)</label>
              <div className="flex gap-4 items-center">
                 <input 
                  type="color"
                  value={config.brandColor} 
                  onChange={(e) => handleChange('brandColor', e.target.value)}
                  className="w-20 h-10 rounded-lg cursor-pointer bg-transparent border-none" 
                 />
                 <span className="font-mono text-sm uppercase">{config.brandColor}</span>
              </div>
              <p className="mt-2 text-xs text-[var(--muted)]">Esta cor será aplicada em botões, links e detalhes principais.</p>
           </div>

           <div className="pt-6 border-t border-[var(--panel-border)]">
              <button onClick={resetConfig} className="btn-secondary w-full justify-center gap-2 text-xs font-black uppercase tracking-widest text-[#ef4444]">
                 <RefreshCw size={14} />
                 Restaurar Padrão
              </button>
           </div>
        </div>
      </div>

      <div className="card-style bg-brand/5 border-brand/20 p-8 flex flex-col items-center justify-center text-center">
         <h3 className="text-xl font-bold mb-4">Exportar Meus Dados</h3>
         <p className="text-sm text-[var(--muted)] max-w-lg mb-8">
            Como os dados são locais, se você limpar o cache do navegador ou trocar de máquina, perderá o histórico. Exporte um backup para se prevenir.
         </p>
         <button className="btn-primary px-12">
            Backup Total (.json)
         </button>
      </div>
    </div>
  );
}
