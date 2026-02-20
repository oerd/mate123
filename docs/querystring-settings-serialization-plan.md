# Implementation Plan: Teacher Settings Serialization in Query String

## Overview

This plan outlines how to implement query string serialization for teacher settings, allowing settings to be shared via URLs. When settings are present in the URL query string, they will override the local settings.

## Implementation Details

### 1. Create Serialization/Deserialization Functions

Add utility functions to convert between settings objects and query string parameters:

```typescript
// app/utils/settingsQueryString.ts

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
  if (params.has('fm')) settings.firstOperandMin = parseInt(params.get('fm') || '0', 10);
  if (params.has('fx')) settings.firstOperandMax = parseInt(params.get('fx') || '10', 10);
  if (params.has('sm')) settings.secondOperandMin = parseInt(params.get('sm') || '0', 10);
  if (params.has('sx')) settings.secondOperandMax = parseInt(params.get('sx') || '10', 10);
  
  if (params.has('op')) {
    const opString = params.get('op') || '';
    const operations = opString.split(',') as Operation[];
    // Validate operations
    const validOperations = operations.filter(op => 
      ['addition', 'subtraction', 'multiplication', 'division'].includes(op)
    );
    if (validOperations.length > 0) {
      settings.operations = validOperations;
    }
  }
  
  if (params.has('nr')) settings.numberOfResults = parseInt(params.get('nr') || '6', 10);
  if (params.has('sr')) settings.sortResults = params.get('sr') === '1';
  
  return settings;
}

// Check if query string contains any settings parameters
export function hasSettingsParams(queryString: string): boolean {
  const params = new URLSearchParams(queryString);
  const settingsParams = ['fm', 'fx', 'sm', 'sx', 'op', 'nr', 'sr'];
  return settingsParams.some(param => params.has(param));
}
```

### 2. Modify TestParametersContext to Accept Query String Updates

Update the TestParametersContext to handle query string parameters:

```typescript
// Update TestParametersContext.tsx

import { deserializeSettings, hasSettingsParams } from './utils/settingsQueryString';

export function TestParametersProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [testParameters, setTestParametersState] = useState<TestParameters>(defaultTestParameters);

  useEffect(() => {
    // First check if we have settings in the URL
    if (typeof window !== 'undefined') {
      const queryString = window.location.search;
      
      if (hasSettingsParams(queryString)) {
        // Parse settings from query string
        const querySettings = deserializeSettings(queryString);
        
        // Merge with default settings
        const mergedSettings = {
          ...defaultTestParameters,
          ...querySettings
        };
        
        // Apply settings
        setTestParametersState(mergedSettings);
        // Also save to localStorage for persistence
        localStorage.setItem('testParameters', JSON.stringify(mergedSettings));
        
        // Remove parameters from URL (optional, to keep URL clean)
        // window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }
    }
    
    // If no URL parameters, load from localStorage as before
    const savedParams = localStorage.getItem('testParameters');
    if (savedParams) {
      try {
        const parsedParams = JSON.parse(savedParams);
        setTestParametersState(parsedParams);
      } catch (error) {
        console.error('Failed to parse saved test parameters', error);
      }
    }
  }, []);

  // Rest of the provider remains the same
  // ...
}
```

### 3. Add Share Functionality to Settings Page

Add a button to generate and share a URL with current settings:

```typescript
// Update app/settings/page.tsx to include sharing functionality

import { serializeSettings } from '../utils/settingsQueryString';

// Inside Settings component:
const [shareTooltip, setShareTooltip] = useState<boolean>(false);
const [shareSuccess, setShareSuccess] = useState<boolean>(false);

const handleShareSettings = () => {
  // Only create URL with current form state, not saved state
  const currentSettings = {
    firstOperandMin,
    firstOperandMax,
    secondOperandMin,
    secondOperandMax,
    operations: selectedOperations,
    numberOfResults,
    sortResults
  };
  
  // Generate query string
  const queryString = serializeSettings(currentSettings);
  
  // Create full URL
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/?${queryString}`;
  
  // Copy to clipboard
  navigator.clipboard.writeText(shareUrl)
    .then(() => {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    })
    .catch(err => {
      console.error('Failed to copy URL: ', err);
    });
};

// Add a share button to the UI
<div className="mt-4 flex justify-between">
  <Link 
    href="/"
    className="px-6 py-3 bg-ctp-blue text-ctp-base font-bold rounded-lg hover:bg-ctp-lavender transition-colors"
  >
    {t.backToGame}
  </Link>
  
  <div className="relative">
    <button
      onClick={handleShareSettings}
      onMouseEnter={() => setShareTooltip(true)}
      onMouseLeave={() => setShareTooltip(false)}
      className="px-6 py-3 bg-ctp-sapphire text-ctp-base font-bold rounded-lg hover:bg-ctp-sky transition-colors flex items-center"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 mr-2" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      {shareSuccess ? t.copied : t.shareSettings}
    </button>
    
    {shareTooltip && !shareSuccess && (
      <div className="absolute right-0 top-full mt-2 bg-ctp-surface2 text-ctp-text px-3 py-1 rounded text-sm whitespace-nowrap">
        {t.shareSettingsTooltip}
      </div>
    )}
  </div>
</div>
```

### 4. Update Translations

Add translations for the new share feature:

```typescript
// Update app/translations.ts 

interface Translations {
  // ... existing translations
  shareSettings: string;
  shareSettingsTooltip: string;
  copied: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // ... existing translations
    shareSettings: 'Share Settings',
    shareSettingsTooltip: 'Copy settings URL to clipboard',
    copied: 'Copied!',
  },
  de: {
    // ... existing translations
    shareSettings: 'Einstellungen teilen',
    shareSettingsTooltip: 'Einstellungs-URL in die Zwischenablage kopieren',
    copied: 'Kopiert!',
  },
  it: {
    // ... existing translations
    shareSettings: 'Condividi Impostazioni',
    shareSettingsTooltip: 'Copia URL delle impostazioni negli appunti',
    copied: 'Copiato!',
  },
  fr: {
    // ... existing translations
    shareSettings: 'Partager les Paramètres',
    shareSettingsTooltip: 'Copier l\'URL des paramètres dans le presse-papiers',
    copied: 'Copié!',
  }
};
```

### 5. Testing Considerations

- Test serialization and deserialization with different combinations of settings
- Ensure values are properly validated when parsing from query string
- Test the share functionality and URL generation
- Check that shared URLs correctly apply settings when opened
- Verify that malformed query strings don't break the application
