'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';
import { useTestParameters, Operation } from './TestParametersContext';
import { translations } from './translations';
import { SettingsIcon } from './components/SettingsIcon';
import { OperationToggle } from './components/OperationToggle';
import { generateProblem, generateOptionsForProblem, isAnswerCorrect, comparisonSymbol } from './utils/mathLogic';
import { ProblemDisplay } from './components/ProblemDisplay';
import { ResultGrid } from './components/ResultGrid';
import confetti from 'canvas-confetti';

export default function Home() {
  const { language } = useLanguage();
  const { testParameters } = useTestParameters();
  const t = translations[language];
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [operation, setOperation] = useState<Operation>(testParameters.operations[0] || 'addition');
  const [problemSeed, setProblemSeed] = useState<number>(0);

  const [selectedOptionValue, setSelectedOptionValue] = useState<number | null>(null);
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
    setProblemSeed(s => s + 1);
    setFeedback(null);
    setIsAnimating(false);
    setSelectedOptionValue(null);
  }, [clearAllTimers]);

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
    }

    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => {
      setIsAnimating(false);
      if (ok) {
        // We do not auto-advance immediately anymore, let them enjoy the confetti and click "Next"
        // Or we can auto-advance after 2 seconds. Let's let them click next to control pacing.
      } else {
        setSelectedOptionValue(null);
      }
    }, ok ? 2000 : 800); // Wait longer on success for confetti
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
    return <div className="flex h-dvh flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-neo-yellow" />;
  }

  // Dim secondary controls when answering
  const peripheralOpacity = (isAnimating || feedback === 'correct') ? 'opacity-30 pointer-events-none' : 'opacity-100';

  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-2 sm:gap-4 p-4 sm:p-6 md:p-8 overflow-hidden bg-neo-yellow transition-colors duration-500">

      <div className={`absolute top-4 right-4 transition-opacity duration-300 ${peripheralOpacity}`}>
        <div className="relative">
          <Link
            href="/settings"
            className="p-3 bg-white text-black border-4 border-black box-shadow-hard rounded-2xl hover:bg-gray-100 flex items-center justify-center"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            aria-label={t.settings}
          >
            <SettingsIcon />
          </Link>
          {showTooltip && (
            <div className="absolute right-0 top-full mt-2 bg-black text-white px-4 py-2 rounded-xl text-lg font-bold whitespace-nowrap z-20">
              {t.settings}
            </div>
          )}
        </div>
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-black tracking-tight text-center drop-shadow-md">
        {t.title}
      </h1>

      <div className={`transition-opacity duration-300 ${peripheralOpacity}`}>
        {testParameters.operations.length > 1 && (
          <OperationToggle
            selected={activeOperation}
            onToggle={setOperation}
            options={testParameters.operations}
          />
        )}
      </div>

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
        selectedOptionValue={selectedOptionValue}
        onOptionClick={handleOptionClick}
        formatLabel={activeOperation === 'comparison' ? comparisonSymbol : undefined}
        shape={activeOperation === 'comparison' ? 'square' : 'pill'}
      />

      {/* Only show "New Problem" button explicitly when they get it right, or let them click anywhere? */}
      <div className={`transition-all duration-300 ${feedback === 'correct' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <button
          onClick={generateNewProblem}
          className="px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 bg-neo-green font-black text-xl sm:text-2xl md:text-3xl text-black border-4 border-black box-shadow-hard rounded-full hover:bg-green-400 active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
        >
          {t.newProblem}
        </button>
      </div>
    </div>
  );
}
