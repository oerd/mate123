import { describe, it, expect } from 'vitest';
import { translations, Language } from './translations';

describe('Translations', () => {
  const languages: Language[] = ['en', 'de', 'it', 'fr', 'sq'];
  const baseKeys = Object.keys(translations['en']) as Array<keyof typeof translations['en']>;

  it('should have all keys for all languages', () => {
    languages.forEach((lang) => {
      const langKeys = Object.keys(translations[lang]);
      
      // Check for missing keys
      baseKeys.forEach((key) => {
        expect(translations[lang], `Missing key '${key}' in language '${lang}'`).toHaveProperty(key);
      });

      // Check for extra keys (optional, but good for cleanliness)
      expect(langKeys.length).toBe(baseKeys.length);
    });
  });

  it('should not have empty strings', () => {
    languages.forEach((lang) => {
      baseKeys.forEach((key) => {
        const value = translations[lang][key];
        expect(value, `Empty string for key '${key}' in language '${lang}'`).toBeTruthy();
      });
    });
  });
});
