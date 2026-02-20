import React from 'react';

interface AnswerButtonProps {
  value: number;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: (value: number) => void;
}

function getSizeClasses(value: number): string {
  const digits = String(value).length;
  if (digits <= 2) return 'h-20 w-24 min-w-24 text-6xl';
  if (digits === 3) return 'h-20 w-28 min-w-28 text-5xl';
  return 'h-20 w-32 min-w-32 text-4xl';
}

function getColorClass(value: number): string {
  const colors = ['bg-neo-pink', 'bg-neo-blue', 'bg-neo-green', 'bg-neo-white', 'bg-neo-orange'];
  // Deterministic but "random" looking color based on value
  return colors[value % colors.length];
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
      aria-pressed={isSelected}
      className={`
        ${getSizeClasses(value)} 
        ${getColorClass(value)}
        font-black text-black rounded-full 
        border-4 border-black box-shadow-hard
        flex items-center justify-center
        transition-all duration-150
        ${isSelected ? 'ring-4 ring-black ring-offset-2' : ''}
        ${isDisabled && !isSelected ? 'opacity-50 grayscale' : ''}
      `}
    >
      {value}
    </button>
  );
});

AnswerButton.displayName = 'AnswerButton';
