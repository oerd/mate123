'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';
import { useTestParameters, Operation } from './TestParametersContext';
import { translations } from './translations';
import { SettingsIcon } from './components/SettingsIcon';
import { OperationToggle } from './components/OperationToggle';
import { LanguageSelector } from './components/LanguageSelector';
import { generateProblem, generateAnswerOptions, isAnswerCorrect } from './utils/mathLogic';
import { ProblemDisplay } from './components/ProblemDisplay';
import { ResultGrid } from './components/ResultGrid';

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const { testParameters } = useTestParameters();
  const t = translations[language];
  const inputRef = useRef<HTMLInputElement>(null);
  const focusTimerRef = useRef<NodeJS.Timeout | null>(null);
  const feedbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [firstNumber, setFirstNumber] = useState<number>(0);
  const [secondNumber, setSecondNumber] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [operation, setOperation] = useState<Operation>(testParameters.operations[0] || 'addition');
  const [answerOptions, setAnswerOptions] = useState<number[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [showLanguageSelector, setShowLanguageSelector] = useState<boolean>(false);
  const [languageTooltip, setLanguageTooltip] = useState<string | null>(null);
  const [selectedOptionValue, setSelectedOptionValue] = useState<number | null>(null);

  const clearAllTimers = useCallback(() => {
    if (focusTimerRef.current) {
      clearTimeout(focusTimerRef.current);
      focusTimerRef.current = null;
    }
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
  }, []);

  const genOptions = useCallback((correct: number) => {
    return generateAnswerOptions(correct, {
      numberOfResults: testParameters.numberOfResults,
      sortResults: testParameters.sortResults,
    });
  }, [testParameters.numberOfResults, testParameters.sortResults]);

  const generateNewProblem = useCallback(() => {
    clearAllTimers();

    const problem = generateProblem(testParameters, operation);
    
    setFirstNumber(problem.num1);
    setSecondNumber(problem.num2);
    setCorrectAnswer(problem.answer);
    
    setUserAnswer('');
    setFeedback(null);
    setIsAnimating(false);
    setSelectedOptionValue(null);
    
    setAnswerOptions(genOptions(problem.answer));

    focusTimerRef.current = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [operation, testParameters, genOptions, clearAllTimers]);

  useEffect(() => {
    if (!testParameters.operations.includes(operation)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOperation(testParameters.operations[0] || 'addition');
    } else {
      generateNewProblem();
    }
  }, [operation, testParameters, generateNewProblem]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnswerOptions(genOptions(correctAnswer));
  }, [testParameters.numberOfResults, correctAnswer, genOptions]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnswerOptions(genOptions(correctAnswer));
  }, [testParameters.sortResults, correctAnswer, genOptions]);

  const checkAnswer = useCallback((answer: number) => {
    return isAnswerCorrect(answer, correctAnswer);
  }, [correctAnswer]);

  const commitAnswer = useCallback((answer: number) => {
    if (isAnimating) return;

    const ok = checkAnswer(answer);
    setFeedback(ok ? 'correct' : 'incorrect');
    setIsAnimating(true);

    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => {
      setIsAnimating(false);
      if (ok) {
        generateNewProblem();
      } else {
        setSelectedOptionValue(null);
        inputRef.current?.focus();
      }
    }, 800);
  }, [checkAnswer, isAnimating, generateNewProblem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userAnswer.trim() === '') return;
    commitAnswer(parseFloat(userAnswer));
  };

  const handleOptionClick = useCallback((option: number) => {
    if (isAnimating) return;
    setUserAnswer(option.toString());
    setSelectedOptionValue(option);
    commitAnswer(option);
  }, [commitAnswer, isAnimating]);

  const toggleLanguageSelector = () => {
    setShowLanguageSelector(!showLanguageSelector);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showLanguageSelector && !target.closest('.language-selector-container')) {
        setShowLanguageSelector(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (showLanguageSelector && event.key === 'Escape') {
        setShowLanguageSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showLanguageSelector]);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-ctp-base">
      <div className="absolute top-4 left-4">
        <div className="relative language-selector-container">
          <button
            onClick={toggleLanguageSelector}
            className="p-2 bg-ctp-surface0 text-ctp-text rounded-lg hover:bg-ctp-surface1 transition-colors flex items-center justify-center"
            aria-label={t.selectLanguage}
            aria-expanded={showLanguageSelector}
          >
            <span className="text-2xl leading-none">
              {language === 'en' ? '🇬🇧' : 
               language === 'de' ? '🇩🇪' : 
               language === 'it' ? '🇮🇹' : 
               language === 'fr' ? '🇫🇷' : 
               language === 'sq' ? '🇦🇱' : '🌐'}
            </span>
          </button>
          
          {showLanguageSelector && (
            <div className="absolute left-0 top-full mt-2 p-3 bg-ctp-surface0 rounded-lg shadow-lg z-10 language-selector-dropdown">
              <LanguageSelector 
                language={language}
                setLanguage={(lang) => {
                  setLanguage(lang);
                  setShowLanguageSelector(false);
                }}
                tooltip={languageTooltip}
                setTooltip={setLanguageTooltip}
              />
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-4 right-4">
        <div className="relative">
          <Link 
            href="/settings"
            className="p-2 bg-ctp-surface0 text-ctp-text rounded-lg hover:bg-ctp-surface1 transition-colors flex items-center justify-center"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            aria-label={t.settings}
          >
            <SettingsIcon />
          </Link>
          {showTooltip && (
            <div className="absolute right-0 top-full mt-2 bg-ctp-surface2 text-ctp-text px-3 py-1 rounded text-sm whitespace-nowrap">
              {t.settings}
            </div>
          )}
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-8 text-ctp-blue">
        {t.title}
      </h1>
      
      {testParameters.operations.length > 1 && (
        <OperationToggle 
          selected={operation} 
          onToggle={setOperation}
          options={testParameters.operations}
        />
      )}
      
      <ProblemDisplay
        firstNumber={firstNumber}
        secondNumber={secondNumber}
        operation={operation}
        userAnswer={userAnswer}
        setUserAnswer={setUserAnswer}
        onSubmit={handleSubmit}
        feedback={feedback}
        isAnimating={isAnimating}
        language={language}
        inputRef={inputRef}
        t={t}
      />
      
      <ResultGrid
        answerOptions={answerOptions}
        selectedOptionValue={selectedOptionValue}
        onOptionClick={handleOptionClick}
      />
      
      <button
        onClick={generateNewProblem}
        className="mt-8 px-4 py-2 bg-ctp-surface0 text-ctp-text font-medium rounded-lg hover:bg-ctp-surface1 transition-colors"
      >
        {t.newProblem}
      </button>
    </div>
  );
}
