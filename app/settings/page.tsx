'use client';

import { useLanguage } from '../LanguageContext';
import {
  useTestParameters,
  TestParameters,
  Operation,
  allOperations,
  RoundingNearest,
  roundingNearestOptions,
  RoundingAnswers,
  roundingAnswersOptions,
  ComparisonMode,
  comparisonModeOptions,
  AutoAdvanceSpeed,
  autoAdvanceSpeedOptions,
} from '../TestParametersContext';
import { translations } from '../translations';
import Link from 'next/link';
import { OperationToggle } from '../components/OperationToggle';
import { LanguageSelector } from '../components/LanguageSelector';
import { useTheme, ThemeMode, themeModes } from '../ThemeContext';
import { LightIcon, DarkIcon, SystemIcon } from '../components/ThemeIcons';
import React, { useState, useEffect, useMemo } from 'react';
import { serializeSettings } from '../utils/settingsQueryString';

const actionButtonClass =
  'flex items-center justify-center px-6 py-3 rounded-full border-[3px] border-neo-ink box-shadow-hard font-bold transition-all';

const splitButtonClass =
  'w-full h-full min-h-16 flex items-center justify-center px-3 py-3 rounded-full border-[3px] border-neo-ink box-shadow-hard font-bold text-sm sm:text-base leading-tight text-center text-black transition-all';

type ActionStatus = 'idle' | 'success' | 'error';

const statusFill: Record<ActionStatus, string> = {
  idle: 'bg-neo-blue',
  success: 'bg-neo-green',
  error: 'bg-neo-red',
};

const chipClass = (active: boolean) =>
  `px-4 py-2 rounded-full border-[3px] border-neo-ink font-bold transition-all ${active
    ? 'bg-neo-orange text-black box-shadow-hard'
    : 'bg-neo-surface text-neo-ink hover:bg-neo-surface-muted'
  }`;

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
    <span
      aria-hidden="true"
      className="relative shrink-0 w-14 h-8 rounded-full border-[3px] border-neo-ink bg-neo-surface-muted transition-colors peer-checked:bg-neo-green peer-focus-visible:ring-4 peer-focus-visible:ring-neo-blue after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:h-5 after:w-5 after:rounded-full after:bg-neo-ink after:transition-transform peer-checked:after:translate-x-6"
    />
    <span className="ml-3 text-neo-ink font-bold">{label}</span>
  </label>
);

const autoAdvanceLabelKey: Record<AutoAdvanceSpeed, 'autoAdvanceOff' | 'autoAdvanceSlow' | 'autoAdvanceMedium' | 'autoAdvanceFast'> = {
  off: 'autoAdvanceOff',
  slow: 'autoAdvanceSlow',
  medium: 'autoAdvanceMedium',
  fast: 'autoAdvanceFast',
};

const themeIcons: Record<ThemeMode, React.FC> = {
  light: LightIcon,
  dark: DarkIcon,
  system: SystemIcon,
};

