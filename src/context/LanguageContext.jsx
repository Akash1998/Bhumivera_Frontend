import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  SUPPORTED_INDIAN_LANGUAGES,
  getCurrentLanguage,
  setLanguage as setEngineLanguage,
  t as getTranslation,
  translateDomNodes,
  activateFullSiteTranslation,
} from '../utils/indianLanguageEngine.js';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLangState] = useState(() => getCurrentLanguage());

  // Helper to change language globally
  const setLanguage = useCallback((langCode) => {
    const target = SUPPORTED_INDIAN_LANGUAGES.some((l) => l.code === langCode) ? langCode : 'en';
    setCurrentLangState(target);
    setEngineLanguage(target);
    // Instant client-side DOM translation (immediate + after React render)
    translateDomNodes(target);
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => translateDomNodes(target));
      window.setTimeout(() => translateDomNodes(target), 80);
      window.setTimeout(() => translateDomNodes(target), 300);
    }
  }, []);

  // Listen to external language change events
  useEffect(() => {
    const handleLangChange = (e) => {
      if (e.detail?.lang && e.detail.lang !== currentLang) {
        setCurrentLangState(e.detail.lang);
        translateDomNodes(e.detail.lang);
      }
    };
    window.addEventListener('bhumivera:language-change', handleLangChange);
    return () => window.removeEventListener('bhumivera:language-change', handleLangChange);
  }, [currentLang]);

  // Initial translation on mount
  useEffect(() => {
    const initial = getCurrentLanguage();
    if (initial !== 'en') {
      translateDomNodes(initial);
      activateFullSiteTranslation(initial);
    }
  }, []);

  // Re-translate on route navigation
  useEffect(() => {
    if (currentLang !== 'en') {
      const handleNav = () => {
        window.setTimeout(() => translateDomNodes(currentLang), 100);
      };
      window.addEventListener('popstate', handleNav);
      return () => window.removeEventListener('popstate', handleNav);
    }
  }, [currentLang]);

  const t = useCallback(
    (key, fallback = '') => getTranslation(key, fallback, currentLang),
    [currentLang]
  );

  const activeLangMeta =
    SUPPORTED_INDIAN_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_INDIAN_LANGUAGES[0];

  const value = {
    currentLang,
    language: currentLang,
    setLanguage,
    t,
    activeLangMeta,
    supportedLanguages: SUPPORTED_INDIAN_LANGUAGES,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback if used outside Provider
    const lang = getCurrentLanguage();
    return {
      currentLang: lang,
      language: lang,
      setLanguage: setEngineLanguage,
      t: (key, fallback = '') => getTranslation(key, fallback, lang),
      activeLangMeta:
        SUPPORTED_INDIAN_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_INDIAN_LANGUAGES[0],
      supportedLanguages: SUPPORTED_INDIAN_LANGUAGES,
    };
  }
  return context;
}
