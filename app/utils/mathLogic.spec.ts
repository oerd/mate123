import { describe, it, expect } from 'vitest';
import { generateProblem, generateAnswerOptions, generateRoundingOptions, generateOptionsForProblem, roundToNearest, roundingRange, comparisonSymbol, comparisonAnswers, pickRandomOperation } from './mathLogic';
import { TestParameters, Operation } from '../TestParametersContext';

describe('mathLogic', () => {
  const baseParams: TestParameters = {
    firstOperandMin: 1,
    firstOperandMax: 10,
    secondOperandMin: 1,
    secondOperandMax: 10,
    operations: ['addition'],
    numberOfResults: 4,
    sortResults: false,
    roundingNearest: [10],
    roundingAnswers: 2,
    roundingNumberLine: false,
    comparisonModes: ['numbers'],
  };

  describe('pickRandomOperation', () => {
    it('only picks from the given operations', () => {
      const ops: Operation[] = ['subtraction', 'rounding'];
      for (let i = 0; i < 50; i++) {
        expect(ops).toContain(pickRandomOperation(ops));
      }
    });

    it('eventually picks every given operation', () => {
      const ops: Operation[] = ['addition', 'subtraction', 'comparison'];
      const seen = new Set<Operation>();
      for (let i = 0; i < 200; i++) seen.add(pickRandomOperation(ops));
      expect(seen).toEqual(new Set(ops));
    });

    it('falls back to addition for an empty list', () => {
      expect(pickRandomOperation([])).toBe('addition');
    });
  });

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

  describe('rounding', () => {
    it('rounds half up to the nearest target', () => {
      expect(roundToNearest(325, 10)).toBe(330);
      expect(roundToNearest(324, 10)).toBe(320);
      expect(roundToNearest(1849, 100)).toBe(1800);
      expect(roundToNearest(2500, 1000)).toBe(3000);
    });

    it('falls back to a sensible range when the operand range is too small for the target', () => {
      expect(roundingRange(baseParams, 10)).toEqual({ min: 11, max: 99 });
      expect(roundingRange(baseParams, 100)).toEqual({ min: 101, max: 999 });
      expect(roundingRange({ ...baseParams, firstOperandMin: 0, firstOperandMax: 500 }, 10))
        .toEqual({ min: 0, max: 500 });
    });

    it('picks the rounding target from all selected options', () => {
      const seen = new Set<number>();
      for (let i = 0; i < 200; i++) {
        seen.add(generateProblem({ ...baseParams, roundingNearest: [10, 1000] }, 'rounding').num2);
      }
      expect([...seen].sort((a, b) => a - b)).toEqual([10, 1000]);
    });

    it('never asks to round an exact multiple and always carries the right answer', () => {
      for (const nearest of [10, 100, 1000] as const) {
        for (let i = 0; i < 50; i++) {
          const p = generateProblem({ ...baseParams, roundingNearest: [nearest] }, 'rounding');
          expect(p.operation).toBe('rounding');
          expect(p.num2).toBe(nearest);
          expect(p.num1 % nearest).not.toBe(0);
          expect(p.answer).toBe(roundToNearest(p.num1, nearest));
        }
      }
    });

    it('offers the two neighbouring multiples by default', () => {
      const options = generateRoundingOptions({ num1: 47, num2: 10, operation: 'rounding', answer: 50 }, 2, true);
      expect(options).toEqual([40, 50]);
    });

    it('adds distractors when four answers are requested', () => {
      const options = generateRoundingOptions({ num1: 47, num2: 10, operation: 'rounding', answer: 50 }, 4, true);
      expect(options).toHaveLength(4);
      expect(options).toContain(50);
      expect(new Set(options).size).toBe(4);
    });

    it('respects the rounding answer count through generateOptionsForProblem', () => {
      const problem = generateProblem({ ...baseParams, roundingNearest: [10] }, 'rounding');
      expect(generateOptionsForProblem(problem, { ...baseParams, roundingAnswers: 2 })).toHaveLength(2);
      expect(generateOptionsForProblem(problem, { ...baseParams, roundingAnswers: 4 })).toHaveLength(4);
    });
  });

  describe('comparison', () => {
    it('encodes the answer as the sign of the difference', () => {
      for (let i = 0; i < 50; i++) {
        const p = generateProblem(baseParams, 'comparison');
        expect(p.operation).toBe('comparison');
        expect(p.answer).toBe(Math.sign(p.num1 - p.num2));
        expect(p.addends).toBeUndefined();
      }
    });

    it('produces equal pairs some of the time', () => {
      let equal = 0;
      for (let i = 0; i < 300; i++) {
        if (generateProblem(baseParams, 'comparison').answer === 0) equal++;
      }
      expect(equal).toBeGreaterThan(0);
    });

    it('compares a sum against a number in sums mode', () => {
      for (let i = 0; i < 50; i++) {
        const p = generateProblem({ ...baseParams, comparisonModes: ['sums'] }, 'comparison');
        expect(p.addends).toBeDefined();
        const [a, b] = p.addends!;
        expect(a + b).toBe(p.num1);
        expect(p.num2).toBeGreaterThanOrEqual(0);
        expect(p.answer).toBe(Math.sign(p.num1 - p.num2));
      }
    });

    it('mixes numbers and sums when both modes are selected', () => {
      let withSums = 0, plain = 0;
      for (let i = 0; i < 200; i++) {
        const p = generateProblem({ ...baseParams, comparisonModes: ['numbers', 'sums'] }, 'comparison');
        if (p.addends) withSums++; else plain++;
      }
      expect(withSums).toBeGreaterThan(0);
      expect(plain).toBeGreaterThan(0);
    });

    it('always offers the three signs in order', () => {
      const problem = generateProblem(baseParams, 'comparison');
      expect(generateOptionsForProblem(problem, { ...baseParams, sortResults: false })).toEqual(comparisonAnswers);
      expect(comparisonAnswers.map(comparisonSymbol)).toEqual(['<', '=', '>']);
    });
  });
});