export default function Settings() {
  const { language, setLanguage } = useLanguage();
  const { themeMode, setThemeMode } = useTheme();
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
  const [roundingNearest, setRoundingNearest] = useState<RoundingNearest[]>(testParameters.roundingNearest);
  const [roundingAnswers, setRoundingAnswers] = useState<RoundingAnswers>(testParameters.roundingAnswers);
  const [roundingNumberLine, setRoundingNumberLine] = useState<boolean>(testParameters.roundingNumberLine);
  const [comparisonModes, setComparisonModes] = useState<ComparisonMode[]>(testParameters.comparisonModes);
  const [autoAdvance, setAutoAdvance] = useState<AutoAdvanceSpeed>(testParameters.autoAdvance);
  const [shareTooltip, setShareTooltip] = useState<boolean>(false);
  const [shareResult, setShareResult] = useState<{ query: string; method: 'share' | 'copy' } | null>(null);
  const [saveResult, setSaveResult] = useState<{ query: string; status: ActionStatus } | null>(null);

  useEffect(() => {
    setFirstOperandMin(testParameters.firstOperandMin);
    setFirstOperandMax(testParameters.firstOperandMax);
    setSecondOperandMin(testParameters.secondOperandMin);
    setSecondOperandMax(testParameters.secondOperandMax);
    setSelectedOperations(testParameters.operations);
    setNumberOfResults(testParameters.numberOfResults);
    setSortResults(testParameters.sortResults);
    setRoundingNearest(testParameters.roundingNearest);
    setRoundingAnswers(testParameters.roundingAnswers);
    setRoundingNumberLine(testParameters.roundingNumberLine);
    setComparisonModes(testParameters.comparisonModes);
    setAutoAdvance(testParameters.autoAdvance);
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

  const handleRoundingNearestToggle = (nearest: RoundingNearest) => {
    if (roundingNearest.includes(nearest)) {
      if (roundingNearest.length > 1) {
        setRoundingNearest(roundingNearest.filter(n => n !== nearest));
      }
    } else {
      setRoundingNearest(roundingNearestOptions.filter(n => n === nearest || roundingNearest.includes(n)));
    }
  };

  const handleComparisonModeToggle = (mode: ComparisonMode) => {
    if (comparisonModes.includes(mode)) {
      if (comparisonModes.length > 1) {
        setComparisonModes(comparisonModes.filter(m => m !== mode));
      }
    } else {
      setComparisonModes([...comparisonModes, mode]);
    }
  };

  const currentSettings = useMemo<TestParameters>(() => ({
    firstOperandMin: Math.min(firstOperandMin, firstOperandMax),
    firstOperandMax: Math.max(firstOperandMin, firstOperandMax),
    secondOperandMin: Math.min(secondOperandMin, secondOperandMax),
    secondOperandMax: Math.max(secondOperandMin, secondOperandMax),
    operations: selectedOperations,
    numberOfResults,
    sortResults,
    roundingNearest,
    roundingAnswers,
    roundingNumberLine,
    comparisonModes,
    autoAdvance
  }), [firstOperandMin, firstOperandMax, secondOperandMin, secondOperandMax, selectedOperations, numberOfResults, sortResults, roundingNearest, roundingAnswers, roundingNumberLine, comparisonModes, autoAdvance]);

  const currentQuery = useMemo(() => serializeSettings(currentSettings), [currentSettings]);
  const saveStatus: ActionStatus = saveResult?.query === currentQuery ? saveResult.status : 'idle';
  const shareStatus: ActionStatus = shareResult?.query === currentQuery ? 'success' : 'idle';

  const handleSaveSettings = () => {
    try {
      setTestParameters(currentSettings);
      setSaveResult({ query: currentQuery, status: 'success' });
    } catch {
      setSaveResult({ query: currentQuery, status: 'error' });
    }
  };

  const fallbackCopy = (text: string, query: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch {
      copied = false;
    }
    document.body.removeChild(textarea);
    if (copied) {
      setShareResult({ query, method: 'copy' });
    } else {
      window.prompt('Copy this URL:', text);
    }
  };

  const copyShareUrl = (shareUrl: string, query: string) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => setShareResult({ query, method: 'copy' }))
        .catch(() => fallbackCopy(shareUrl, query));
    } else {
      fallbackCopy(shareUrl, query);
    }
  };

  const handleShareSettings = () => {
    const query = currentQuery;
    const shareUrl = `${window.location.origin}/?${query}`;
    const shareData: ShareData = { title: t.title, url: shareUrl };

    if (typeof navigator.share === 'function' && (navigator.canShare?.(shareData) ?? true)) {
      navigator.share(shareData)
        .then(() => setShareResult({ query, method: 'share' }))
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === 'AbortError') return;
          copyShareUrl(shareUrl, query);
        });
    } else {
      copyShareUrl(shareUrl, query);
    }
  };

  return (
    <div className="fixed inset-4 sm:inset-6 md:inset-8 bg-neo-pink dark:bg-neo-surface border-4 border-neo-ink shadow-hard rounded-neo overflow-y-auto">
      <div className="flex min-h-full flex-col items-center justify-start py-8 sm:py-12 p-4 sm:p-6 md:p-8">
        <div className="fixed top-8 right-8 sm:top-10 sm:right-10 md:top-12 md:right-12 z-20" data-testid="settings-close">
          <div className="relative">
            <Link
              href="/"
              className="p-2 bg-neo-surface text-neo-ink border-[3px] border-neo-ink box-shadow-hard rounded-2xl hover:bg-neo-surface-muted flex items-center justify-center"
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
              <div className="absolute right-0 top-full mt-2 bg-neo-ink text-neo-ground px-3 py-1 rounded-xl text-sm font-bold whitespace-nowrap">
                {t.backToGame}
              </div>
            )}
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-ctp-blue">
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

        <div className="p-4 sm:p-6 md:p-8 rounded-xl shadow-lg bg-ctp-mantle border border-ctp-surface0 w-full max-w-md mb-6 sm:mb-8">
          <h2 className="text-2xl font-bold mb-6 text-ctp-text">{t.languageSettings}</h2>

          <LanguageSelector
            language={language}
            setLanguage={setLanguage}
            tooltip={tooltip}
            setTooltip={setTooltip}
          />
        </div>

        <div className="p-4 sm:p-6 md:p-8 rounded-xl shadow-lg bg-ctp-mantle border border-ctp-surface0 w-full max-w-md mb-6 sm:mb-8">
          <h2 className="text-2xl font-bold mb-6 text-ctp-text">{t.themeSettings}</h2>

          <div className="flex flex-wrap gap-2" role="group" aria-label={t.themeSettings}>
            {themeModes.map((mode) => {
              const Icon = themeIcons[mode];
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setThemeMode(mode)}
                  aria-pressed={themeMode === mode}
                  className={`${chipClass(themeMode === mode)} flex items-center gap-2`}
                >
                  <Icon />
                  {t[`${mode}Theme`]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 rounded-xl shadow-lg bg-ctp-mantle border border-ctp-surface0 w-full max-w-md mb-6 sm:mb-8">
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
              options={allOperations}
              selected={selectedOperations}
              onToggle={handleOperationToggle}
              className="grid grid-cols-3 gap-3 mb-4"
              activeOverlayClass={null}
              renderButtonClass={(_op, active) => `${chipClass(active)} flex items-center justify-center`}
            />
          </div>

          {selectedOperations.includes('rounding') && (
            <div className="mb-6" data-testid="rounding-settings">
              <h3 className="text-xl font-semibold mb-4 text-ctp-text">{t.roundingSettings}</h3>

              <div className="mb-4">
                <label className="block text-ctp-text mb-2">{t.roundToNearest}</label>
                <div className="flex flex-wrap gap-2" role="group" aria-label={t.roundToNearest}>
                  {roundingNearestOptions.map((nearest) => (
                    <button
                      key={nearest}
                      type="button"
                      onClick={() => handleRoundingNearestToggle(nearest)}
                      aria-pressed={roundingNearest.includes(nearest)}
                      className={chipClass(roundingNearest.includes(nearest))}
                    >
                      {nearest}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-ctp-text mb-2">{t.roundingAnswers}</label>
                <div className="flex flex-wrap gap-2" role="group" aria-label={t.roundingAnswers}>
                  {roundingAnswersOptions.map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setRoundingAnswers(count)}
                      aria-pressed={roundingAnswers === count}
                      className={chipClass(roundingAnswers === count)}
                    >
                      {count === 2 ? t.roundingAnswersTwo : t.roundingAnswersFour}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4 flex items-center">
                <ToggleSwitch
                  checked={roundingNumberLine}
                  onChange={() => setRoundingNumberLine(!roundingNumberLine)}
                  label={t.showNumberLine}
                />
              </div>
            </div>
          )}

          {selectedOperations.includes('comparison') && (
            <div className="mb-6" data-testid="comparison-settings">
              <h3 className="text-xl font-semibold mb-4 text-ctp-text">{t.comparisonSettings}</h3>

              <div className="mb-4">
                <label className="block text-ctp-text mb-2">{t.compareWhat}</label>
                <div className="flex flex-wrap gap-2" role="group" aria-label={t.compareWhat}>
                  {comparisonModeOptions.map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => handleComparisonModeToggle(mode)}
                      aria-pressed={comparisonModes.includes(mode)}
                      className={chipClass(comparisonModes.includes(mode))}
                    >
                      {mode === 'numbers' ? t.compareNumbers : t.compareSums}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

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
              <ToggleSwitch
                checked={sortResults}
                onChange={() => setSortResults(!sortResults)}
                label={sortResults ? t.sortResultsDescription : t.randomizeResults}
              />
            </div>
          </div>

          <div className="mb-6" data-testid="auto-advance-settings">
            <h3 className="text-xl font-semibold mb-4 text-ctp-text">{t.autoAdvanceSettings}</h3>

            <div className="mb-4">
              <label className="block text-ctp-text mb-2">{t.autoAdvanceLabel}</label>
              <div className="flex flex-wrap gap-2" role="group" aria-label={t.autoAdvanceLabel}>
                {autoAdvanceSpeedOptions.map((speed) => (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => setAutoAdvance(speed)}
                    aria-pressed={autoAdvance === speed}
                    className={chipClass(autoAdvance === speed)}
                  >
                    {t[autoAdvanceLabelKey[speed]]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleSaveSettings}
              data-status={saveStatus}
              aria-live="polite"
              className={`${splitButtonClass} ${statusFill[saveStatus]}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={saveStatus === 'error' ? 'M12 8v5m0 4h.01' : 'M5 13l4 4L19 7'} />
              </svg>
              {saveStatus === 'success' ? t.saved : saveStatus === 'error' ? t.saveFailed : t.saveSettings}
            </button>

            <div className="relative">
              <button
                onClick={handleShareSettings}
                onMouseEnter={() => setShareTooltip(true)}
                onMouseLeave={() => setShareTooltip(false)}
                data-status={shareStatus}
                aria-live="polite"
                className={`${splitButtonClass} ${statusFill[shareStatus]}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="h-5 w-5 mr-2 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                {shareStatus === 'success' ? (shareResult?.method === 'share' ? t.shared : t.copied) : t.shareSettings}
              </button>

              {shareTooltip && shareStatus !== 'success' && (
                <div className="absolute right-0 top-full mt-3 z-10 bg-neo-ink text-neo-ground px-3 py-1 rounded-xl text-sm font-bold whitespace-nowrap">
                  {t.shareSettingsTooltip}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center mb-8">
          <Link
            href="/"
            className={`${actionButtonClass} bg-neo-surface text-neo-ink`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            {t.backToGame}
          </Link>
        </div>
      </div>
    </div>
  );
}
