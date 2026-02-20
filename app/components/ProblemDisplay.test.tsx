import { render, screen } from '@testing-library/react';
import { ProblemDisplay } from './ProblemDisplay';
import { describe, it, expect } from 'vitest';
import { translations } from '../translations';
import React from 'react';

describe('ProblemDisplay', () => {
  const t = translations['en'];

  it('renders the math problem correctly', () => {
    render(
      <ProblemDisplay
        firstNumber={5}
        secondNumber={3}
        operation="addition"
        feedback={null}
        isAnimating={false}
        t={t}
      />
    );

    expect(screen.getByText('5')).toBeDefined();
    expect(screen.getByText('+')).toBeDefined();
    expect(screen.getByText('3')).toBeDefined();
    expect(screen.getByText('=')).toBeDefined();
    expect(screen.getByText('?')).toBeDefined();
  });

  it('displays correct feedback', () => {
    render(
      <ProblemDisplay
        firstNumber={1}
        secondNumber={1}
        operation="addition"
        feedback="correct"
        isAnimating={false}
        t={t}
      />
    );

    expect(screen.getByText(t.correct)).toBeDefined();
  });

  it('does not render feedback text in DOM when feedback is null', () => {
    render(
      <ProblemDisplay
        firstNumber={1}
        secondNumber={1}
        operation="addition"
        feedback={null}
        isAnimating={false}
        t={t}
      />
    );

    expect(screen.queryByText(t.correct)).toBeNull();
    expect(screen.queryByText(t.tryAgain)).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('renders feedback with aria-live for screen readers when feedback is present', () => {
    render(
      <ProblemDisplay
        firstNumber={1}
        secondNumber={1}
        operation="addition"
        feedback="correct"
        isAnimating={false}
        t={t}
      />
    );

    const status = screen.getByRole('status');
    expect(status).toBeDefined();
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.textContent).toContain(t.correct);
  });

  it('renders try-again feedback for incorrect answers', () => {
    render(
      <ProblemDisplay
        firstNumber={1}
        secondNumber={1}
        operation="addition"
        feedback="incorrect"
        isAnimating={false}
        t={t}
      />
    );

    const status = screen.getByRole('status');
    expect(status.textContent).toContain(t.tryAgain);
  });

  it('applies animation classes when animating', () => {
    const { container } = render(
      <ProblemDisplay
        firstNumber={1}
        secondNumber={1}
        operation="addition"
        feedback="incorrect"
        isAnimating={true}
        t={t}
      />
    );

    const problemContainer = container.querySelector('.animate-error');
    expect(problemContainer).toBeDefined();
  });
});
