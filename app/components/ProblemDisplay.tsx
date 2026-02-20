import React from 'react';
import { operationLookup, Operation } from '../TestParametersContext';
import { translations, Language } from '../translations';
import { motion } from 'framer-motion';

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
  // Use framer-motion for the animations.
  // We'll create a simple shake for error, and a bounce for success.

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
    <motion.div
      animate={getAnimationVariants()}
      className={`math-problem-container flex flex-col items-center justify-center p-8 rounded-2xl bg-white border-4 border-black box-shadow-hard mb-8 w-full max-w-md ${isAnimating && feedback === 'correct' ? 'animate-success' :
          isAnimating && feedback === 'incorrect' ? 'animate-error' : ''
        }`}
    >
      <div className="text-7xl font-black flex items-center justify-center gap-4 text-black">
        <span>{firstNumber}</span>
        <span>{operationLookup(operation)}</span>
        <span>{secondNumber}</span>
        <span>=</span>
        <span>?</span>
      </div>

      {feedback && (
        <div
          className={`mt-6 text-3xl font-bold text-center min-h-[3rem] ${feedback === 'correct' ? 'text-green-600' : 'text-red-500'
            }`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {feedback === 'correct' ? t.correct : t.tryAgain}
        </div>
      )}
      {!feedback && <div className="mt-6 min-h-[3rem]" />}
    </motion.div>
  );
};
