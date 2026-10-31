'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';
import { useTestParameters, Operation } from './TestParametersContext';
import { translations } from './translations';
import { SettingsIcon } from './components/SettingsIcon';
import { FitTitle } from './components/FitTitle';
import { generateProblem, generateOptionsForProblem, pickRandomOperation, isAnswerCorrect, comparisonSymbol } from './utils/mathLogic';
import { ProblemDisplay } from './components/ProblemDisplay';
import { ResultGrid } from './components/ResultGrid';
import { ProgressTray } from './components/ProgressTray';
import { Mascot } from './components/Mascot';
import confetti from 'canvas-confetti';

const AUTO_ADVANCE_MS = 2000;
const AUTO_PRESS_MS = 160;
const WRONG_SHAKE_MS = 800;
const SET_SIZE = 10;

const CONFETTI_COLORS = ['#FFDE00', '#38BDF8', '#F472B6', '#4ADE80', '#FB923C'];

const fill = (template: string, values: Record<string, number>) =>
  Object.entries(values).reduce((text, [key, value]) => text.replace(`{${key}}`, String(value)), template);

export default function Home() {
  const { language } = useLanguage();
  const { testParameters } = useTestParameters();
  const t = translations[language];
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [operation, setOperation] = useState<Operation>(() => pickRandomOperation(testParameters.operations));
  const [problemSeed, setProblemSeed] = useState<number>(0);

  const [pendingPick, setPendingPick] = useState<number | null>(null);
  const [wrongPicks, setWrongPicks] = useState<number[]>([]);
  const [isAutoPressing, setIsAutoPressing] = useState<boolean>(false);
  const [solved, setSolved] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [isSetDone, setIsSetDone] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const activeOperation = testParameters.operations.includes(operation)
    ? operation
    : testParameters.operations[0] || 'addition';

  if (activeOperation !== operation) {
    setOperation(activeOperation);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentProblem = useMemo(() => generateProblem(testParameters, activeOperation), [testParameters, activeOperation, problemSeed]);

  const answerOptions = useMemo(
    () => generateOptionsForProblem(currentProblem, testParameters),
    [currentProblem, testParameters]
  );

  const clearAllTimers = useCallback(() => {
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
  }, []);

  const generateNewProblem = useCallback(() => {
    clearAllTimers();
    setOperation(pickRandomOperation(testParameters.operations));
    setProblemSeed(s => s + 1);
    setFeedback(null);
    setIsAnimating(false);
    setPendingPick(null);
    setWrongPicks([]);
    setIsAutoPressing(false);
  }, [clearAllTimers, testParameters.operations]);

  const advance = useCallback(() => {
    if (solved >= SET_SIZE) {
      clearAllTimers();
      setIsSetDone(true);
      confetti({ particleCount: 320, spread: 120, startVelocity: 45, origin: { y: 0.5 }, colors: CONFETTI_COLORS });
      return;
    }
    generateNewProblem();
  }, [solved, clearAllTimers, generateNewProblem]);

  const skipProblem = useCallback(() => {
    setStreak(0);
    generateNewProblem();
  }, [generateNewProblem]);

  const startNewSet = useCallback(() => {
    setSolved(0);
    setIsSetDone(false);
    generateNewProblem();
  }, [generateNewProblem]);

  const handleCountdownEnd = useCallback(() => {
    clearAllTimers();
    setIsAutoPressing(true);
    feedbackTimerRef.current = setTimeout(advance, AUTO_PRESS_MS);
  }, [clearAllTimers, advance]);

  const handleOptionClick = useCallback((answer: number) => {
    if (isAnimating || feedback === 'correct') return;

    const ok = isAnswerCorrect(answer, currentProblem.answer);
    setPendingPick(answer);
    setFeedback(ok ? 'correct' : 'incorrect');
    setIsAnimating(true);

    if (ok) {
      setSolved(s => s + 1);
      setStreak(s => (wrongPicks.length === 0 ? s + 1 : 0));
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: CONFETTI_COLORS
      });
      return;
    }

    setStreak(0);
    setWrongPicks(picks => [...picks, answer]);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => {
      setIsAnimating(false);
      setFeedback(null);
      setPendingPick(null);
    }, WRONG_SHAKE_MS);
  }, [isAnimating, feedback, currentProblem.answer, wrongPicks.length]);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  if (!isMounted) {
    return <div className="flex min-h-dvh flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-neo-ground" />;
  }

  const isCorrect = feedback === 'correct';
  const peripheralOpacity = isAnimating && !isCorrect ? 'opacity-30 pointer-events-none' : 'opacity-100';
  const shownSolved = Math.min(solved, SET_SIZE);

  return (
    <div className="flex min-h-dvh flex-col items-center p-4 sm:p-6 md:p-8 bg-neo-ground transition-colors duration-500">

      <header className={`w-full max-w-xl flex items-start justify-between gap-3 transition-opacity duration-300 ${peripheralOpacity}`}>
        <ProgressTray
          solved={shownSolved}
          total={SET_SIZE}
          streak={streak}
          progressLabel={fill(t.progressLabel, { n: shownSolved, total: SET_SIZE })}
          streakLabel={fill(t.streakLabel, { n: streak })}
        />
        <div className="relative shrink-0">
          <Link
            href="/settings"
            className="h-12 w-12 max-sm:h-10 max-sm:w-10 bg-neo-surface text-neo-ink border-4 border-neo-ink box-shadow-hard rounded-2xl hover:bg-neo-surface-muted flex items-center justify-center"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            aria-label={t.settings}
          >
            <SettingsIcon />
          </Link>
          {showTooltip && (
            <div className="absolute right-0 top-full mt-2 bg-neo-ink text-neo-ground px-3 py-1 rounded-xl text-base font-bold whitespace-nowrap z-20">
              {t.settings}
            </div>
          )}
        </div>
      </header>

      <main className="my-auto w-full flex flex-col items-center gap-4 sm:gap-6 md:gap-8 py-4 sm:py-6">
        <FitTitle maxViewportHeightRatio={0.06} maxSize={56} className="w-full max-w-md lg:max-w-xl text-3xl leading-none font-black text-neo-ink tracking-tight text-center">
          {t.title}
        </FitTitle>

        {isSetDone ? (
          <section
            data-testid="set-complete"
            className="w-full max-w-md lg:max-w-xl flex flex-col items-center gap-5 p-6 sm:p-8 rounded-2xl bg-neo-surface border-4 border-neo-ink box-shadow-hard text-center"
          >
            <Mascot className="w-28 h-28 sm:w-36 sm:h-36 pointer-events-none" mood="happy" />
            <p className="text-4xl sm:text-5xl font-black text-neo-ink">{fill(t.setDone, { n: SET_SIZE })}</p>
            <button
              type="button"
              autoFocus
              onClick={startNewSet}
              className="px-8 py-4 font-black text-2xl sm:text-3xl bg-neo-green text-black border-4 border-neo-ink rounded-full box-shadow-hard transition-all"
            >
              {t.keepGoing}
            </button>
          </section>
        ) : (
          <>
            <ProblemDisplay
              firstNumber={currentProblem.num1}
              secondNumber={currentProblem.num2}
              operation={activeOperation}
              feedback={feedback}
              isAnimating={isAnimating}
              t={t}
              answer={currentProblem.answer}
              addends={currentProblem.addends}
              showNumberLine={testParameters.roundingNumberLine}
            />

            <ResultGrid
              answerOptions={answerOptions}
              correctValue={isCorrect ? currentProblem.answer : null}
              wrongValues={wrongPicks}
              pendingValue={pendingPick}
              onOptionClick={handleOptionClick}
              formatLabel={activeOperation === 'comparison' ? comparisonSymbol : undefined}
              shape={activeOperation === 'comparison' ? 'square' : 'pill'}
            />

            <button
              type="button"
              onClick={isCorrect ? advance : skipProblem}
              data-testid="advance-button"
              className={`auto-advance relative overflow-hidden border-4 border-neo-ink rounded-full transition-all ${
                isCorrect
                  ? 'px-8 py-3 sm:px-10 sm:py-4 font-black text-2xl sm:text-3xl bg-green-200 text-black'
                  : 'px-6 py-2.5 sm:px-8 sm:py-3 font-bold text-lg sm:text-xl bg-neo-surface text-neo-ink'
              } ${
                isAutoPressing ? 'translate-x-2 translate-y-2' : 'box-shadow-hard active:translate-y-2 active:translate-x-2 active:shadow-none'
              }`}
            >
              {isCorrect && (
                <span
                  data-testid="auto-advance-fill"
                  aria-hidden="true"
                  className="auto-advance-fill absolute left-0 top-0 bottom-0 bg-neo-green"
                  style={{ animationDuration: `${AUTO_ADVANCE_MS}ms` }}
                  onAnimationEnd={handleCountdownEnd}
                />
              )}
              <span className="relative flex items-center gap-2">
                {isCorrect ? t.next : t.skip}
                <span aria-hidden="true">{isCorrect ? '→' : '↷'}</span>
              </span>
            </button>
          </>
        )}
      </main>
    </div>
  );
}
