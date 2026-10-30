'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';
import { useTestParameters, Operation, autoAdvanceDelayMs } from './TestParametersContext';
import { translations } from './translations';
import { SettingsIcon } from './components/SettingsIcon';
import { FitTitle } from './components/FitTitle';
import { generateProblem, generateOptionsForProblem, pickRandomOperation, isAnswerCorrect, comparisonSymbol } from './utils/mathLogic';
import { ProblemDisplay } from './components/ProblemDisplay';
import { ResultGrid } from './components/ResultGrid';
import confetti from 'canvas-confetti';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';

const AUTO_PRESS_MS = 160;
const SLIDE_TRANSITION = { duration: 0.25, ease: 'easeOut' } as const;

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

  const [selectedOptionValue, setSelectedOptionValue] = useState<number | null>(null);
  const [isAutoPressing, setIsAutoPressing] = useState<boolean>(false);
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
    setSelectedOptionValue(null);
    setIsAutoPressing(false);
  }, [clearAllTimers, testParameters.operations]);

  const handleCountdownEnd = useCallback(() => {
    clearAllTimers();
    setIsAutoPressing(true);
    feedbackTimerRef.current = setTimeout(generateNewProblem, AUTO_PRESS_MS);
  }, [clearAllTimers, generateNewProblem]);

  const commitAnswer = useCallback((answer: number) => {
    if (isAnimating) return;

    const ok = isAnswerCorrect(answer, currentProblem.answer);
    setFeedback(ok ? 'correct' : 'incorrect');
    setIsAnimating(true);

    if (ok) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFDE00', '#38BDF8', '#F472B6', '#4ADE80', '#FB923C']
      });
      return;
    }

    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => {
      setIsAnimating(false);
      setSelectedOptionValue(null);
    }, 800);
  }, [isAnimating, currentProblem.answer]);

  const handleOptionClick = useCallback((option: number) => {
    if (isAnimating && feedback === 'correct') return; // prevent clicking once correct
    setSelectedOptionValue(option);
    commitAnswer(option);
  }, [commitAnswer, isAnimating, feedback]);



  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  if (!isMounted) {
    return <div className="flex h-dvh flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-neo-ground" />;
  }

  const peripheralOpacity = isAnimating && feedback !== 'correct' ? 'opacity-30 pointer-events-none' : 'opacity-100';
  const isCorrect = feedback === 'correct';
  const autoAdvanceMs = autoAdvanceDelayMs[testParameters.autoAdvance];
  const countsDown = isCorrect && autoAdvanceMs > 0;

  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-5 sm:gap-8 md:gap-10 p-4 sm:p-6 md:p-8 overflow-hidden bg-neo-ground transition-colors duration-500">

      <div className={`absolute top-4 right-4 max-sm:top-2 max-sm:right-2 transition-opacity duration-300 ${peripheralOpacity}`}>
        <div className="relative">
          <Link
            href="/settings"
            className="p-3 max-sm:p-2 bg-neo-surface text-neo-ink border-4 border-neo-ink box-shadow-hard rounded-2xl hover:bg-neo-surface-muted flex items-center justify-center"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            aria-label={t.settings}
          >
            <SettingsIcon />
          </Link>
          {showTooltip && (
            <div className="absolute right-0 top-full mt-2 bg-neo-ink text-neo-ground px-4 py-2 rounded-xl text-lg font-bold whitespace-nowrap z-20">
              {t.settings}
            </div>
          )}
        </div>
      </div>

      <FitTitle maxViewportHeightRatio={0.1} className="w-full max-w-md lg:max-w-xl max-sm:px-14 text-4xl leading-none font-black text-neo-ink tracking-tight text-center drop-shadow-md">
        {t.title}
      </FitTitle>

      <MotionConfig reducedMotion="user">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={problemSeed}
            data-testid="problem-slide"
            className="w-full flex justify-center"
            initial={{ x: '120%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-120%', opacity: 0 }}
            transition={SLIDE_TRANSITION}
          >
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
          </motion.div>
        </AnimatePresence>
      </MotionConfig>

      <ResultGrid
        answerOptions={answerOptions}
        selectedOptionValue={selectedOptionValue}
        onOptionClick={handleOptionClick}
        formatLabel={activeOperation === 'comparison' ? comparisonSymbol : undefined}
        shape={activeOperation === 'comparison' ? 'square' : 'pill'}
      />

      <div className="mt-1 sm:mt-0">
        <button
          type="button"
          onClick={generateNewProblem}
          disabled={!isCorrect}
          className={`auto-advance relative overflow-hidden px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 font-black text-xl sm:text-2xl md:text-3xl border-4 border-neo-ink rounded-full transition-all ${
            countsDown ? 'bg-green-200 text-black' : isCorrect ? 'bg-neo-green text-black' : 'bg-neo-surface text-neo-ink opacity-50'
          } ${
            isAutoPressing ? 'translate-x-2 translate-y-2' : 'box-shadow-hard active:translate-y-2 active:translate-x-2 active:shadow-none'
          }`}
        >
          {countsDown && (
            <span
              data-testid="auto-advance-fill"
              aria-hidden="true"
              className="auto-advance-fill absolute left-0 top-0 bottom-0 bg-neo-green"
              style={{ animationDuration: `${autoAdvanceMs}ms` }}
              onAnimationEnd={handleCountdownEnd}
            />
          )}
          <span className="relative">{t.newProblem}</span>
        </button>
      </div>
    </div>
  );
}
