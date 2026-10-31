import React from 'react';
import { AnswerButton, AnswerShape, AnswerState } from './AnswerButton';

interface ResultGridProps {
  answerOptions: number[];
  correctValue: number | null;
  wrongValues: number[];
  pendingValue: number | null;
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

export function answerState(
  option: number,
  correctValue: number | null,
  wrongValues: number[],
  pendingValue: number | null
): AnswerState {
  if (wrongValues.includes(option)) return 'wrong';
  if (correctValue !== null) return option === correctValue ? 'correct' : 'dimmed';
  if (pendingValue === option) return 'pending';
  return 'idle';
}

export const ResultGrid = ({
  answerOptions,
  correctValue,
  wrongValues,
  pendingValue,
  onOptionClick,
  formatLabel,
  shape = 'pill'
}: ResultGridProps) => {
  return (
    <div className="w-full max-w-xl">
      <div className={`grid ${getGridColsClass(answerOptions.length)} gap-3 sm:gap-4`}>
        {answerOptions.map((option) => (
          <AnswerButton
            key={option}
            value={option}
            label={formatLabel ? formatLabel(option) : undefined}
            shape={shape}
            state={answerState(option, correctValue, wrongValues, pendingValue)}
            onClick={onOptionClick}
          />
        ))}
      </div>
    </div>
  );
};
