import { renderHook, act } from '@testing-library/react';
import { TestParametersProvider, useTestParameters } from './TestParametersContext';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock window.location and history
const originalLocation = window.location;
// const originalHistory = window.history;

describe('TestParametersContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    // Reset window mocks
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).location;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.location = { ...originalLocation, search: '' } as any;
    
    window.history.replaceState = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
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
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'testParameters',
      JSON.stringify(newParams)
    );
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

    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedParams));

    const { result } = renderHook(() => useTestParameters(), {
      wrapper: TestParametersProvider,
    });

    expect(result.current.testParameters).toEqual(savedParams);
  });

  it('prioritizes URL parameters over defaults/localStorage', () => {
    // Simulate URL with params: ?nr=5&op=division
    window.location.search = '?nr=5&op=division';

    const { result } = renderHook(() => useTestParameters(), {
      wrapper: TestParametersProvider,
    });

    expect(result.current.testParameters.numberOfResults).toBe(5);
    expect(result.current.testParameters.operations).toEqual(['division']);
    expect(result.current.loadedFromUrl).toBe(true);
    
    // Should clean URL
    expect(window.history.replaceState).toHaveBeenCalled();
  });
});
