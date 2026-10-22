import React from 'react';
import { AnswerButton, AnswerShape } from './AnswerButton';

interface ResultGridProps {
  answerOptions: number[];
  selectedOptionValue: number | null;
  onOptionClick: (option: number) => void;
  formatLabel?: (option: number) => string;
  shape?: AnswerShape;
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
  onOptionClick,
  formatLabel,
  shape = 'pill'
}: ResultGridProps) => {
  return (
    <div className="mt-3 w-full max-w-xl">
      <div className={`grid ${getGridColsClass(answerOptions.length)} gap-3 sm:gap-4`}>
        {answerOptions.map((option) => (
          <AnswerButton
            key={option}
            value={option}
            label={formatLabel ? formatLabel(option) : undefined}
            shape={shape}
            isSelected={selectedOptionValue === option}
            isDisabled={selectedOptionValue !== null && selectedOptionValue !== option}
            onClick={onOptionClick}
          />
        ))}
      </div>
    </div>
  );
};
