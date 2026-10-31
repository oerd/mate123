import React from 'react';

export type AnswerShape = 'pill' | 'square';
export type AnswerState = 'idle' | 'pending' | 'correct' | 'wrong' | 'dimmed';

interface AnswerButtonProps {
  value: number;
  label?: string;
  shape?: AnswerShape;
  state: AnswerState;
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

const stateClasses: Record<AnswerState, string> = {
  idle: 'bg-neo-pill text-black border-neo-ink box-shadow-hard',
  pending: 'bg-neo-pill text-black border-neo-ink box-shadow-hard ring-4 ring-neo-ink ring-offset-2 ring-offset-neo-ground',
  correct: 'bg-neo-green text-black border-neo-ink box-shadow-hard ring-4 ring-neo-ink ring-offset-2 ring-offset-neo-ground scale-105',
  wrong: 'bg-neo-red text-black border-neo-ink translate-x-1 translate-y-1 shadow-none',
  dimmed: 'bg-neo-surface text-neo-ink-muted border-neo-ink-muted shadow-none scale-95',
};

const badgeBase = 'absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-neo-ink text-base font-black text-black';

export const AnswerButton = React.memo(({
  value,
  label,
  shape = 'pill',
  state,
  onClick
}: AnswerButtonProps) => {
  const text = label ?? String(value);
  const settled = state === 'correct' || state === 'wrong';
  return (
    <button
      onClick={() => onClick(value)}
      disabled={state !== 'idle'}
      aria-pressed={state === 'pending' || settled}
      data-state={state}
      className={`
        relative
        ${getSizeClasses(text)}
        ${shapeClasses[shape]}
        ${stateClasses[state]}
        font-black
        border-4
        flex items-center justify-center
        transition-all duration-150
      `}
    >
      {text}
      {state === 'correct' && <span aria-hidden="true" className={`${badgeBase} bg-neo-green`}>✓</span>}
      {state === 'wrong' && <span aria-hidden="true" className={`${badgeBase} bg-neo-surface`}>✕</span>}
    </button>
  );
});

AnswerButton.displayName = 'AnswerButton';
