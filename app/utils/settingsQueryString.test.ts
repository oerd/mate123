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
});
