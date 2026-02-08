import { describe, it, expect } from 'vitest';
import { generateProblem, generateAnswerOptions } from './mathLogic';
import { TestParameters, Operation } from '../TestParametersContext';

describe('mathLogic', () => {
  const baseParams: TestParameters = {
    firstOperandMin: 1,
    firstOperandMax: 10,
    secondOperandMin: 1,
    secondOperandMax: 10,
    operations: ['addition'],
    numberOfResults: 4,
    sortResults: false
  };

  describe('addition', () => {
    it('should generate numbers within range', () => {
      const p = generateProblem(baseParams, 'addition');
      expect(p.num1).toBeGreaterThanOrEqual(1);
      expect(p.num1).toBeLessThanOrEqual(10);
      expect(p.num2).toBeGreaterThanOrEqual(1);
      expect(p.num2).toBeLessThanOrEqual(10);
      expect(p.answer).toBe(p.num1 + p.num2);
    });
  });

  describe('subtraction', () => {
    it('should always result in non-negative answer (num1 >= num2) when ranges overlap', () => {
      for (let i = 0; i < 50; i++) {
        const p = generateProblem(baseParams, 'subtraction');
        expect(p.num1).toBeGreaterThanOrEqual(p.num2);
        expect(p.answer).toBeGreaterThanOrEqual(0);
      }
    });

    it('should handle disjoint ranges where First < Second (impossible strict)', () => {
      // First [1, 5], Second [10, 20]. Strict impossible.
      // Logic should swap or adjust.
      const params = { ...baseParams, firstOperandMax: 5, secondOperandMin: 10, secondOperandMax: 20 };
      
      for (let i = 0; i < 20; i++) {
        const p = generateProblem(params, 'subtraction');
        expect(p.answer).toBeGreaterThanOrEqual(0);
        // We accept that it might violate the Strict Assignment (Swap) to preserve non-negative
      }
    });

    it('should handle constrained ranges where num1 limits num2', () => {
      // First [5, 10], Second [1, 10].
      // If num1 picks 5, num2 must be <= 5.
      const params = { ...baseParams, firstOperandMin: 5, firstOperandMax: 10, secondOperandMin: 1, secondOperandMax: 10 };
      
      for (let i = 0; i < 50; i++) {
        const p = generateProblem(params, 'subtraction');
        expect(p.num2).toBeLessThanOrEqual(p.num1);
        expect(p.answer).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('division', () => {
    it('should produce integer results (num1 is multiple of num2)', () => {
      const params = { ...baseParams, operations: ['division'] as Operation[] };
      for (let i = 0; i < 50; i++) {
        const p = generateProblem(params, 'division');
        expect(Number.isInteger(p.answer)).toBe(true);
        expect(p.num1 % p.num2).toBe(0);
        expect(p.num2).not.toBe(0);
      }
    });

    it('should handle cases where no multiple exists in range (fallback)', () => {
      const params = { ...baseParams, firstOperandMin: 1, firstOperandMax: 2, secondOperandMin: 5, secondOperandMax: 5 };
      
      const p = generateProblem(params, 'division');
      expect(Number.isInteger(p.answer)).toBe(true);
      expect(p.num2).toBe(5);
      expect(p.num1 % 5).toBe(0);
    });

    it('should try different divisors to stay within firstOperand range', () => {
      // First [10, 20], Second [1, 10].
      // num2=7 has no multiple in [10,20], but num2=2,5,10 do.
      const params = { ...baseParams, firstOperandMin: 10, firstOperandMax: 20, secondOperandMin: 1, secondOperandMax: 10 };
      
      for (let i = 0; i < 50; i++) {
        const p = generateProblem(params, 'division');
        expect(Number.isInteger(p.answer)).toBe(true);
        expect(p.num1).toBeGreaterThanOrEqual(10);
        expect(p.num1).toBeLessThanOrEqual(20);
        expect(p.num2).toBeGreaterThanOrEqual(1);
        expect(p.num2).toBeLessThanOrEqual(10);
      }
    });

    it('should never divide by zero', () => {
      const params = { ...baseParams, secondOperandMin: 0, secondOperandMax: 0 };
      for (let i = 0; i < 20; i++) {
        const p = generateProblem(params, 'division');
        expect(p.num2).not.toBe(0);
        expect(Number.isFinite(p.answer)).toBe(true);
      }
    });
  });

  describe('generateProblem invariants', () => {
    const paramRanges: TestParameters[] = [
      { ...baseParams, firstOperandMin: 1, firstOperandMax: 100, secondOperandMin: 1, secondOperandMax: 50 },
      { ...baseParams, firstOperandMin: 0, firstOperandMax: 20, secondOperandMin: 0, secondOperandMax: 20 },
      { ...baseParams, firstOperandMin: 10, firstOperandMax: 50, secondOperandMin: 5, secondOperandMax: 30 },
      { ...baseParams, firstOperandMin: 1, firstOperandMax: 5, secondOperandMin: 10, secondOperandMax: 20 },
    ];

    it('subtraction never produces negative results', () => {
      for (const params of paramRanges) {
        for (let i = 0; i < 100; i++) {
          const p = generateProblem(params, 'subtraction');
          expect(p.answer).toBeGreaterThanOrEqual(0);
        }
      }
    });

    it('division never divides by zero', () => {
      const divParams: TestParameters[] = [
        { ...baseParams, firstOperandMin: 1, firstOperandMax: 100, secondOperandMin: 0, secondOperandMax: 10 },
        { ...baseParams, firstOperandMin: 1, firstOperandMax: 50, secondOperandMin: 0, secondOperandMax: 0 },
        { ...baseParams, firstOperandMin: 10, firstOperandMax: 100, secondOperandMin: 1, secondOperandMax: 10 },
      ];
      for (const params of divParams) {
        for (let i = 0; i < 100; i++) {
          const p = generateProblem(params, 'division');
          expect(p.num2).not.toBe(0);
          expect(Number.isFinite(p.answer)).toBe(true);
        }
      }
    });

    it('division produces integer answers with reasonable ranges', () => {
      const params: TestParameters = {
        ...baseParams,
        firstOperandMin: 1,
        firstOperandMax: 100,
        secondOperandMin: 1,
        secondOperandMax: 10,
      };
      for (let i = 0; i < 100; i++) {
        const p = generateProblem(params, 'division');
        expect(p.answer).toBe(Math.floor(p.answer));
      }
    });

    it('generated numbers stay within operand ranges for addition', () => {
      const params: TestParameters = {
        ...baseParams,
        firstOperandMin: 5,
        firstOperandMax: 50,
        secondOperandMin: 3,
        secondOperandMax: 25,
      };
      for (let i = 0; i < 100; i++) {
        const p = generateProblem(params, 'addition');
        expect(p.num1).toBeGreaterThanOrEqual(params.firstOperandMin);
        expect(p.num1).toBeLessThanOrEqual(params.firstOperandMax);
        expect(p.num2).toBeGreaterThanOrEqual(params.secondOperandMin);
        expect(p.num2).toBeLessThanOrEqual(params.secondOperandMax);
      }
    });

    it('generated numbers stay within operand ranges for multiplication', () => {
      const params: TestParameters = {
        ...baseParams,
        firstOperandMin: 2,
        firstOperandMax: 12,
        secondOperandMin: 1,
        secondOperandMax: 10,
      };
      for (let i = 0; i < 100; i++) {
        const p = generateProblem(params, 'multiplication');
        expect(p.num1).toBeGreaterThanOrEqual(params.firstOperandMin);
        expect(p.num1).toBeLessThanOrEqual(params.firstOperandMax);
        expect(p.num2).toBeGreaterThanOrEqual(params.secondOperandMin);
        expect(p.num2).toBeLessThanOrEqual(params.secondOperandMax);
      }
    });
  });

  describe('generateAnswerOptions invariants', () => {
    it('always contains the correct answer', () => {
      for (let i = 0; i < 50; i++) {
        const correct = Math.floor(Math.random() * 200);
        const options = generateAnswerOptions(correct, { numberOfResults: 4, sortResults: false });
        expect(options).toContain(correct);
      }
    });

    it('returns the requested number of options', () => {
      for (const count of [2, 3, 4, 5, 6, 8]) {
        const options = generateAnswerOptions(42, { numberOfResults: count, sortResults: false });
        expect(options).toHaveLength(count);
      }
    });

    it('returns unique values', () => {
      for (let i = 0; i < 50; i++) {
        const correct = Math.floor(Math.random() * 100);
        const options = generateAnswerOptions(correct, { numberOfResults: 4, sortResults: false });
        const unique = new Set(options);
        expect(unique.size).toBe(options.length);
      }
    });
  });
});
