'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (theme: ThemeMode) => void;
  currentTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return mode;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('themeMode') as ThemeMode | null;
    if (savedTheme && ['dark', 'light', 'system'].includes(savedTheme)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThemeModeState(savedTheme);
    }
  }, []);

  useEffect(() => {
    const theme = resolveTheme(themeMode);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (themeMode === 'system') {
        const resolved = mediaQuery.matches ? 'dark' : 'light';
        setCurrentTheme(resolved);
        document.documentElement.setAttribute('data-theme', resolved);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  const setThemeMode = useCallback((newThemeMode: ThemeMode) => {
    setThemeModeState(newThemeMode);

    const theme = resolveTheme(newThemeMode);
    document.documentElement.setAttribute('data-theme', theme);
    setCurrentTheme(theme);

    localStorage.setItem('themeMode', newThemeMode);
  }, []);
    
  const contextValue = useMemo(() => ({
    themeMode,
    setThemeMode,
    currentTheme
  }), [themeMode, setThemeMode, currentTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
