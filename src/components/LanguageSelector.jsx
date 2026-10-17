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

  // INLINE VARIANT FOR MOBILE SIDEBAR & DRAWERS (NEVER OVERFLOWS OFF-SCREEN!)
  if (variant === 'inline') {
    return (
      <div className={`w-full ${className}`}>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <span className="flex items-center gap-2 text-xs font-bold text-[#d4af37]">
            <Globe className="w-4 h-4 text-[#d4af37]" /> Select Language · भाषा
          </span>
          <span className="text-[10px] text-[#94a3b8] uppercase tracking-wider">
            {activeLangMeta?.nativeName}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto pr-1">
          {(supportedLanguages || []).map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => handleSelect(l.code)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all text-left ${
                l.code === currentLang
                  ? 'bg-[#d4af37] text-[#0c1712] font-bold shadow-md'
                  : 'bg-white/5 border border-white/10 text-[#cbd5e1] hover:bg-white/10'
              }`}
            >
              <span className="text-sm shrink-0">{l.flag}</span>
              <div className="min-w-0 flex-1 truncate">
                <span className="block truncate font-medium">{l.nativeName}</span>
              </div>
              {l.code === currentLang && <Check className="w-3.5 h-3.5 text-[#0c1712] shrink-0" />}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Chat Concierge Header Variant (compact)
  if (variant === 'concierge') {
    return (
      <div className={`relative ${className}`} ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold border border-[#d4af37]/50 text-[#d4af37] hover:bg-[#d4af37]/15 transition-all shadow-sm"
          title="Select Indian Language"
          aria-label="Select Language"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{activeLangMeta.nativeName}</span>
          <ChevronDown className="w-3 h-3 opacity-70" />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[#0c1712] border border-[#d4af37]/40 shadow-2xl py-2 z-50 text-white max-h-72 overflow-y-auto">
            <div className="px-3 py-1.5 text-[9px] uppercase tracking-widest text-[#d4af37] font-bold border-b border-white/10">
              Indian Languages (भारतीय भाषाएं)
            </div>
            {(supportedLanguages || []).map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => handleSelect(l.code)}
                className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs hover:bg-white/10 transition-colors ${
                  l.code === currentLang ? 'text-[#d4af37] font-bold bg-[#d4af37]/15' : 'text-[#cbd5e1]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{l.flag}</span>
                  <div>
                    <div className="font-medium">{l.nativeName}</div>
                    <div className="text-[9px] text-[#94a3b8]">{l.name}</div>
                  </div>
                </div>
                {l.code === currentLang && <Check className="w-3.5 h-3.5 text-[#d4af37]" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Navbar Desktop Variant (with smart max-height and luxury palette)
  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full border border-[#dedfd4] bg-white px-3 py-2 text-xs font-semibold text-[#14251c] shadow-sm hover:border-[#d4af37] transition-all"
        title="Switch Language / भाषा बदलें"
        aria-label="Language Selector"
      >
        <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
        <span className="font-bold">{activeLangMeta.flag} {activeLangMeta.nativeName}</span>
        <ChevronDown className="w-3 h-3 text-stone-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-[#0c1712] border border-[#d4af37]/40 shadow-2xl py-2 z-50 text-white max-h-72 overflow-y-auto">
          <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-[#d4af37] font-bold border-b border-white/10">
            Select Language · भाषा चुनें
          </div>
          {(supportedLanguages || []).map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => handleSelect(l.code)}
              className={`w-full px-4 py-2.5 text-left flex items-center justify-between text-xs hover:bg-white/10 transition-colors ${
                l.code === currentLang ? 'text-[#d4af37] font-bold bg-[#d4af37]/15' : 'text-[#cbd5e1]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{l.flag}</span>
                <div>
                  <div className="font-semibold">{l.nativeName}</div>
                  <div className="text-[10px] text-[#94a3b8]">{l.name} · {l.region}</div>
                </div>
              </div>
              {l.code === currentLang && <Check className="w-4 h-4 text-[#d4af37]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
