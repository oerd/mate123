'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (theme: ThemeMode) => void;
  currentTheme: 'light' | 'dark';
}

const VALID_THEMES: ThemeMode[] = ['dark', 'light', 'system'];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return mode;
}

function getInitialThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem('themeMode') as ThemeMode | null;
  return saved && VALID_THEMES.includes(saved) ? saved : 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(getInitialThemeMode);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'dark';
    return resolveTheme(getInitialThemeMode());
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    if (themeMode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const resolved = mediaQuery.matches ? 'dark' : 'light';
      setCurrentTheme(resolved);
    };

    handleChange();
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
