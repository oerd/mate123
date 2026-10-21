import React from 'react';

interface NumberLineProps {
  value: number;
  nearest: number;
}

const WIDTH = 480;
const PAD = 36;
const BASELINE = 40;

export const NumberLine: React.FC<NumberLineProps> = ({ value, nearest }) => {
  const lower = Math.floor(value / nearest) * nearest;
  const upper = lower + nearest;
  const x = (v: number) => PAD + ((v - lower) / nearest) * (WIDTH - 2 * PAD);
  const ticks = Array.from({ length: 11 }, (_, i) => {
    const tickValue = lower + (i * nearest) / 10;
    const major = i === 0 || i === 5 || i === 10;
    return { x: x(tickValue), half: major ? 14 : 8, key: i };
  });

  return (
    <svg
      viewBox={`0 0 ${WIDTH} 96`}
      className="w-full max-w-md h-auto overflow-visible text-neo-ink"
      role="img"
      aria-label={`${lower} – ${value} – ${upper}`}
      data-testid="number-line"
    >
      <line x1={PAD} y1={BASELINE} x2={WIDTH - PAD} y2={BASELINE} stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      {ticks.map((tick) => (
        <line
          key={tick.key}
          x1={tick.x}
          y1={BASELINE - tick.half}
          x2={tick.x}
          y2={BASELINE + tick.half}
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}
      <line
        x1={x(lower + nearest / 2)}
        y1={BASELINE - 26}
        x2={x(lower + nearest / 2)}
        y2={BASELINE + 20}
        className="stroke-neo-ink-muted"
        strokeWidth="3"
        strokeDasharray="6 6"
      />
      <circle cx={x(value)} cy={BASELINE} r="13" fill="#A855F7" stroke="currentColor" strokeWidth="4" />
      <text x={x(value)} y={BASELINE - 30} textAnchor="middle" fontWeight="700" fontSize="24" fill="#A855F7">
        {value}
      </text>
      <text x={PAD} y={BASELINE + 46} textAnchor="middle" fontWeight="700" fontSize="26" fill="currentColor">
        {lower}
      </text>
      <text x={WIDTH - PAD} y={BASELINE + 46} textAnchor="middle" fontWeight="700" fontSize="26" fill="currentColor">
        {upper}
      </text>
    </svg>
  );
};
