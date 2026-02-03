import React from 'react';
import { AnswerButton } from './AnswerButton';

interface ResultGridProps {
  answerOptions: number[];
  selectedOptionIndex: number | null;
  onOptionClick: (option: number, index: number) => void;
}

export const ResultGrid = ({
  answerOptions,
  selectedOptionIndex,
  onOptionClick
}: ResultGridProps) => {
  return (
    <div className="mt-8 w-full max-w-xl">
      <div className="flex flex-wrap justify-center gap-3">
        {answerOptions.map((option, index) => (
          <AnswerButton
            key={index}
            value={option}
            index={index}
            isSelected={selectedOptionIndex === index}
            isDisabled={selectedOptionIndex !== null && selectedOptionIndex !== index}
            onClick={onOptionClick}
          />
        ))}
      </div>
    </div>
  );
};
