import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FitTitle, fitFontSize } from './FitTitle';

describe('fitFontSize', () => {
  it('scales the font so the text fills the box', () => {
    expect(fitFontSize(60, 381, 576, 200)).toBe(90.5);
  });

  it('shrinks text that is wider than the box', () => {
    expect(fitFontSize(36, 463, 343, 200)).toBe(26.5);
  });

  it('never exceeds the maximum size', () => {
    expect(fitFontSize(60, 100, 576, 96)).toBe(96);
  });

  it('keeps the current size when nothing has been laid out', () => {
    expect(fitFontSize(36, 0, 343, 96)).toBe(36);
    expect(fitFontSize(36, 229, 0, 96)).toBe(36);
  });
});

describe('FitTitle', () => {
  it('renders the text as a heading', () => {
    render(<FitTitle>Math Practice</FitTitle>);
    expect(screen.getByRole('heading', { name: 'Math Practice' })).toBeDefined();
  });
});
