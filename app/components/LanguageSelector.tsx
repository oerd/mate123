import React from 'react';
import { Language } from '../translations';

interface LanguageSelectorProps {
  language: Language;
  setLanguage: (language: Language) => void;
  tooltip: string | null;
  setTooltip: (tooltip: string | null) => void;
}

interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  setLanguage,
  tooltip,
  setTooltip
}) => {
  // Define all available languages with their display names and flag emojis
  const languageOptions: LanguageOption[] = [
    { code: 'sq', name: 'Shqip', flag: '🇦🇱' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  return (
    <div className="flex justify-center gap-4 mb-4 flex-wrap">
      {languageOptions.map((option) => (
        <div key={option.code} className="relative">
          <button
            onClick={() => setLanguage(option.code)}
            onMouseEnter={() => setTooltip(option.code)}
            onMouseLeave={() => setTooltip(null)}
            className={`p-2 rounded-lg transition-all ${
              language === option.code
                ? 'bg-ctp-surface1 border-2 border-ctp-blue scale-110'
                : 'bg-ctp-surface0 hover:bg-ctp-surface1'
            }`}
            aria-label={option.name}
          >
            <span className="text-4xl leading-none">{option.flag}</span>
          </button>
          {tooltip === option.code && (
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-ctp-surface2 text-ctp-text px-3 py-1 rounded text-sm whitespace-nowrap z-20">
              {option.name}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
