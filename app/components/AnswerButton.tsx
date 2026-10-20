import React from 'react';

export type AnswerShape = 'pill' | 'square';

interface AnswerButtonProps {
  value: number;
  label?: string;
  shape?: AnswerShape;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: (value: number) => void;
}

function getSizeClasses(label: string): string {
  const digits = label.length;
  if (digits <= 2) return 'h-14 sm:h-16 md:h-20 w-full text-4xl sm:text-5xl md:text-6xl';
  if (digits === 3) return 'h-14 sm:h-16 md:h-20 w-full text-3xl sm:text-4xl md:text-5xl';
  return 'h-14 sm:h-16 md:h-20 w-full text-2xl sm:text-3xl md:text-4xl';
}

const shapeClasses: Record<AnswerShape, string> = {
  pill: 'rounded-full',
  square: 'rounded-2xl h-20 sm:h-24 md:h-28 max-w-[9rem] mx-auto',
};

export const AnswerButton = React.memo(({
  value,
  label,
  shape = 'pill',
  isSelected,
  isDisabled,
  onClick
}: AnswerButtonProps) => {
  const text = label ?? String(value);
  return (
    <button
      onClick={() => onClick(value)}
      disabled={isDisabled}
      aria-pressed={isSelected}
      className={`
        ${getSizeClasses(text)}
        ${shapeClasses[shape]}
        bg-neo-blue
        font-black text-black
        border-4 border-black box-shadow-hard
        flex items-center justify-center
        transition-all duration-150
        ${isSelected ? 'ring-4 ring-black ring-offset-2' : ''}
        ${isDisabled && !isSelected ? 'opacity-50 grayscale' : ''}
      `}
    >
      {text}
    </button>
  );
});

AnswerButton.displayName = 'AnswerButton';
