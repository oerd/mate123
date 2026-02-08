import { renderHook, act } from '@testing-library/react';
import { TestParametersProvider, useTestParameters } from './TestParametersContext';
import { describe, it, expect, beforeEach } from 'vitest';

// We use the real JSDOM environment, so no manual mocks of localStorage or window.location.
// However, JSDOM's window.location.href/search are read-only-ish or hard to change via assignment in some setups,
// but window.history.pushState works.

describe('TestParametersContext', () => {
  beforeEach(() => {
    // Clear real localStorage
    window.localStorage.clear();
    // Reset URL
    window.history.pushState({}, '', '/');
  });

  it('provides default parameters initially', () => {
    const { result } = renderHook(() => useTestParameters(), {
      wrapper: TestParametersProvider,
    });

    expect(result.current.testParameters).toBeDefined();
    expect(result.current.testParameters.operations).toContain('addition');
    expect(result.current.loadedFromUrl).toBe(false);
  });

  it('updates parameters and saves to localStorage', () => {
    const { result } = renderHook(() => useTestParameters(), {
      wrapper: TestParametersProvider,
    });

    const newParams = {
      ...result.current.testParameters,
      numberOfResults: 8,
    };

    act(() => {
      result.current.setTestParameters(newParams);
    });

    expect(result.current.testParameters.numberOfResults).toBe(8);
    // Check real localStorage
    const stored = window.localStorage.getItem('math-practice:testParameters');
    expect(stored).toBeDefined();
    expect(JSON.parse(stored!)).toEqual(newParams);
  });

  it('loads parameters from localStorage on mount', () => {
    const savedParams = {
      firstOperandMin: 10,
      firstOperandMax: 20,
      secondOperandMin: 10,
      secondOperandMax: 20,
      operations: ['multiplication'],
      numberOfResults: 3,
      sortResults: true,
    };

    // Set real localStorage
    window.localStorage.setItem('math-practice:testParameters', JSON.stringify(savedParams));

    const { result } = renderHook(() => useTestParameters(), {
      wrapper: TestParametersProvider,
    });

    expect(result.current.testParameters).toEqual(savedParams);
  });

  it('prioritizes URL parameters over defaults/localStorage', () => {
    // Use real history API to simulate URL
    window.history.pushState({}, '', '/?nr=5&op=division');

    const { result } = renderHook(() => useTestParameters(), {
      wrapper: TestParametersProvider,
    });

    expect(result.current.testParameters.numberOfResults).toBe(5);
    expect(result.current.testParameters.operations).toEqual(['division']);
    expect(result.current.loadedFromUrl).toBe(true);
    
    // Check if URL was cleaned (app calls window.history.replaceState)
    // Note: Since we are in JSDOM, we can check if the current location.search is empty?
    // The implementation calls: window.history.replaceState({}, document.title, window.location.pathname);
    // So we expect window.location.search to be empty now.
    expect(window.location.search).toBe('');
  });
});
