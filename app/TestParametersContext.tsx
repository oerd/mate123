'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';

export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'rounding' | 'comparison';
// Define all possible operations
export const allOperations: Operation[] = ['addition', 'subtraction', 'multiplication', 'division', 'rounding', 'comparison'];
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
    case 'rounding':
      return '≈';
    case 'comparison':
      return '<=>';
    default:
      return '+';
  }
}

export type RoundingNearest = 10 | 100 | 1000;
export const roundingNearestOptions: RoundingNearest[] = [10, 100, 1000];
export type RoundingAnswers = 2 | 4;
export const roundingAnswersOptions: RoundingAnswers[] = [2, 4];
export type ComparisonMode = 'numbers' | 'sums';
export const comparisonModeOptions: ComparisonMode[] = ['numbers', 'sums'];
export type AutoAdvanceSpeed = 'off' | 'slow' | 'medium' | 'fast';
export const autoAdvanceSpeedOptions: AutoAdvanceSpeed[] = ['off', 'slow', 'medium', 'fast'];
export const autoAdvanceDelayMs: Record<AutoAdvanceSpeed, number> = { off: 0, slow: 3000, medium: 2000, fast: 1000 };

export interface TestParameters {
  firstOperandMin: number;
  firstOperandMax: number;
  secondOperandMin: number;
  secondOperandMax: number;
  operations: Operation[];
  numberOfResults: number;
  sortResults: boolean;
  roundingNearest: RoundingNearest[];
  roundingAnswers: RoundingAnswers;
  roundingNumberLine: boolean;
  comparisonModes: ComparisonMode[];
  autoAdvance: AutoAdvanceSpeed;
}

interface TestParametersContextType {
  testParameters: TestParameters;
  setTestParameters: (params: TestParameters) => void;
  loadedFromUrl: boolean;
}

export const defaultTestParameters: TestParameters = {
  firstOperandMin: 1,
  firstOperandMax: 10,
  secondOperandMin: 1,
  secondOperandMax: 10,
  operations: ['addition', 'subtraction'],
  numberOfResults: 6,
  sortResults: false,
  roundingNearest: [10],
  roundingAnswers: 2,
  roundingNumberLine: false,
  comparisonModes: ['numbers'],
  autoAdvance: 'medium'
};

const TestParametersContext = createContext<TestParametersContextType | undefined>(undefined);

// Import the utility functions
import { deserializeSettings, hasSettingsParams } from './utils/settingsQueryString';
import { sanitizeParameters } from './utils/mathLogic';

function getInitialTestParameters(): { params: TestParameters; fromUrl: boolean } {
  if (typeof window === 'undefined') return { params: defaultTestParameters, fromUrl: false };

  const queryString = window.location.search;
  if (hasSettingsParams(queryString)) {
    const querySettings = deserializeSettings(queryString);
    const merged = sanitizeParameters({ ...defaultTestParameters, ...querySettings });
    localStorage.setItem('math-practice:testParameters', JSON.stringify(merged));
    return { params: merged, fromUrl: true };
  }

  const savedParams = localStorage.getItem('math-practice:testParameters');
  if (savedParams) {
    try {
      return { params: sanitizeParameters({ ...defaultTestParameters, ...JSON.parse(savedParams) }), fromUrl: false };
    } catch {
      // ignore corrupt data
    }
  }
  return { params: defaultTestParameters, fromUrl: false };
}

export function TestParametersProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [initial] = useState(getInitialTestParameters);
  const [testParameters, setTestParametersState] = useState<TestParameters>(initial.params);
  const [loadedFromUrl, setLoadedFromUrl] = useState<boolean>(initial.fromUrl);

  useEffect(() => {
    if (initial.fromUrl) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [initial.fromUrl]);

  const setTestParameters = useCallback((newParams: TestParameters) => {
    setTestParametersState(newParams);
    setLoadedFromUrl(false); // Reset the flag when user manually saves settings
    // Save to localStorage for persistence
    localStorage.setItem('math-practice:testParameters', JSON.stringify(newParams));
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
