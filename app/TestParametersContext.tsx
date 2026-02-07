'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';

export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';
// Define all possible operations
export const allOperations: Operation[] = ['addition', 'subtraction', 'multiplication', 'division'];
export function operationLookup(operation: Operation): string {
  switch (operation) {
    case 'addition':
      return '+';
    case 'subtraction':
      return '-';
    case 'multiplication':
      return '×';
    case 'division':
      return '÷';
    default:
      return '+';
  }
}

export interface TestParameters {
  firstOperandMin: number;
  firstOperandMax: number;
  secondOperandMin: number;
  secondOperandMax: number;
  operations: Operation[];
  numberOfResults: number;
  sortResults: boolean;
}

interface TestParametersContextType {
  testParameters: TestParameters;
  setTestParameters: (params: TestParameters) => void;
  loadedFromUrl: boolean;
}

const defaultTestParameters: TestParameters = {
  firstOperandMin: 1,
  firstOperandMax: 10,
  secondOperandMin: 1,
  secondOperandMax: 10,
  operations: ['addition', 'subtraction'],
  numberOfResults: 6,
  sortResults: false
};

const TestParametersContext = createContext<TestParametersContextType | undefined>(undefined);

// Import the utility functions
import { deserializeSettings, hasSettingsParams } from './utils/settingsQueryString';
import { sanitizeParameters } from './utils/mathLogic';

export function TestParametersProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [testParameters, setTestParametersState] = useState<TestParameters>(defaultTestParameters);
  const [loadedFromUrl, setLoadedFromUrl] = useState<boolean>(false);

  useEffect(() => {
    // First check if we have settings in the URL
    if (typeof window !== 'undefined') {
      const queryString = window.location.search;
      
      if (hasSettingsParams(queryString)) {
        // Parse settings from query string
        const querySettings = deserializeSettings(queryString);
        
        const mergedSettings = sanitizeParameters({
          ...defaultTestParameters,
          ...querySettings
        });
        
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTestParametersState(mergedSettings);
        setLoadedFromUrl(true);
        
        // Also save to localStorage for persistence
        localStorage.setItem('testParameters', JSON.stringify(mergedSettings));
        
        // Remove parameters from URL to keep it clean
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }
    }
    
    // If no URL parameters, load from localStorage as before
    const savedParams = localStorage.getItem('testParameters');
    if (savedParams) {
      try {
        const parsedParams = sanitizeParameters(JSON.parse(savedParams));
        setTestParametersState(parsedParams);
      } catch (error) {
        console.error('Failed to parse saved test parameters', error);
      }
    }
  }, []);

  const setTestParameters = useCallback((newParams: TestParameters) => {
    setTestParametersState(newParams);
    setLoadedFromUrl(false); // Reset the flag when user manually saves settings
    // Save to localStorage for persistence
    localStorage.setItem('testParameters', JSON.stringify(newParams));
  }, []);

  const contextValue = useMemo(() => ({
    testParameters,
    setTestParameters,
    loadedFromUrl
  }), [testParameters, setTestParameters, loadedFromUrl]);

  return (
    <TestParametersContext.Provider value={contextValue}>
      {children}
    </TestParametersContext.Provider>
  );
}

export function useTestParameters() {
  const context = useContext(TestParametersContext);
  if (context === undefined) {
    throw new Error('useTestParameters must be used within a TestParametersProvider');
  }
  return context;
}
