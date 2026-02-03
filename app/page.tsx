'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';
import { useTestParameters, Operation } from './TestParametersContext';
import { translations } from './translations';
import { SettingsIcon } from './components/SettingsIcon';
import { OperationToggle } from './components/OperationToggle';
import { LanguageSelector } from './components/LanguageSelector';
import { generateProblem } from './utils/mathLogic';
import { ProblemDisplay } from './components/ProblemDisplay';
import { ResultGrid } from './components/ResultGrid';

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const { testParameters } = useTestParameters();
  const t = translations[language];
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);

  const generateAnswerOptions = useCallback((correctAnswer: number) => {
    const displayCorrectAnswer = Math.round(correctAnswer * 100) / 100;
    
    const options = [displayCorrectAnswer];
    
    while (options.length < testParameters.numberOfResults) {
      const range = Math.max(5, Math.abs(displayCorrectAnswer) / 2);
      const randomOption = Math.max(0, Math.floor(displayCorrectAnswer + Math.floor(Math.random() * range * 2) - range));
      if (!options.includes(randomOption) && randomOption !== displayCorrectAnswer) {
        options.push(randomOption);
      }
    }
    
    if (testParameters.sortResults) {
      return options.sort((a, b) => a - b);
    } else {
      return options.sort(() => Math.random() - 0.5);
    }
  }, [testParameters.numberOfResults, testParameters.sortResults]);

  const generateNewProblem = useCallback(() => {
    const problem = generateProblem(testParameters, operation);
    
    setFirstNumber(problem.num1);
    setSecondNumber(problem.num2);
    setCorrectAnswer(problem.answer);
    
    setUserAnswer('');
    setFeedback(null);
    setSelectedOptionIndex(null);
    
    setAnswerOptions(generateAnswerOptions(problem.answer));

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [operation, testParameters, generateAnswerOptions]);

  useEffect(() => {
    if (!testParameters.operations.includes(operation)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOperation(testParameters.operations[0] || 'addition');
    } else {
      generateNewProblem();
    }
  }, [operation, testParameters, generateNewProblem]);

  useEffect(() => {
    if (correctAnswer !== 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnswerOptions(generateAnswerOptions(correctAnswer));
    }
  }, [testParameters.numberOfResults, correctAnswer, generateAnswerOptions]);

  useEffect(() => {
    if (firstNumber !== 0 || secondNumber !== 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnswerOptions(generateAnswerOptions(correctAnswer));
    }
  }, [testParameters.sortResults, firstNumber, secondNumber, correctAnswer, generateAnswerOptions]);

  const checkAnswer = () => {
    const isCorrect = parseFloat(userAnswer) === correctAnswer || 
                     Math.round(parseFloat(userAnswer) * 100) / 100 === Math.round(correctAnswer * 100) / 100;
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setIsAnimating(true);
    
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsAnimating(false);
      if (isCorrect) {
        generateNewProblem();
      } else {
        inputRef.current?.focus();
      }
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkAnswer();
  };

  const handleOptionClick = useCallback((option: number, index: number) => {
    setUserAnswer(option.toString());
    setSelectedOptionIndex(index);
    
    setTimeout(() => {
      const isCorrect = option === Math.round(correctAnswer * 100) / 100;
      
      setFeedback(isCorrect ? 'correct' : 'incorrect');
      setIsAnimating(true);
      
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsAnimating(false);
        if (isCorrect) {
          generateNewProblem();
        } else {
          setSelectedOptionIndex(null);
          inputRef.current?.focus();
        }
      }, 1500);
    }, 300);
  }, [correctAnswer, generateNewProblem]);

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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLanguageSelector]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-ctp-base">
      <div className="absolute top-4 left-4">
        <div className="relative language-selector-container">
          <button
            onClick={toggleLanguageSelector}
            className="p-2 bg-ctp-surface0 text-ctp-text rounded-lg hover:bg-ctp-surface1 transition-colors flex items-center justify-center"
            aria-label={t.selectLanguage}
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
        selectedOptionIndex={selectedOptionIndex}
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
