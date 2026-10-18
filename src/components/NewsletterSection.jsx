import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Shield, BellRing, Sparkles } from 'lucide-react';
import { newsletter as newsletterApi } from '../services/api';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setError('');
    try {
      await newsletterApi.subscribe(email, 'newsletter-section');
      setStatus('success');
      setEmail('');
    } catch (requestError) {
      setStatus('idle');
      setError(requestError.response?.data?.message || 'Could not subscribe right now. Please try again.');
    }
  };

  return (
    <section className="relative py-20 overflow-hidden bg-[#070a0e] border-y border-[#d4af37]/20">
      <div className="container relative z-10 mx-auto px-6">
        <div className="two-tone-panel-gold max-w-5xl mx-auto bg-[#0d1520] p-10 md:p-16 rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="font-sub-gold inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#070a0e] border border-[#d4af37]/40 text-[10px] tracking-widest mb-5">
                <Sparkles size={13} className="text-[#d4af37]" />
                Private Concierge Dispatch
              </div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl uppercase tracking-wider font-normal text-white leading-tight mb-4">
                <span className="font-headline-gold">Private Gazette</span>{' '}
                <span className="font-headline-silver">&amp; Harvest Bulletins</span>
              </h2>
              <div className="gold-hairline my-4 max-w-xs" />
              <p className="text-[#cbd5e1] text-xs sm:text-sm mb-6 leading-relaxed">
                Receive confidential notifications on small-batch seasonal harvests, compounding certificates, and private botanical access before public release.
              </p>
              
              <div className="space-y-3 font-mono text-xs text-[#cbd5e1]">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#070a0e] border border-[#d4af37]/40 flex items-center justify-center text-[#fce096]">
                    <CheckCircle2 size={15} />
                  </div>
                  <span>Small-Batch Harvest Priority Allocations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#070a0e] border border-[#d4af37]/40 flex items-center justify-center text-[#fce096]">
                    <BellRing size={15} />
                  </div>
                  <span>Laboratory Genuinity &amp; Formulation Briefs</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#070a0e] border border-[#d4af37]/40 flex items-center justify-center text-[#fce096]">
                    <Shield size={15} />
                  </div>
                  <span>Strict Confidentiality · One-Click Unsubscribe</span>
                </div>
              </div>
            </div>

            <div className="relative">
              {status === 'success' ? (
                <div className="bg-[#070a0e] border border-[#d4af37]/40 p-8 rounded-2xl text-center shadow-xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#d4af37] to-[#fce096] rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(212,175,55,0.4)]">
                    <CheckCircle2 size={32} className="text-black" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-2">Welcome to the Gazette</h3>
                  <p className="text-xs text-[#cbd5e1]">Your dossier has been recorded for upcoming artisanal harvests.</p>
                  <button 
                    onClick={() => setStatus('idle')} 
                    className="btn-silver-luxury mt-6 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-[#cbd5e1]"
                  >
                    Register Another Patron
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && <p role="alert" className="text-xs text-rose-300 font-mono">{error}</p>}
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#d4af37]">
                      <Mail size={20} />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="Enter your patron email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-16 pl-14 pr-6 bg-[#070a0e] border border-white/15 rounded-xl text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#d4af37] transition-all font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-gold-luxury w-full h-14 font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-white shadow-xl"
                  >
                    {status === 'loading' ? 'Encrypting & Recording...' : (
                      <>
                        <span>Join Private Inner Circle</span>
                        <Send size={15} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
