import React, { useState, useEffect, useRef } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function LanguageSelector({ variant = 'navbar', className = '' }) {
  const { currentLang, setLanguage, supportedLanguages, activeLangMeta } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (langCode) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  // Chat Concierge Header Variant (compact)
  if (variant === 'concierge') {
    return (
      <div className={`relative ${className}`} ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/15 transition-all shadow-sm"
          title="Select Indian Language"
          aria-label="Select Language"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{activeLangMeta.nativeName}</span>
          <ChevronDown className="w-3 h-3 opacity-70" />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[#071911] border border-[#D4AF37]/40 shadow-2xl py-2 z-50 text-white max-h-72 overflow-y-auto">
            <div className="px-3 py-1.5 text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold border-b border-white/10">
              Indian Languages (भारतीय भाषाएं)
            </div>
            {(supportedLanguages || []).map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => handleSelect(l.code)}
                className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs hover:bg-white/10 transition-colors ${
                  l.code === currentLang ? 'text-[#D4AF37] font-bold bg-[#D4AF37]/10' : 'text-stone-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{l.flag}</span>
                  <div>
                    <div className="font-medium">{l.nativeName}</div>
                    <div className="text-[9px] opacity-60">{l.name}</div>
                  </div>
                </div>
                {l.code === currentLang && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Navbar Desktop & Mobile Variant
  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full border border-[#dedfd4] bg-white px-3 py-2 text-xs font-semibold text-[#14251c] shadow-sm hover:border-[#526b4d] transition-all"
        title="Switch Language / भाषा बदलें"
        aria-label="Language Selector"
      >
        <Globe className="w-3.5 h-3.5 text-[#526b4d]" />
        <span className="font-bold">{activeLangMeta.flag} {activeLangMeta.nativeName}</span>
        <ChevronDown className="w-3 h-3 text-stone-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white border border-[#e8dcc4] shadow-2xl py-2 z-50 text-[#14251c] max-h-80 overflow-y-auto">
          <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-[#526b4d] font-bold border-b border-[#dedfd4]/60">
            Select Language · भाषा चुनें
          </div>
          {(supportedLanguages || []).map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => handleSelect(l.code)}
              className={`w-full px-4 py-2.5 text-left flex items-center justify-between text-xs hover:bg-[#f4f1e9] transition-colors ${
                l.code === currentLang ? 'text-[#0B2419] font-bold bg-[#e8eedd]' : 'text-stone-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{l.flag}</span>
                <div>
                  <div className="font-semibold">{l.nativeName}</div>
                  <div className="text-[10px] text-stone-500">{l.name} · {l.region}</div>
                </div>
              </div>
              {l.code === currentLang && <Check className="w-4 h-4 text-emerald-700" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
