import React from 'react';
import { AnswerButton } from './AnswerButton';

interface ResultGridProps {
  answerOptions: number[];
  selectedOptionValue: number | null;
  onOptionClick: (option: number) => void;
}

export const ResultGrid = ({
  answerOptions,
  selectedOptionValue,
  onOptionClick
}: ResultGridProps) => {
  return (
    <div className="mt-4 sm:mt-6 md:mt-8 w-full max-w-xl">
      <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
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
