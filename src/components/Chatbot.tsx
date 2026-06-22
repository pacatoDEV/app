import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { chatWithAssistant } from '../services/chatbotService';
import { Ticket } from '../types';
import { cn } from '../lib/utils';

interface ChatbotProps {
  tickets: Ticket[];
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export function Chatbot({ tickets }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await chatWithAssistant(userMessage, history, tickets);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={cn(
              "bg-[var(--panel)] border border-[var(--panel-border)] shadow-2xl rounded-3xl overflow-hidden flex flex-col mb-4",
              isMinimized ? "w-72 h-14" : "w-96 h-[550px]"
            )}
          >
            {/* Header */}
            <div className="p-4 bg-brand text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <span className="font-bold">Assistente SD</span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--field-bg)]/20"
                >
                  {messages.length === 0 && (
                    <div className="text-center py-8 space-y-2">
                      <div className="w-12 h-12 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bot size={24} />
                      </div>
                      <p className="text-sm font-bold">Olá! Como posso ajudar?</p>
                      <p className="text-[10px] text-[var(--muted)] uppercase tracking-widest font-black">Eu conheço seu histórico de chamados</p>
                    </div>
                  )}
                  {messages.map((m, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "flex gap-3",
                        m.role === 'user' ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                        m.role === 'user' ? "bg-slate-700 text-white" : "bg-brand text-white"
                      )}>
                        {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                      </div>
                      <div className={cn(
                        "p-3 rounded-2xl text-sm max-w-[80%] leading-relaxed",
                        m.role === 'user' 
                          ? "bg-brand text-white rounded-tr-none shadow-lg shadow-brand/10" 
                          : "bg-[var(--panel)] border border-[var(--panel-border)] rounded-tl-none"
                      )}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center animate-pulse">
                        <Bot size={14} />
                      </div>
                      <div className="p-3 bg-[var(--panel)] border border-[var(--panel-border)] rounded-2xl rounded-tl-none">
                        <Loader2 size={16} className="animate-spin text-brand" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 border-t border-[var(--panel-border)] bg-[var(--panel)]">
                  <div className="flex gap-2">
                    <input 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Pergunte algo..."
                      className="flex-1 bg-[var(--field-bg)] border border-[var(--field-border)] px-4 py-2 rounded-xl text-sm outline-none focus:border-brand transition-all"
                    />
                    <button 
                      type="submit" 
                      disabled={!input.trim() || loading}
                      className="btn-primary p-2 w-10 h-10 shrink-0"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => {
          setIsOpen(!isOpen);
          setIsMinimized(false);
        }}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 active:scale-95 group",
          isOpen ? "bg-slate-800" : "bg-brand"
        )}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />}
        {!isOpen && (
           <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-bounce" />
        )}
      </button>
    </div>
  );
}
