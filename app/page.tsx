'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';
import { useTestParameters, operationLookup, Operation } from './TestParametersContext';
import { translations } from './translations';
import { SettingsIcon } from './components/SettingsIcon';
import { OperationToggle } from './components/OperationToggle';
import { LanguageSelector } from './components/LanguageSelector';

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const { testParameters } = useTestParameters();
  const t = translations[language];

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
    let num1, num2;
    
    switch (operation) {
      case 'addition':
      case 'multiplication':
        num1 = Math.floor(Math.random() * (testParameters.firstOperandMax - testParameters.firstOperandMin + 1)) + testParameters.firstOperandMin;
        num2 = Math.floor(Math.random() * (testParameters.secondOperandMax - testParameters.secondOperandMin + 1)) + testParameters.secondOperandMin;
        break;
        
      case 'subtraction':
        num1 = Math.floor(Math.random() * (testParameters.firstOperandMax - testParameters.firstOperandMin + 1)) + testParameters.firstOperandMin;
        num2 = Math.floor(Math.random() * (Math.min(num1, testParameters.secondOperandMax) - testParameters.secondOperandMin + 1)) + testParameters.secondOperandMin;
        break;
        
      case 'division': {
        const secondMin = Math.max(1, testParameters.secondOperandMin);
        const secondMax = testParameters.secondOperandMax;
        
        if (secondMin <= secondMax) {
          num2 = Math.floor(Math.random() * (secondMax - secondMin + 1)) + secondMin;
        } else {
          num2 = secondMin;
        }
        
        if (num2 === 0) num2 = 1;
        
        const maxQuotient = Math.floor(testParameters.firstOperandMax / num2);
        const minQuotient = Math.max(1, Math.ceil(testParameters.firstOperandMin / num2));
        
        let quotient;
        if (maxQuotient >= minQuotient) {
          quotient = Math.floor(Math.random() * (maxQuotient - minQuotient + 1)) + minQuotient;
        } else {
          quotient = Math.floor(Math.random() * 10) + 1;
        }
        
        num1 = quotient * num2;
        
        if (num1 < testParameters.firstOperandMin || num1 > testParameters.firstOperandMax) {
          if (num1 < testParameters.firstOperandMin) {
            num1 = Math.floor(testParameters.firstOperandMin / num2) * num2;
            if (num1 < testParameters.firstOperandMin) {
              num1 += num2;
            }
          } else if (num1 > testParameters.firstOperandMax) {
            num1 = Math.floor(testParameters.firstOperandMax / num2) * num2;
          }
        }
        
        if (Math.random() < 0.2) {
          num2 = Math.floor(Math.random() * (secondMax - secondMin + 1)) + secondMin;
          if (num2 === 0) num2 = 1;
          
          const possibleMultiples = [];
          for (let i = testParameters.firstOperandMin; i <= testParameters.firstOperandMax; i++) {
            if (i % num2 === 0) {
              possibleMultiples.push(i);
            }
          }
          
          if (possibleMultiples.length > 0) {
            num1 = possibleMultiples[Math.floor(Math.random() * possibleMultiples.length)];
          } else {
            num1 = Math.floor((testParameters.firstOperandMin + testParameters.firstOperandMax) / 2 / num2) * num2;
            if (num1 < testParameters.firstOperandMin) num1 += num2;
            if (num1 > testParameters.firstOperandMax) num1 -= num2;
          }
        }
        break;
      }
        
      default:
        num1 = 0;
        num2 = 0;
    }
    
    setFirstNumber(num1);
    setSecondNumber(num2);
    setUserAnswer('');
    setFeedback(null);
    setSelectedOptionIndex(null);
    
    const newCorrectAnswer = operation === 'division' ? num1 / num2 : 
                          operation === 'multiplication' ? num1 * num2 : 
                          operation === 'subtraction' ? num1 - num2 : 
                          num1 + num2;
                          
    setCorrectAnswer(newCorrectAnswer);
    setAnswerOptions(generateAnswerOptions(newCorrectAnswer));
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
    
    setTimeout(() => {
      setIsAnimating(false);
      if (isCorrect) {
        generateNewProblem();
      }
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkAnswer();
  };

  const handleOptionClick = (option: number, index: number) => {
    setUserAnswer(option.toString());
    setSelectedOptionIndex(index);
    
    setTimeout(() => {
      const isCorrect = option === Math.round(correctAnswer * 100) / 100;
      
      setFeedback(isCorrect ? 'correct' : 'incorrect');
      setIsAnimating(true);
      
      setTimeout(() => {
        setIsAnimating(false);
        if (isCorrect) {
          generateNewProblem();
        } else {
          setSelectedOptionIndex(null);
        }
      }, 1500);
    }, 300);
  };

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
          operation={operation} 
          setOperation={setOperation}
          availableOperations={testParameters.operations}
        />
      )}
      
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
        
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="text-4xl p-4 w-32 text-center border-2 border-ctp-surface2 rounded-lg bg-ctp-surface0 text-ctp-text focus:border-ctp-blue focus:outline-none"
            placeholder="?"
            autoFocus
          />
          
          <button 
            type="submit"
            className="mt-6 px-6 py-3 bg-ctp-blue text-ctp-base font-bold rounded-lg hover:bg-ctp-lavender transition-colors"
          >
            {t.checkAnswer}
          </button>
        </form>
        
        {feedback && (
          <div className={`mt-6 text-2xl font-bold text-center ${
            feedback === 'correct' ? 'text-ctp-green' : 'text-ctp-red'
          }`}>
            {feedback === 'correct' ? t.correct : t.tryAgain}
          </div>
        )}
      </div>
      
      <div className="mt-8 w-full max-w-xl">
        <div className="flex flex-wrap justify-center gap-3">
          {answerOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option, index)}
              aria-label={`Choose answer ${option}`}
              disabled={selectedOptionIndex !== null && selectedOptionIndex !== index}
              className={`h-16 w-20 min-w-20 text-5xl font-bold bg-ctp-surface0 text-ctp-text rounded-lg 
                hover:bg-ctp-surface1 hover:scale-105 
                active:scale-95 
                transition-all duration-150 shadow-md 
                flex items-center justify-center
                ${selectedOptionIndex === index ? 'ring-2 ring-ctp-blue bg-ctp-surface1' : ''}
                ${selectedOptionIndex !== null && selectedOptionIndex !== index ? 'opacity-60' : ''}
              `}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      
      <button
        onClick={generateNewProblem}
        className="mt-8 px-4 py-2 bg-ctp-surface0 text-ctp-text font-medium rounded-lg hover:bg-ctp-surface1 transition-colors"
      >
        {t.newProblem}
      </button>
    </div>
  );
}
