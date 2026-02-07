import { describe, it, expect } from 'vitest';
import { sanitizeParameters } from './mathLogic';
import { TestParameters } from '../TestParametersContext';

describe('sanitizeParameters', () => {
  const validParams: TestParameters = {
    firstOperandMin: 1,
    firstOperandMax: 10,
    secondOperandMin: 1,
    secondOperandMax: 10,
    operations: ['addition'],
    numberOfResults: 4,
    sortResults: false,
  };

  it('passes through valid parameters unchanged', () => {
    expect(sanitizeParameters(validParams)).toEqual(validParams);
  });

  it('swaps min/max when min > max', () => {
    const result = sanitizeParameters({
      ...validParams,
      firstOperandMin: 20,
      firstOperandMax: 5,
    });
    expect(result.firstOperandMin).toBe(5);
    expect(result.firstOperandMax).toBe(20);
  });

  it('swaps second operand min/max when inverted', () => {
    const result = sanitizeParameters({
      ...validParams,
      secondOperandMin: 50,
      secondOperandMax: 10,
    });
    expect(result.secondOperandMin).toBe(10);
    expect(result.secondOperandMax).toBe(50);
  });

  it('clamps operand values to 0-1000', () => {
    const result = sanitizeParameters({
      ...validParams,
      firstOperandMin: -5,
      firstOperandMax: 2000,
    });
    expect(result.firstOperandMin).toBe(0);
    expect(result.firstOperandMax).toBe(1000);
  });

  it('handles NaN operand values by falling back to 0', () => {
    const result = sanitizeParameters({
      ...validParams,
      firstOperandMin: NaN,
      firstOperandMax: 10,
    });
    expect(result.firstOperandMin).toBe(0);
    expect(result.firstOperandMax).toBe(10);
  });

  it('handles Infinity operand values by falling back to 0', () => {
    const result = sanitizeParameters({
      ...validParams,
      secondOperandMin: 1,
      secondOperandMax: Infinity,
    });
    expect(result.secondOperandMin).toBe(0);
    expect(result.secondOperandMax).toBe(1);
  });

  it('clamps numberOfResults between 2 and 8', () => {
    expect(sanitizeParameters({ ...validParams, numberOfResults: 0 }).numberOfResults).toBe(2);
    expect(sanitizeParameters({ ...validParams, numberOfResults: 1 }).numberOfResults).toBe(2);
    expect(sanitizeParameters({ ...validParams, numberOfResults: 20 }).numberOfResults).toBe(8);
    expect(sanitizeParameters({ ...validParams, numberOfResults: NaN }).numberOfResults).toBe(2);
  });

  it('filters out invalid operations', () => {
    const result = sanitizeParameters({
      ...validParams,
      operations: ['addition', 'bogus' as never, 'subtraction'],
    });
    expect(result.operations).toEqual(['addition', 'subtraction']);
  });

  it('falls back to addition when all operations are invalid', () => {
    const result = sanitizeParameters({
      ...validParams,
      operations: ['bogus' as never],
    });
    expect(result.operations).toEqual(['addition']);
  });

  it('falls back to addition when operations array is empty', () => {
    const result = sanitizeParameters({
      ...validParams,
      operations: [],
    });
    expect(result.operations).toEqual(['addition']);
  });

  it('coerces sortResults to boolean', () => {
    expect(sanitizeParameters({ ...validParams, sortResults: true }).sortResults).toBe(true);
    expect(sanitizeParameters({ ...validParams, sortResults: false }).sortResults).toBe(false);
  });
});
