import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { fitFontSize } from './FitTitle';

interface FitLineProps {
  children: React.ReactNode;
  className?: string;
}

export const FitLine: React.FC<FitLineProps> = ({ children, className = '' }) => {
  const lineRef = useRef<HTMLDivElement>(null);

  const fit = useCallback(() => {
    const line = lineRef.current;
    const box = line?.parentElement;
    if (!line || !box) return;
    line.style.fontSize = '';
    const naturalWidth = line.offsetWidth;
    const boxWidth = box.clientWidth;
    if (naturalWidth <= boxWidth) return;
    const cssSize = parseFloat(getComputedStyle(line).fontSize);
    line.style.fontSize = `${fitFontSize(cssSize, naturalWidth, boxWidth, cssSize)}px`;
  }, []);

  useLayoutEffect(fit);

  useEffect(() => {
    const box = lineRef.current?.parentElement;
    let active = true;
    document.fonts?.ready.then(() => { if (active) fit(); });
    window.addEventListener('resize', fit);
    const observer = typeof ResizeObserver === 'undefined' || !box ? null : new ResizeObserver(fit);
    if (box) observer?.observe(box);
    return () => {
      active = false;
      window.removeEventListener('resize', fit);
      observer?.disconnect();
    };
  }, [fit]);

  return (
    <div ref={lineRef} data-testid="fit-line" className={`w-max max-w-none whitespace-nowrap ${className}`}>
      {children}
    </div>
  );
};
