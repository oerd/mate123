import { describe, it, expect } from 'vitest';
import { generateAnswerOptions, isAnswerCorrect, round2 } from './mathLogic';

describe('generateAnswerOptions', () => {
  const baseConfig = { numberOfResults: 6, sortResults: false };

  it('always includes the correct answer', () => {
    for (let i = 0; i < 20; i++) {
      const options = generateAnswerOptions(7, baseConfig);
      expect(options).toContain(7);
    }
  });

  it('returns the requested number of options', () => {
    for (let count = 2; count <= 8; count++) {
      const options = generateAnswerOptions(5, { numberOfResults: count, sortResults: false });
      expect(options).toHaveLength(count);
    }
  });

  it('returns all unique values', () => {
    for (let i = 0; i < 20; i++) {
      const options = generateAnswerOptions(10, baseConfig);
      const unique = new Set(options);
      expect(unique.size).toBe(options.length);
    }
  });

  it('does not infinite loop when correctAnswer is 0', () => {
    const options = generateAnswerOptions(0, { numberOfResults: 8, sortResults: false });
    expect(options).toHaveLength(8);
    expect(options).toContain(0);
  });

  it('does not infinite loop when correctAnswer is 1 with many results', () => {
    const options = generateAnswerOptions(1, { numberOfResults: 8, sortResults: false });
    expect(options).toHaveLength(8);
    expect(options).toContain(1);
  });

  it('does not infinite loop when correctAnswer is very small', () => {
    const options = generateAnswerOptions(0.5, { numberOfResults: 6, sortResults: false });
    expect(options).toHaveLength(6);
  });

  it('handles large correct answers', () => {
    const options = generateAnswerOptions(10000, { numberOfResults: 6, sortResults: false });
    expect(options).toHaveLength(6);
    expect(options).toContain(10000);
  });

  it('returns sorted options when sortResults is true', () => {
    for (let i = 0; i < 10; i++) {
      const options = generateAnswerOptions(15, { numberOfResults: 6, sortResults: true });
      for (let j = 1; j < options.length; j++) {
        expect(options[j]).toBeGreaterThanOrEqual(options[j - 1]);
      }
    }
  });

  it('generates only non-negative options', () => {
    for (let i = 0; i < 20; i++) {
      const options = generateAnswerOptions(0, baseConfig);
      options.forEach(opt => {
        expect(opt).toBeGreaterThanOrEqual(0);
      });
    }
  });

  it('handles numberOfResults = 2 (minimum)', () => {
    const options = generateAnswerOptions(5, { numberOfResults: 2, sortResults: false });
    expect(options).toHaveLength(2);
    expect(options).toContain(5);
  });

  it('handles correctAnswer with decimals (division results)', () => {
    const options = generateAnswerOptions(3.33, { numberOfResults: 4, sortResults: false });
    expect(options).toHaveLength(4);
    expect(options).toContain(round2(3.33));
  });
});

describe('isAnswerCorrect', () => {
  it('returns true for exact match', () => {
    expect(isAnswerCorrect(8, 8)).toBe(true);
  });

  it('returns true for equivalent after rounding', () => {
    expect(isAnswerCorrect(3.335, 3.34)).toBe(true);
    expect(isAnswerCorrect(3.334, 3.33)).toBe(true);
  });

  it('returns false for wrong answer', () => {
    expect(isAnswerCorrect(7, 8)).toBe(false);
  });

  it('returns false for NaN', () => {
    expect(isAnswerCorrect(NaN, 5)).toBe(false);
  });

  it('returns false for Infinity', () => {
    expect(isAnswerCorrect(Infinity, 5)).toBe(false);
    expect(isAnswerCorrect(-Infinity, 5)).toBe(false);
  });

  it('handles zero correctly', () => {
    expect(isAnswerCorrect(0, 0)).toBe(true);
    expect(isAnswerCorrect(0, 1)).toBe(false);
  });

  it('handles negative answers', () => {
    expect(isAnswerCorrect(-5, -5)).toBe(true);
    expect(isAnswerCorrect(-5, 5)).toBe(false);
  });
});

describe('round2', () => {
  it('rounds to 2 decimal places', () => {
    expect(round2(1.005)).toBe(1);
    expect(round2(1.555)).toBe(1.56);
    expect(round2(10)).toBe(10);
    expect(round2(0)).toBe(0);
  });
});
