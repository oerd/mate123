import React from 'react';

interface AnswerButtonProps {
  value: number;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: (value: number) => void;
}

function getSizeClasses(value: number): string {
  const digits = String(value).length;
  if (digits <= 2) return 'h-14 w-16 min-w-16 text-4xl sm:h-16 sm:w-20 sm:min-w-20 sm:text-5xl md:h-20 md:w-24 md:min-w-24 md:text-6xl';
  if (digits === 3) return 'h-14 w-20 min-w-20 text-3xl sm:h-16 sm:w-24 sm:min-w-24 sm:text-4xl md:h-20 md:w-28 md:min-w-28 md:text-5xl';
  return 'h-14 w-24 min-w-24 text-2xl sm:h-16 sm:w-28 sm:min-w-28 sm:text-3xl md:h-20 md:w-32 md:min-w-32 md:text-4xl';
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
