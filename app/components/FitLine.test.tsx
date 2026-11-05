import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FitLine } from './FitLine';

function mockLayout(lineWidth: number, boxWidth: number) {
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(lineWidth);
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(boxWidth);
  vi.spyOn(window, 'getComputedStyle').mockReturnValue({ fontSize: '72px' } as CSSStyleDeclaration);
}

const renderLine = () =>
  render(
    <div>
      <FitLine className="text-7xl">
        <span>99 + 99</span>
      </FitLine>
    </div>
  );

describe('FitLine', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps its content on a single line', () => {
    renderLine();
    expect(screen.getByTestId('fit-line').className).toContain('whitespace-nowrap');
  });

  it('shrinks the font when the line is wider than its box', () => {
    mockLayout(480, 360);
    renderLine();
    expect(screen.getByTestId('fit-line').style.fontSize).toBe('54px');
  });

  it('keeps the class font size when the line fits', () => {
    mockLayout(300, 360);
    renderLine();
    expect(screen.getByTestId('fit-line').style.fontSize).toBe('');
  });
});
