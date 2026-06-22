import React from 'react';
import { Phone, ExternalLink, Mail, MapPin, Search } from 'lucide-react';

export function Resources() {
  const contacts = [
    { name: 'Balcão de Atendimento DASA', tel: '(11) 3126-6966' },
    { name: 'RH WhatsApp', tel: '(11) 4040-2850' },
    { name: 'NAV WhatsApp', tel: '(11) 3126-6908' },
    { name: 'TMLAB (Ciemon)', tel: '(11) 4195-2102' },
    { name: 'Service Desk Americas', tel: '(11) 5028-1737' },
    { name: 'Neovero / Dinamus', tel: '(81) 98107-1554' },
  ];

  const links = [
    { name: 'Freshservice Dasa', url: 'https://dasamedicinadiagnostica.freshservice.com/support/home' },
    { name: 'Coupa Dasa', url: 'https://dasa.coupahost.com/user/home' },
    { name: 'Conecta Dasa', url: 'https://conectadasa.mybeehome.com/login' },
    { name: 'Neovero', url: 'https://dasaep.neovero.com/' },
    { name: 'Universidade DASA', url: 'https://universidadedasa.com.br/login' },
    { name: 'Reset Dasa', url: 'https://reset.dasa.com.br' },
  ];

  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
            <Phone size={20} />
          </div>
          <h2 className="text-2xl font-bold">Contatos Úteis</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((c) => (
            <div key={c.name} className="card-style hover:border-brand/40 transition-all group">
              <p className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-2">{c.name}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-brand tracking-tight">{c.tel}</span>
                <button 
                  onClick={() => window.open(`tel:${c.tel.replace(/\D/g, '')}`, '_self')}
                  className="w-10 h-10 rounded-full bg-brand/5 text-brand flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Phone size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <ExternalLink size={20} />
          </div>
          <h2 className="text-2xl font-bold">Acesso Rápido a Sistemas</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.map((l) => (
            <button 
              key={l.name}
              onClick={() => window.open(l.url, '_blank')}
              className="card-style text-left hover:bg-brand/5 hover:border-brand/40 transition-all flex items-center justify-between group"
            >
              <div>
                <p className="font-bold mb-1">{l.name}</p>
                <p className="text-[10px] text-[var(--muted)] truncate max-w-[200px]">{l.url}</p>
              </div>
              <ExternalLink size={18} className="text-[var(--muted)] group-hover:text-brand transition-colors" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
