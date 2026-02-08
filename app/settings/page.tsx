'use client';

import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';
import { useTestParameters, Operation } from '../TestParametersContext';
import { translations } from '../translations';
import Link from 'next/link';
import { OperationToggle } from '../components/OperationToggle';
import { LightIcon, DarkIcon, SystemIcon } from '../components/ThemeIcons';
import { LanguageSelector } from '../components/LanguageSelector';
import { useState, useEffect } from 'react';
import { serializeSettings } from '../utils/settingsQueryString';

export default function Settings() {
  const { language, setLanguage } = useLanguage();
  const { themeMode, setThemeMode, currentTheme } = useTheme();
  const { testParameters, setTestParameters, loadedFromUrl } = useTestParameters();
  const t = translations[language];
  const [tooltip, setTooltip] = useState<string | null>(null);
  
  const [firstOperandMin, setFirstOperandMin] = useState<number>(testParameters.firstOperandMin);
  const [firstOperandMax, setFirstOperandMax] = useState<number>(testParameters.firstOperandMax);
  const [secondOperandMin, setSecondOperandMin] = useState<number>(testParameters.secondOperandMin);
  const [secondOperandMax, setSecondOperandMax] = useState<number>(testParameters.secondOperandMax);
  const [selectedOperations, setSelectedOperations] = useState<Operation[]>(testParameters.operations);
  const [numberOfResults, setNumberOfResults] = useState<number>(testParameters.numberOfResults);
  const [sortResults, setSortResults] = useState<boolean>(testParameters.sortResults);
  const [shareTooltip, setShareTooltip] = useState<boolean>(false);
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);

  useEffect(() => {
    setFirstOperandMin(testParameters.firstOperandMin);
    setFirstOperandMax(testParameters.firstOperandMax);
    setSecondOperandMin(testParameters.secondOperandMin);
    setSecondOperandMax(testParameters.secondOperandMax);
    setSelectedOperations(testParameters.operations);
    setNumberOfResults(testParameters.numberOfResults);
    setSortResults(testParameters.sortResults);
  }, [testParameters]);
  
  const handleOperationToggle = (operation: Operation) => {
    if (selectedOperations.includes(operation)) {
      if (selectedOperations.length > 1) {
        setSelectedOperations(selectedOperations.filter(op => op !== operation));
      }
    } else {
      setSelectedOperations([...selectedOperations, operation]);
    }
  };
  
  const handleSaveSettings = () => {
    const validFirstMin = Math.min(firstOperandMin, firstOperandMax);
    const validFirstMax = Math.max(firstOperandMin, firstOperandMax);
    const validSecondMin = Math.min(secondOperandMin, secondOperandMax);
    const validSecondMax = Math.max(secondOperandMin, secondOperandMax);
    
    setTestParameters({
      firstOperandMin: validFirstMin,
      firstOperandMax: validFirstMax,
      secondOperandMin: validSecondMin,
      secondOperandMax: validSecondMax,
      operations: selectedOperations,
      numberOfResults: numberOfResults,
      sortResults: sortResults
    });
  };

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    } catch {
      window.prompt('Copy this URL:', text);
    }
    document.body.removeChild(textarea);
  };

  const handleShareSettings = () => {
    const currentSettings = {
      firstOperandMin,
      firstOperandMax,
      secondOperandMin,
      secondOperandMax,
      operations: selectedOperations,
      numberOfResults,
      sortResults
    };
    
    const queryString = serializeSettings(currentSettings);
    
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/?${queryString}`;
    
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          setShareSuccess(true);
          setTimeout(() => setShareSuccess(false), 2000);
        })
        .catch(() => {
          fallbackCopy(shareUrl);
        });
    } else {
      fallbackCopy(shareUrl);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-ctp-base">
      <div className="absolute top-4 right-4">
        <div className="relative">
          <Link 
            href="/"
            className="p-2 bg-ctp-surface0 text-ctp-text rounded-lg hover:bg-ctp-surface1 transition-colors flex items-center justify-center"
            onMouseEnter={() => setTooltip('close')}
            onMouseLeave={() => setTooltip(null)}
            aria-label={t.backToGame}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Link>
          {tooltip === 'close' && (
            <div className="absolute right-0 top-full mt-2 bg-ctp-surface2 text-ctp-text px-3 py-1 rounded text-sm whitespace-nowrap">
              {t.backToGame}
            </div>
          )}
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-8 text-ctp-blue">
        {t.settings}
      </h1>
      
      {loadedFromUrl && (
        <div className="mb-4 p-3 bg-ctp-surface0 text-ctp-text rounded-lg border border-ctp-blue">
          <p className="text-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 inline-block mr-2 text-ctp-blue" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t.loadedFromUrl}
          </p>
        </div>
      )}
      
      <div className="p-8 rounded-xl shadow-lg bg-ctp-mantle border border-ctp-surface0 w-full max-w-md mb-8">
        <h2 className="text-2xl font-bold mb-6 text-ctp-text">{t.languageSettings}</h2>
        
        <LanguageSelector 
          language={language}
          setLanguage={setLanguage}
          tooltip={tooltip}
          setTooltip={setTooltip}
        />
      </div>
      
      <div className="p-8 rounded-xl shadow-lg bg-ctp-mantle border border-ctp-surface0 w-full max-w-md mb-8">
        <h2 className="text-2xl font-bold mb-6 text-ctp-text">{t.themeSettings}</h2>
        
        <div className="flex justify-center gap-6 mb-4 flex-wrap">
          <button 
            onClick={() => setThemeMode('light')}
            className={`relative p-3 rounded-lg transition-all flex flex-col items-center ${
              themeMode === 'light' 
                ? 'bg-ctp-surface1 border-2 border-ctp-blue scale-110' 
                : 'bg-ctp-surface0 hover:bg-ctp-surface1'
            }`}
            aria-label={t.lightTheme}
          >
            <LightIcon />
            <span className="block mt-2 text-xs text-ctp-text">{t.lightTheme}</span>
          </button>
          
          <button 
            onClick={() => setThemeMode('dark')}
            className={`relative p-3 rounded-lg transition-all flex flex-col items-center ${
              themeMode === 'dark' 
                ? 'bg-ctp-surface1 border-2 border-ctp-blue scale-110' 
                : 'bg-ctp-surface0 hover:bg-ctp-surface1'
            }`}
            aria-label={t.darkTheme}
          >
            <DarkIcon />
            <span className="block mt-2 text-xs text-ctp-text">{t.darkTheme}</span>
          </button>
          
          <button 
            onClick={() => setThemeMode('system')}
            className={`relative p-3 rounded-lg transition-all flex flex-col items-center ${
              themeMode === 'system' 
                ? 'bg-ctp-surface1 border-2 border-ctp-blue scale-110' 
                : 'bg-ctp-surface0 hover:bg-ctp-surface1'
            }`}
            aria-label={t.systemTheme}
          >
            <SystemIcon />
            <span className="block mt-2 text-xs text-ctp-text">{t.systemTheme}</span>
          </button>
        </div>
        
        {themeMode === 'system' && (
          <p className="text-center text-ctp-subtext0 mt-2">
            {t.usingSystemTheme}: {currentTheme === 'dark' ? t.darkTheme : t.lightTheme}
          </p>
        )}
      </div>
      
      <div className="p-8 rounded-xl shadow-lg bg-ctp-mantle border border-ctp-surface0 w-full max-w-md mb-8">
        <h2 className="text-2xl font-bold mb-6 text-ctp-text">{t.teacherSettings}</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 text-ctp-text">{t.operandSettings}</h3>
          
          <div className="mb-4">
            <label className="block text-ctp-text mb-2">{t.firstOperandRange}</label>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-ctp-subtext0 text-sm mb-1">{t.min}</label>
                <input 
                  type="number" 
                  value={firstOperandMin}
                  onChange={(e) => setFirstOperandMin(parseInt(e.target.value) || 0)}
                  min="0"
                  max="100"
                  className="w-full p-2 rounded bg-ctp-surface0 text-ctp-text border border-ctp-surface2 focus:border-ctp-blue focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block text-ctp-subtext0 text-sm mb-1">{t.max}</label>
                <input 
                  type="number" 
                  value={firstOperandMax}
                  onChange={(e) => setFirstOperandMax(parseInt(e.target.value) || 0)}
                  min="0"
                  max="100"
                  className="w-full p-2 rounded bg-ctp-surface0 text-ctp-text border border-ctp-surface2 focus:border-ctp-blue focus:outline-none"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-ctp-text mb-2">{t.secondOperandRange}</label>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-ctp-subtext0 text-sm mb-1">{t.min}</label>
                <input 
                  type="number" 
                  value={secondOperandMin}
                  onChange={(e) => setSecondOperandMin(parseInt(e.target.value) || 0)}
                  min="0"
                  max="100"
                  className="w-full p-2 rounded bg-ctp-surface0 text-ctp-text border border-ctp-surface2 focus:border-ctp-blue focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block text-ctp-subtext0 text-sm mb-1">{t.max}</label>
                <input 
                  type="number" 
                  value={secondOperandMax}
                  onChange={(e) => setSecondOperandMax(parseInt(e.target.value) || 0)}
                  min="0"
                  max="100"
                  className="w-full p-2 rounded bg-ctp-surface0 text-ctp-text border border-ctp-surface2 focus:border-ctp-blue focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 text-ctp-text">{t.operationSettings}</h3>
          
          <OperationToggle 
          options={['addition', 'subtraction', 'multiplication', 'division']}
          selected={selectedOperations}
          onToggle={handleOperationToggle}
          className="flex gap-4 mb-4"
          renderButtonClass={(op, active) => 
            `p-3 rounded-lg transition-all flex items-center justify-center flex-1 ${
              active
                ? 'bg-ctp-surface1 border-2 border-ctp-blue'
                : 'bg-ctp-surface0 hover:bg-ctp-surface1'
            }`
          }
        />
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 text-ctp-text">{t.resultOptions}</h3>
          
          <div className="mb-4">
            <label className="block text-ctp-text mb-2">{t.numberOfResults}</label>
            <input 
              type="range" 
              min="2" 
              max="8" 
              step="1"
              value={numberOfResults}
              onChange={(e) => setNumberOfResults(parseInt(e.target.value))}
              className="w-full h-2 bg-ctp-surface0 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-ctp-subtext0 text-sm mt-1">
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
              <span>7</span>
              <span>8</span>
            </div>
            <div className="text-center text-ctp-text mt-2">
              {numberOfResults}
            </div>
          </div>
          
          <div className="mb-4 flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={sortResults}
                onChange={() => setSortResults(!sortResults)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-ctp-surface0 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-ctp-text after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ctp-blue"></div>
              <span className="ml-3 text-ctp-text">{t.sortResults}</span>
            </label>
          </div>
          <p className="text-ctp-subtext0 text-sm">{t.sortResultsDescription}</p>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={handleSaveSettings}
            className="flex-1 px-6 py-3 bg-ctp-blue text-ctp-base font-bold rounded-lg hover:bg-ctp-lavender transition-colors"
          >
            {t.saveSettings}
          </button>
          
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
      </div>
      
      <div className="mt-4 flex justify-center">
        <Link 
          href="/"
          className="px-6 py-3 bg-ctp-blue text-ctp-base font-bold rounded-lg hover:bg-ctp-lavender transition-colors"
        >
          {t.backToGame}
        </Link>
      </div>
    </div>
  );
}
