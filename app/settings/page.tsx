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

const shareButtonClass =
  'w-full min-h-14 flex items-center justify-center px-4 py-3 rounded-full border-[3px] border-neo-ink box-shadow-hard font-bold text-base leading-tight text-center text-black transition-all';

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

const cardClass =
  'p-4 sm:p-6 md:p-8 rounded-2xl bg-neo-surface dark:bg-neo-ground border-4 border-neo-ink box-shadow-hard w-full max-w-md mb-6 sm:mb-8';

const sectionTitleClass = 'text-2xl font-bold mb-5 text-neo-ink';
const groupTitleClass = 'text-xl font-semibold mb-3 text-neo-ink';
const fieldLabelClass = 'block text-neo-ink font-bold mb-2';
const subLabelClass = 'block text-neo-ink-muted text-sm font-bold mb-1';
const numberInputClass =
  'w-full h-12 px-3 rounded-xl bg-neo-surface-muted text-neo-ink text-lg font-bold border-[3px] border-neo-ink focus:outline-none focus-visible:ring-4 focus-visible:ring-neo-blue';

const answerCountOptions = [2, 3, 4, 5, 6, 7, 8];

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
  const [shareTooltip, setShareTooltip] = useState<boolean>(false);
  const [shareResult, setShareResult] = useState<{ query: string; method: 'share' | 'copy' } | null>(null);
  const [failedQuery, setFailedQuery] = useState<string | null>(null);

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
    comparisonModes
  }), [firstOperandMin, firstOperandMax, secondOperandMin, secondOperandMax, selectedOperations, numberOfResults, sortResults, roundingNearest, roundingAnswers, roundingNumberLine, comparisonModes]);

  const currentQuery = useMemo(() => serializeSettings(currentSettings), [currentSettings]);
  const storedQuery = useMemo(() => serializeSettings(testParameters), [testParameters]);
  const saveStatus: ActionStatus = failedQuery === currentQuery ? 'error' : storedQuery === currentQuery ? 'success' : 'idle';
  const shareStatus: ActionStatus = shareResult?.query === currentQuery ? 'success' : 'idle';

  useEffect(() => {
    if (currentQuery === storedQuery || currentQuery === failedQuery) return;
    try {
      setTestParameters(currentSettings);
      setFailedQuery(null);
    } catch {
      setFailedQuery(currentQuery);
    }
  }, [currentQuery, storedQuery, failedQuery, currentSettings, setTestParameters]);

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
      <div
        data-testid="settings-header"
        className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-neo-pink dark:bg-neo-surface border-b-4 border-neo-ink"
      >
        <h1 className="text-2xl sm:text-3xl font-black text-neo-ink truncate">
          {t.settings}
        </h1>

        <div className="flex items-center gap-3 shrink-0">
          <p
            role="status"
            aria-live="polite"
            data-testid="autosave-status"
            data-status={saveStatus}
            className={`flex items-center gap-1.5 h-10 px-3 rounded-full border-[3px] border-neo-ink text-sm font-bold text-black ${saveStatus === 'error' ? 'bg-neo-red' : 'bg-neo-green'}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={saveStatus === 'error' ? 'M12 8v5m0 4h.01' : 'M5 13l4 4L19 7'} />
            </svg>
            <span className="max-sm:sr-only">{saveStatus === 'error' ? t.saveFailed : t.autoSaved}</span>
          </p>

          <div className="relative" data-testid="settings-close">
            <Link
              href="/"
              className="h-12 w-12 bg-neo-surface text-neo-ink border-4 border-neo-ink box-shadow-hard rounded-2xl hover:bg-neo-surface-muted flex items-center justify-center"
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
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </Link>
            {tooltip === 'close' && (
              <div className="absolute right-0 top-full mt-2 bg-neo-ink text-neo-ground px-3 py-1 rounded-xl text-base font-bold whitespace-nowrap">
                {t.backToGame}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-start py-6 sm:py-8 p-4 sm:p-6 md:p-8">
        {loadedFromUrl && (
          <div className="mb-6 w-full max-w-md px-4 py-3 bg-neo-blue text-black font-bold rounded-xl border-[3px] border-neo-ink box-shadow-hard">
            <p className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 inline-block mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t.loadedFromUrl}
            </p>
          </div>
        )}

        <div className={cardClass}>
          <h2 className={sectionTitleClass}>{t.languageSettings}</h2>

          <LanguageSelector
            language={language}
            setLanguage={setLanguage}
            ariaLabel={t.selectLanguage}
          />
        </div>

        <div className={cardClass}>
          <h2 className={sectionTitleClass}>{t.themeSettings}</h2>

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

        <div className={cardClass}>
          <h2 className={sectionTitleClass}>{t.teacherSettings}</h2>

          <div className="mb-6">
            <h3 className={groupTitleClass}>{t.operandSettings}</h3>

            <div className="mb-4">
              <label className={fieldLabelClass}>{t.firstOperandRange}</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className={subLabelClass}>{t.min}</label>
                  <input
                    type="number"
                    value={firstOperandMin}
                    onChange={(e) => setFirstOperandMin(parseInt(e.target.value) || 0)}
                    min="0"
                    max="100"
                    className={numberInputClass}
                  />
                </div>
                <div className="flex-1">
                  <label className={subLabelClass}>{t.max}</label>
                  <input
                    type="number"
                    value={firstOperandMax}
                    onChange={(e) => setFirstOperandMax(parseInt(e.target.value) || 0)}
                    min="0"
                    max="100"
                    className={numberInputClass}
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className={fieldLabelClass}>{t.secondOperandRange}</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className={subLabelClass}>{t.min}</label>
                  <input
                    type="number"
                    value={secondOperandMin}
                    onChange={(e) => setSecondOperandMin(parseInt(e.target.value) || 0)}
                    min="0"
                    max="100"
                    className={numberInputClass}
                  />
                </div>
                <div className="flex-1">
                  <label className={subLabelClass}>{t.max}</label>
                  <input
                    type="number"
                    value={secondOperandMax}
                    onChange={(e) => setSecondOperandMax(parseInt(e.target.value) || 0)}
                    min="0"
                    max="100"
                    className={numberInputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className={groupTitleClass}>{t.operationSettings}</h3>

            <OperationToggle
              options={allOperations}
              selected={selectedOperations}
              onToggle={handleOperationToggle}
              className="grid grid-cols-3 gap-3 mb-4"
              activeOverlayClass={null}
              showLabels
              renderButtonClass={(_op, active) => `${chipClass(active)} flex flex-col items-center justify-center gap-0.5 py-2 px-2`}
            />
          </div>

          {selectedOperations.includes('rounding') && (
            <div className="mb-6" data-testid="rounding-settings">
              <h3 className={groupTitleClass}>{t.roundingSettings}</h3>

              <div className="mb-4">
                <label className={fieldLabelClass}>{t.roundToNearest}</label>
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
                <label className={fieldLabelClass}>{t.roundingAnswers}</label>
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
              <h3 className={groupTitleClass}>{t.comparisonSettings}</h3>

              <div className="mb-4">
                <label className={fieldLabelClass}>{t.compareWhat}</label>
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
            <h3 className={groupTitleClass}>{t.resultOptions}</h3>

            <div className="mb-4">
              <label className={fieldLabelClass}>{t.numberOfResults}</label>
              <div className="flex flex-wrap gap-2" role="group" aria-label={t.numberOfResults}>
                {answerCountOptions.map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setNumberOfResults(count)}
                    aria-pressed={numberOfResults === count}
                    className={`${chipClass(numberOfResults === count)} min-w-12`}
                  >
                    {count}
                  </button>
                ))}
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

          <div className="relative">
              <button
                onClick={handleShareSettings}
                onMouseEnter={() => setShareTooltip(true)}
                onMouseLeave={() => setShareTooltip(false)}
                data-status={shareStatus}
                aria-live="polite"
                className={`${shareButtonClass} ${statusFill[shareStatus]}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="h-5 w-5 mr-2 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                {shareStatus === 'success' ? (shareResult?.method === 'share' ? t.shared : t.copied) : t.shareSettings}
              </button>

              {shareTooltip && shareStatus !== 'success' && (
                <div className="absolute right-0 top-full mt-3 z-10 bg-neo-ink text-neo-ground px-3 py-1 rounded-xl text-base font-bold whitespace-nowrap">
                  {t.shareSettingsTooltip}
                </div>
              )}
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
