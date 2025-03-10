import { TestParameters, Operation } from '../TestParametersContext';

// Serializes settings to a compressed query string
export function serializeSettings(settings: TestParameters): string {
  // Use short param names to keep the URL compact
  const params = new URLSearchParams();
  
  // Serialize each setting with abbreviated keys
  params.set('fm', settings.firstOperandMin.toString());
  params.set('fx', settings.firstOperandMax.toString());
  params.set('sm', settings.secondOperandMin.toString());
  params.set('sx', settings.secondOperandMax.toString());
  params.set('op', settings.operations.join(','));
  params.set('nr', settings.numberOfResults.toString());
  params.set('sr', settings.sortResults ? '1' : '0');
  
  return params.toString();
}

// Deserializes settings from a query string
export function deserializeSettings(queryString: string): Partial<TestParameters> {
  const params = new URLSearchParams(queryString);
  const settings: Partial<TestParameters> = {};
  
  // Get each setting with fallback to undefined if not present
  if (params.has('fm')) settings.firstOperandMin = parseInt(params.get('fm') ?? '0', 10);
  if (params.has('fx')) settings.firstOperandMax = parseInt(params.get('fx') ?? '10', 10);
  if (params.has('sm')) settings.secondOperandMin = parseInt(params.get('sm') ?? '0', 10);
  if (params.has('sx')) settings.secondOperandMax = parseInt(params.get('sx') ?? '10', 10);
  
  if (params.has('op')) {
    const opString = params.get('op') ?? '';
    const operations = opString.split(',') as Operation[];
    // Validate operations
    const validOperations = operations.filter(op => 
      ['addition', 'subtraction', 'multiplication', 'division'].includes(op)
    );
    if (validOperations.length > 0) {
      settings.operations = validOperations;
    }
  }
  
  if (params.has('nr')) {
    const numResults = parseInt(params.get('nr') ?? '6', 10);
    settings.numberOfResults = Math.min(Math.max(numResults, 2), 8); // Ensure between 2 and 8
  }
  if (params.has('sr')) settings.sortResults = params.get('sr') === '1';
  
  return settings;
}

// Check if query string contains any settings parameters
export function hasSettingsParams(queryString: string): boolean {
  const params = new URLSearchParams(queryString);
  const settingsParams = ['fm', 'fx', 'sm', 'sx', 'op', 'nr', 'sr'];
  return settingsParams.some(param => params.has(param));
}
