import React from 'react';

interface AnswerButtonProps {
  value: number;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: (value: number) => void;
}

function getSizeClasses(value: number): string {
  const digits = String(value).length;
  if (digits <= 2) return 'h-14 sm:h-16 md:h-20 w-full text-4xl sm:text-5xl md:text-6xl';
  if (digits === 3) return 'h-14 sm:h-16 md:h-20 w-full text-3xl sm:text-4xl md:text-5xl';
  return 'h-14 sm:h-16 md:h-20 w-full text-2xl sm:text-3xl md:text-4xl';
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
        bg-neo-blue
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
