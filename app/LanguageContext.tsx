'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Language } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: Readonly<{ children: ReactNode }>) {
  // Initialize with English, but check localStorage if available
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load saved language preference from localStorage if available
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage && ['en', 'de', 'it', 'fr', 'sq'].includes(savedLanguage)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    // Save to localStorage for persistence
    localStorage.setItem('language', newLanguage);
  };

  const contextValue = useMemo(() => ({ language, setLanguage }), [language]);

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
