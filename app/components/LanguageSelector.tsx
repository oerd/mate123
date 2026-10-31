import React from 'react';
import { Language } from '../translations';

interface LanguageSelectorProps {
  language: Language;
  setLanguage: (language: Language) => void;
  ariaLabel: string;
}

interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  setLanguage,
  ariaLabel
}) => {
  const languageOptions: LanguageOption[] = [
    { code: 'sq', name: 'Shqip', flag: '🇦🇱' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  return (
    <div className="flex justify-center gap-2 sm:gap-3 flex-wrap" role="group" aria-label={ariaLabel}>
      {languageOptions.map((option) => (
        <button
          key={option.code}
          type="button"
          onClick={() => setLanguage(option.code)}
          aria-pressed={language === option.code}
          aria-label={option.name}
          className={`flex items-center gap-2 px-3 py-2 rounded-full border-[3px] border-neo-ink font-bold transition-all ${language === option.code
            ? 'bg-neo-orange text-black box-shadow-hard'
            : 'bg-neo-surface text-neo-ink hover:bg-neo-surface-muted'
          }`}
        >
          <span className="text-2xl leading-none" aria-hidden="true">{option.flag}</span>
          <span>{option.name}</span>
        </button>
      ))}
    </div>
  );
}
