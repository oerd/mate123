import React from 'react';
import { operationLookup, Operation } from '../TestParametersContext';
import { translations, Language } from '../translations';

interface ProblemDisplayProps {
  firstNumber: number;
  secondNumber: number;
  operation: Operation;
  userAnswer: string;
  setUserAnswer: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  feedback: 'correct' | 'incorrect' | null;
  isAnimating: boolean;
  language: Language;
  inputRef: React.RefObject<HTMLInputElement | null>;
  t: typeof translations['en'];
}

export const ProblemDisplay = ({
  firstNumber,
  secondNumber,
  operation,
  userAnswer,
  setUserAnswer,
  onSubmit,
  feedback,
  isAnimating,
  inputRef,
  t
}: ProblemDisplayProps) => {
  return (
    <div className={`math-problem-container p-8 rounded-xl shadow-lg bg-ctp-mantle border border-ctp-surface0 transition-all duration-300 ${
      isAnimating && feedback === 'correct' ? 'animate-success' : 
      isAnimating && feedback === 'incorrect' ? 'animate-error' : ''
    }`}>
      <div className="text-5xl font-bold flex items-center justify-center gap-4 mb-8 text-ctp-text">
        <span>{firstNumber}</span>
        <span>{operationLookup(operation)}</span>
        <span>{secondNumber}</span>
        <span>=</span>
        <span>?</span>
      </div>
      
      <form onSubmit={onSubmit} className="flex flex-col items-center">
        <input
          ref={inputRef}
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="text-4xl p-4 w-32 text-center border-2 border-ctp-surface2 rounded-lg bg-ctp-surface0 text-ctp-text focus:border-ctp-blue focus:outline-none"
          placeholder="?"
          aria-label={t.checkAnswer} // Improved A11y
          autoFocus
        />
        
        <button 
          type="submit"
          className="mt-6 px-6 py-3 bg-ctp-blue text-ctp-base font-bold rounded-lg hover:bg-ctp-lavender transition-colors"
        >
          {t.checkAnswer}
        </button>
      </form>
      
      <div 
        className={`mt-6 text-2xl font-bold text-center min-h-[2rem] transition-opacity duration-200 ${
          feedback ? 'opacity-100' : 'opacity-0'
        } ${
          feedback === 'correct' ? 'text-ctp-green' : 'text-ctp-red'
        }`} 
        role="alert"
      > 
        {feedback === 'correct' ? t.correct : (feedback === 'incorrect' ? t.tryAgain : t.correct)}
      </div>
    </div>
  );
};
