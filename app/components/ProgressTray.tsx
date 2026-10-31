import React from 'react';

interface ProgressTrayProps {
  solved: number;
  total: number;
  streak: number;
  progressLabel: string;
  streakLabel: string;
}

export const ProgressTray: React.FC<ProgressTrayProps> = ({ solved, total, streak, progressLabel, streakLabel }) => (
  <div className="flex items-center gap-2" data-testid="progress-tray">
    <div
      role="img"
      aria-label={progressLabel}
      className="flex h-12 max-sm:h-10 items-center gap-1.5 max-sm:gap-1 rounded-full border-4 border-neo-ink bg-neo-surface px-3 max-sm:px-2 box-shadow-hard"
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          data-filled={i < solved}
          className={`h-3 w-3 max-sm:h-2.5 max-sm:w-2.5 rounded-full border-2 border-neo-ink transition-colors duration-300 ${i < solved ? 'bg-neo-green' : 'bg-neo-surface-muted'}`}
        />
      ))}
    </div>
    {streak >= 2 && (
      <div
        role="img"
        aria-label={streakLabel}
        data-testid="streak-badge"
        className="flex h-12 max-sm:h-10 items-center gap-1 rounded-full border-4 border-neo-ink bg-neo-orange px-3 max-sm:px-2 text-xl max-sm:text-lg font-black text-black box-shadow-hard"
      >
        <span aria-hidden="true">🔥</span>
        <span className="tabular-nums">{streak}</span>
      </div>
    )}
  </div>
);
