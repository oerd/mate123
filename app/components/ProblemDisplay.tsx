import React from 'react';
import { operationLookup, Operation } from '../TestParametersContext';
import { translations } from '../translations';
import { motion } from 'framer-motion';
import { Mascot } from './Mascot';
import { NumberLine } from './NumberLine';
import { comparisonSymbol } from '../utils/mathLogic';

interface ProblemDisplayProps {
  firstNumber: number;
  secondNumber: number;
  operation: Operation;
  feedback: 'correct' | 'incorrect' | null;
  isAnimating: boolean;
  t: typeof translations['en'];
  answer?: number;
  addends?: [number, number];
  showNumberLine?: boolean;
}

const LONG_LINE_CHARS = 9;

function equationSizeClass(chars: number): string {
  return chars > LONG_LINE_CHARS
    ? 'text-4xl sm:text-6xl md:text-7xl'
    : 'text-5xl sm:text-7xl md:text-8xl';
}

export function decidingDigitIndex(value: number, nearest: number): number {
  const digits = String(value);
  const offset = Math.round(Math.log10(nearest));
  return digits.length - offset;
}

const RoundingNumber = ({ value, nearest }: { value: number; nearest: number }) => {
  const digits = String(value);
  const index = decidingDigitIndex(value, nearest);
  if (index < 0 || index >= digits.length) return <span>{digits}</span>;
  return (
    <span>
      {digits.slice(0, index)}
      <span className="text-purple-500">{digits.charAt(index)}</span>
      {digits.slice(index + 1)}
    </span>
  );
};

const TaskChip = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-neo-orange border-[3px] border-neo-ink rounded-full px-4 py-1 text-base sm:text-xl font-black text-black box-shadow-hard mb-3">
    {children}
  </div>
);

export const ProblemDisplay = ({
  firstNumber,
  secondNumber,
  operation,
  feedback,
  isAnimating,
  t,
  answer,
  addends,
  showNumberLine = false
}: ProblemDisplayProps) => {
  const getAnimationVariants = () => {
    if (!isAnimating) return { x: 0, y: 0 };
    if (feedback === 'incorrect') {
      return {
        x: [-10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
      };
    }
    if (feedback === 'correct') {
      return {
        y: [0, -20, 0, -10, 0],
        transition: { duration: 0.5 }
      };
    }
    return { x: 0, y: 0 };
  };

  const revealed = feedback === 'correct' && answer !== undefined;

  const renderEquation = () => {
    if (operation === 'rounding') {
      const answerText = revealed ? String(answer) : '?';
      const chars = String(firstNumber).length + answerText.length + 2;
      return (
        <>
          <TaskChip>{t.roundToNearestTask.replace('{n}', String(secondNumber))}</TaskChip>
          <div className={`${equationSizeClass(chars)} font-black flex items-center justify-center gap-2 sm:gap-4 text-neo-ink tabular-nums`}>
            <RoundingNumber value={firstNumber} nearest={secondNumber} />
            <span>≈</span>
            <span className={revealed ? 'text-green-600' : ''}>{answerText}</span>
          </div>
          {showNumberLine && <div className="mt-3 w-full flex justify-center"><NumberLine value={firstNumber} nearest={secondNumber} /></div>}
        </>
      );
    }

    if (operation === 'comparison') {
      const leftText = addends ? `${addends[0]} + ${addends[1]}` : String(firstNumber);
      const chars = leftText.length + String(secondNumber).length + 3;
      return (
        <>
          <TaskChip>{t.whichSignFits}</TaskChip>
          <div className={`${equationSizeClass(chars)} font-black flex items-center justify-center gap-2 sm:gap-4 text-neo-ink tabular-nums`}>
            <span>{leftText}</span>
            <span
              data-testid="comparison-box"
              className={`inline-flex items-center justify-center min-w-[1.4em] h-[1.4em] rounded-2xl border-4 ${revealed ? 'border-solid bg-neo-green text-black' : 'border-dashed bg-neo-surface-muted'} border-neo-ink text-[0.85em]`}
            >
              {revealed ? comparisonSymbol(answer) : '?'}
            </span>
            <span>{secondNumber}</span>
          </div>
        </>
      );
    }

    return (
      <div className="text-5xl sm:text-7xl md:text-8xl font-black flex items-center justify-center gap-2 sm:gap-4 text-neo-ink">
        <span>{firstNumber}</span>
        <span>{operationLookup(operation)}</span>
        <span>{secondNumber}</span>
        <span>=</span>
        <span>?</span>
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-xl flex justify-center">
      <div className="relative w-full max-w-md lg:max-w-xl transform -rotate-2">
        <motion.div
          animate={getAnimationVariants()}
          className={`math-problem-container flex flex-col lg:flex-row items-center justify-center p-6 sm:p-8 rounded-2xl bg-neo-surface border-4 border-neo-ink box-shadow-hard w-full ${isAnimating && feedback === 'correct' ? 'animate-success' :
            isAnimating && feedback === 'incorrect' ? 'animate-error' : ''
            }`}
        >
          <div className="flex flex-col items-center transform rotate-2 min-w-0 max-w-full">
            {renderEquation()}
          </div>

          {/* Mascot: below text on mobile, inline right on wide screens */}
          <Mascot
            className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 pointer-events-none drop-shadow-xl lg:ml-4 mt-2 lg:mt-0 flex-shrink-0"
            isAnimating={isAnimating}
            feedback={feedback}
          />
        </motion.div>
      </div>

      {feedback && (
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {feedback === 'correct' ? t.correct : t.tryAgain}
        </div>
      )}
    </div>
  );
};
