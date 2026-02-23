import React from 'react';
import { AnswerButton } from './AnswerButton';

interface ResultGridProps {
  answerOptions: number[];
  selectedOptionValue: number | null;
  onOptionClick: (option: number) => void;
}

// Tailwind classes must be literal strings for purge to work
const gridColsClasses: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

function getGridColsClass(count: number): string {
  const cols = count <= 3 ? count : Math.ceil(count / 2);
  return gridColsClasses[cols] || 'grid-cols-3';
}

export const ResultGrid = ({
  answerOptions,
  selectedOptionValue,
  onOptionClick
}: ResultGridProps) => {
  return (
    <div className="mt-4 sm:mt-6 md:mt-8 w-full max-w-xl">
      <div className={`grid ${getGridColsClass(answerOptions.length)} gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-3`}>
        {answerOptions.map((option) => (
          <AnswerButton
            key={option}
            value={option}
            isSelected={selectedOptionValue === option}
            isDisabled={selectedOptionValue !== null && selectedOptionValue !== option}
            onClick={onOptionClick}
          />
        ))}
      </div>
    </div>
  );
};
