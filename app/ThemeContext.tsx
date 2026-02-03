'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (theme: ThemeMode) => void;
  currentTheme: 'light' | 'dark'; // Actual applied theme
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark'); // Default to dark
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');

  // Function to determine current theme based on system preference
  const determineTheme = useCallback((): 'light' | 'dark' => {
    if (themeMode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return themeMode as 'light' | 'dark';
  }, [themeMode]);

  // Update theme when themeMode changes or when system preference changes
  useEffect(() => {
    // Load saved theme preference from localStorage
    const savedTheme = localStorage.getItem('themeMode') as ThemeMode | null;
    if (savedTheme && ['dark', 'light', 'system'].includes(savedTheme)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThemeModeState(savedTheme);
    }

    // Set up system preference change listener
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (themeMode === 'system') {
        setCurrentTheme(mediaQuery.matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', mediaQuery.matches ? 'dark' : 'light');
      }
    };

    // Apply theme based on current mode
    const theme = determineTheme();
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);

    // Listen for system preference changes
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode, determineTheme]);

  const setThemeMode = (newThemeMode: ThemeMode) => {
    setThemeModeState(newThemeMode);
    
    // If not system theme, apply directly
    if (newThemeMode !== 'system') {
      document.documentElement.setAttribute('data-theme', newThemeMode);
      setCurrentTheme(newThemeMode as 'light' | 'dark');
    } else {
      // If system theme, check system preference
      const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      setCurrentTheme(theme);
    }
    
    // Save to localStorage
    localStorage.setItem('themeMode', newThemeMode);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, currentTheme }}>
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
