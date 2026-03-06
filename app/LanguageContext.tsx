'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { Language } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const VALID_LANGUAGES: Language[] = ['en', 'de', 'it', 'fr', 'sq'];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';

    // If user has explicitly chosen a language, use that
    const saved = localStorage.getItem('math-practice:language') as Language | null;
    if (saved && VALID_LANGUAGES.includes(saved)) return saved;

    // Otherwise, detect from browser's accepted languages
    for (const browserLang of navigator.languages ?? []) {
      const code = browserLang.split('-')[0] as Language;
      if (VALID_LANGUAGES.includes(code)) return code;
    }
    return 'en';
  });

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('math-practice:language', newLanguage);
  }, []);

  const contextValue = useMemo(() => ({ language, setLanguage }), [language, setLanguage]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
