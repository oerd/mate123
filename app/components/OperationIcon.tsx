import React from 'react';
import { Operation } from '../TestParametersContext';

interface OperationIconProps {
  operation: Operation;
  className?: string;
}

const strokes: Record<Operation, React.ReactNode> = {
  addition: (
    <>
      <path d="M12 4v16" />
      <path d="M4 12h16" />
    </>
  ),
  subtraction: <path d="M4 12h16" />,
  multiplication: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </>
  ),
  division: (
    <>
      <path d="M4 12h16" />
      <circle cx="12" cy="5.5" r="1.5" fill="currentColor" />
      <circle cx="12" cy="18.5" r="1.5" fill="currentColor" />
    </>
  ),
  rounding: (
    <>
      <path d="M4 9c2.5-2.5 5.5-2.5 8 0s5.5 2.5 8 0" />
      <path d="M4 15c2.5-2.5 5.5-2.5 8 0s5.5 2.5 8 0" />
    </>
  ),
  comparison: (
    <>
      <path d="M7 6l-4 6 4 6" />
      <path d="M17 6l4 6-4 6" />
      <path d="M9.5 9.5h5" />
      <path d="M9.5 14.5h5" />
    </>
  ),
};

export const OperationIcon: React.FC<OperationIconProps> = ({ operation, className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    focusable="false"
    data-operation={operation}
  >
    {strokes[operation]}
  </svg>
);
