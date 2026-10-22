import React, { useLayoutEffect, useRef } from 'react';

interface FitTitleProps {
  children: string;
  className?: string;
  minSize?: number;
  maxSize?: number;
  maxViewportHeightRatio?: number;
}

export function fitFontSize(currentSize: number, textWidth: number, boxWidth: number, maxSize: number): number {
  if (textWidth <= 0 || boxWidth <= 0) return currentSize;
  return Math.min(maxSize, Math.floor((currentSize * boxWidth) / textWidth * 2) / 2);
}

export const FitTitle: React.FC<FitTitleProps> = ({
  children,
  className = '',
  minSize = 22,
  maxSize = 96,
  maxViewportHeightRatio = 1
}) => {
  const boxRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const text = textRef.current;
    if (!box || !text) return;

    const fit = () => {
      text.style.whiteSpace = 'nowrap';
      const style = getComputedStyle(box);
      const boxWidth = box.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const max = Math.min(maxSize, window.innerHeight * maxViewportHeightRatio);
      const size = fitFontSize(parseFloat(style.fontSize), text.getBoundingClientRect().width, boxWidth, max);
      box.style.fontSize = `${Math.max(size, minSize)}px`;
      if (size < minSize) text.style.whiteSpace = 'normal';
    };

    fit();
    let active = true;
    document.fonts?.ready.then(() => { if (active) fit(); });
    window.addEventListener('resize', fit);
    return () => {
      active = false;
      window.removeEventListener('resize', fit);
    };
  }, [children, minSize, maxSize, maxViewportHeightRatio]);

  return (
    <h1 ref={boxRef} className={className}>
      <span ref={textRef} className="inline-block text-balance">{children}</span>
    </h1>
  );
};
