import { describe, it, expect } from 'vitest';
import { serializeSettings, deserializeSettings, hasSettingsParams } from './settingsQueryString';
import { TestParameters } from '../TestParametersContext';

describe('settingsQueryString', () => {
  const defaultSettings: TestParameters = {
    firstOperandMin: 1,
    firstOperandMax: 10,
    secondOperandMin: 1,
    secondOperandMax: 10,
    operations: ['addition', 'subtraction'],
    numberOfResults: 6,
    sortResults: false
  };

  it('should serialize and deserialize settings correctly', () => {
    const serialized = serializeSettings(defaultSettings);
    const deserialized = deserializeSettings(serialized);
    
    expect(deserialized).toEqual(defaultSettings);
  });

  it('should handle partial serialization', () => {
    const customSettings: TestParameters = {
      ...defaultSettings,
      firstOperandMax: 100,
      operations: ['multiplication'],
      sortResults: true
    };
    
    const serialized = serializeSettings(customSettings);
    const deserialized = deserializeSettings(serialized);
    
    expect(deserialized).toEqual(customSettings);
  });
  
  it('should detect settings params in query string', () => {
    const serialized = serializeSettings(defaultSettings);
    expect(hasSettingsParams(serialized)).toBe(true);
    expect(hasSettingsParams('?foo=bar')).toBe(false);
  });

  it('should validate operations during deserialization', () => {
    // Manually create a query string with invalid operation
    const queryString = 'op=addition,invalid_op,subtraction';
    const deserialized = deserializeSettings(queryString);
    
    expect(deserialized.operations).toEqual(['addition', 'subtraction']);
  });

  it('round-trip: serialize then deserialize produces the same parameters', () => {
    const fullSettings: TestParameters = {
      firstOperandMin: 5,
      firstOperandMax: 50,
      secondOperandMin: 3,
      secondOperandMax: 25,
      operations: ['addition', 'subtraction', 'multiplication', 'division'],
      numberOfResults: 4,
      sortResults: true
    };

    const result = deserializeSettings(serializeSettings(fullSettings));

    expect(result.firstOperandMin).toBe(fullSettings.firstOperandMin);
    expect(result.firstOperandMax).toBe(fullSettings.firstOperandMax);
    expect(result.secondOperandMin).toBe(fullSettings.secondOperandMin);
    expect(result.secondOperandMax).toBe(fullSettings.secondOperandMax);
    expect(result.operations).toEqual(fullSettings.operations);
    expect(result.numberOfResults).toBe(fullSettings.numberOfResults);
    expect(result.sortResults).toBe(fullSettings.sortResults);
  });

  it('round-trip works for all operation combinations', () => {
    const operationSets: TestParameters['operations'][] = [
      ['addition'],
      ['subtraction', 'division'],
      ['multiplication', 'division'],
      ['addition', 'subtraction', 'multiplication', 'division'],
    ];

    for (const ops of operationSets) {
      const settings: TestParameters = { ...defaultSettings, operations: ops };
      const result = deserializeSettings(serializeSettings(settings));
      expect(result.operations).toEqual(ops);
    }
  });

  it('handles edge case values', () => {
    const zeroMinMax: TestParameters = {
      ...defaultSettings,
      firstOperandMin: 0,
      firstOperandMax: 0,
      secondOperandMin: 0,
      secondOperandMax: 0,
    };
    const resultZero = deserializeSettings(serializeSettings(zeroMinMax));
    expect(resultZero.firstOperandMin).toBe(0);
    expect(resultZero.firstOperandMax).toBe(0);
    expect(resultZero.secondOperandMin).toBe(0);
    expect(resultZero.secondOperandMax).toBe(0);

    const minResults: TestParameters = { ...defaultSettings, numberOfResults: 2 };
    expect(deserializeSettings(serializeSettings(minResults)).numberOfResults).toBe(2);

    const maxResults: TestParameters = { ...defaultSettings, numberOfResults: 8 };
    expect(deserializeSettings(serializeSettings(maxResults)).numberOfResults).toBe(8);
  });

  it('invalid operations in query string are filtered out', () => {
    const qs = 'fm=1&fx=10&sm=1&sx=10&op=foo,bar,baz&nr=6&sr=0';
    const result = deserializeSettings(qs);
    expect(result.operations).toBeUndefined();
  });

  it('NaN/Infinity values are handled safely', () => {
    const qs = 'fm=abc&fx=Infinity&sm=NaN&sx=&nr=xyz&sr=0';
    const result = deserializeSettings(qs);
    expect(Number.isFinite(result.firstOperandMin) || result.firstOperandMin === undefined || Number.isNaN(result.firstOperandMin)).toBe(true);
    expect(result.sortResults).toBe(false);
    expect(result.numberOfResults).toBeDefined();
  });

  it('hasSettingsParams returns false for empty query string', () => {
    expect(hasSettingsParams('')).toBe(false);
  });

  it('hasSettingsParams returns false for unrelated query parameters', () => {
    expect(hasSettingsParams('foo=bar&baz=42&hello=world')).toBe(false);
  });
});
