import React, { useState } from 'react';
import { Search, Sparkles, Send, Loader2, Copy, ExternalLink, BookOpen } from 'lucide-react';
import { searchSolutions } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

export function SolutionSearch() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult('');
    const solution = await searchSolutions(query);
    setResult(solution);
    setLoading(false);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    toast.success('Solução copiada!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-6 py-12 relative">
        <div className="absolute inset-0 bg-brand/5 blur-3xl -z-10 rounded-full" />
        <div className="w-24 h-24 bg-brand text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-brand/40 border-4 border-white dark:border-slate-800 rotate-12 group hover:rotate-0 transition-transform duration-500">
           <Sparkles size={48} />
        </div>
        <h2 className="text-5xl font-black tracking-tight text-slate-800 dark:text-white leading-tight">Como posso ajudar <br/> <span className="text-brand">você hoje?</span></h2>
        <p className="text-[var(--muted)] text-xl font-medium">Consulte a inteligência artificial para resoluções técnicas.</p>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <div className="absolute inset-0 bg-brand/10 blur-2xl rounded-3xl" />
        <div className="relative flex items-center bg-[var(--panel)] border-2 border-[var(--panel-border)] focus-within:border-brand rounded-2xl p-3 shadow-2xl shadow-brand/10 transition-all">
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Descreva o problema ou erro aqui..."
            className="flex-1 bg-transparent px-6 py-4 text-xl outline-none text-[var(--text)] font-medium"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-8 h-14 bg-brand text-white rounded-xl flex items-center justify-center hover:bg-brand-hover active:scale-95 transition-all disabled:opacity-50 font-bold"
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : <span>Pesquisar</span>}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           'Reset Dasa', 'Erro Sisqual', 'Freshservice DTI', 'MFA Login',
           'Sisqual WFM', 'Impressora Offline', 'Acesso NAV', 'Coupa Login'
         ].map((s) => (
           <button 
             key={s} 
             onClick={() => { setQuery(s); handleSearch(); }}
             className="px-5 py-4 rounded-2xl bg-[var(--panel)] border border-[var(--panel-border)] text-sm font-black text-[var(--muted)] hover:text-brand hover:border-brand hover:bg-brand/5 transition-all text-left group"
           >
             <span className="block mb-2 text-[10px] uppercase opacity-50">Sugestão</span>
             <div className="flex items-center justify-between">
                <span>{s}</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
             </div>
           </button>
         ))}
      </div>

      <AnimatePresence>
        {(loading || result) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="card-style min-h-[400px] flex flex-col"
          >
            <div className="flex items-center justify-between mb-8 border-b border-[var(--panel-border)] pb-4">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <BookOpen size={18} />
                  </div>
                  <span className="font-bold">Guia de Solução AI</span>
               </div>
               {result && (
                 <button onClick={copyResult} className="btn-secondary text-xs flex items-center gap-2">
                    <Copy size={14} />
                    Copiar
                 </button>
               )}
            </div>

            <div className="flex-1 overflow-auto">
               {loading ? (
                 <div className="h-full flex flex-col items-center justify-center gap-6 py-12">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles size={20} className="text-brand animate-pulse" />
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-xl font-bold text-slate-800 dark:text-white">Consultando base de conhecimento técnica...</p>
                      <p className="text-[var(--muted)] animate-pulse">Aguarde um instante, estamos processando sua solicitação.</p>
                    </div>
                 </div>
               ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="markdown-body p-4 text-[var(--text)] leading-relaxed">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-[var(--field-bg)]/50 border-t border-[var(--panel-border)] rounded-b-3xl">
                    <button 
                      onClick={copyResult}
                      className="btn-primary flex-1 py-3 text-sm"
                    >
                      <Copy size={16} />
                      Copiar Solução
                    </button>
                    <button 
                      onClick={() => {
                        const win = window.open('', '_blank');
                        if (win) {
                          win.document.write(`
                            <html>
                              <head>
                                <title>Solução Técnica - Sonda</title>
                                <style>
                                  body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 0 auto; }
                                  h1, h2, h3 { color: #4f46e5; }
                                  pre { background: #f1f5f9; padding: 16px; border-radius: 8px; overflow-x: auto; }
                                  blockquote { border-left: 4px solid #4f46e5; padding-left: 16px; font-style: italic; color: #64748b; }
                                </style>
                              </head>
                              <body>
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 40px;">
                                  <div style="background: #4f46e5; color: white; padding: 10px; border-radius: 8px; font-weight: bold;">SD</div>
                                  <div style="font-weight: 800; font-size: 20px; color: #4f46e5;">SONDA Service Desk</div>
                                </div>
                                ${result.replace(/\n/g, '<br/>')}
                              </body>
                            </html>
                          `);
                          win.document.close();
                        }
                      }}
                      className="btn-secondary flex-1 py-3 text-sm"
                    >
                      <ExternalLink size={16} />
                      Abrir em Nova Aba
                    </button>
                  </div>
                </motion.div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChevronRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
