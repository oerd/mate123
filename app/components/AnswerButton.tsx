import React from 'react';

interface AnswerButtonProps {
  value: number;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: (value: number) => void;
}

function getSizeClasses(value: number): string {
  const digits = String(value).length;
  if (digits <= 2) return 'h-16 w-20 min-w-20 text-5xl';
  if (digits === 3) return 'h-16 w-24 min-w-24 text-4xl';
  return 'h-16 w-28 min-w-28 text-3xl';
}

export const AnswerButton = React.memo(({
  value,
  isSelected,
  isDisabled,
  onClick
}: AnswerButtonProps) => {
  return (
    <button
      onClick={() => onClick(value)}
      disabled={isDisabled}
      className={`${getSizeClasses(value)} font-bold bg-ctp-surface0 text-ctp-text rounded-lg 
        hover:bg-ctp-surface1 hover:scale-105 
        active:scale-95 
        transition-all duration-150 shadow-md 
        flex items-center justify-center
        ${isSelected ? 'ring-2 ring-ctp-blue bg-ctp-surface1' : ''}
        ${isDisabled && !isSelected ? 'opacity-60' : ''}
      `}
    >
      {value}
    </button>
  );
});

AnswerButton.displayName = 'AnswerButton';
