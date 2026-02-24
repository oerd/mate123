import React from 'react';
import { operationLookup, Operation } from '../TestParametersContext';
import { translations } from '../translations';
import { motion } from 'framer-motion';
import { Mascot } from './Mascot';

interface ProblemDisplayProps {
  firstNumber: number;
  secondNumber: number;
  operation: Operation;
  feedback: 'correct' | 'incorrect' | null;
  isAnimating: boolean;
  t: typeof translations['en'];
}

export const ProblemDisplay = ({
  firstNumber,
  secondNumber,
  operation,
  feedback,
  isAnimating,
  t
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

  return (
    <div className="relative w-full max-w-xl flex justify-center">
      <div className="relative w-full max-w-md lg:max-w-xl transform -rotate-2">
        <motion.div
          animate={getAnimationVariants()}
          className={`math-problem-container flex flex-col lg:flex-row items-center justify-center p-6 sm:p-8 rounded-2xl bg-white border-4 border-black box-shadow-hard w-full ${isAnimating && feedback === 'correct' ? 'animate-success' :
            isAnimating && feedback === 'incorrect' ? 'animate-error' : ''
            }`}
        >
          <div className="text-5xl sm:text-7xl md:text-8xl font-black flex items-center justify-center gap-2 sm:gap-4 text-black transform rotate-2">
            <span>{firstNumber}</span>
            <span>{operationLookup(operation)}</span>
            <span>{secondNumber}</span>
            <span>=</span>
            <span>?</span>
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
