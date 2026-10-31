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

  it('reveals the answer in green once correct', () => {
    render(
      <ProblemDisplay
        firstNumber={5}
        secondNumber={3}
        operation="addition"
        feedback="correct"
        isAnimating={false}
        t={t}
        answer={8}
      />
    );
    const answer = screen.getByTestId('equation-answer');
    expect(answer.textContent).toBe('8');
    expect(answer.className).toContain('text-neo-correct');
    expect(screen.queryByText('?')).toBeNull();
  });

  it('switches the mascot mood with the feedback', () => {
    const { container, rerender } = render(
      <ProblemDisplay firstNumber={1} secondNumber={1} operation="addition" feedback={null} isAnimating={false} t={t} />
    );
    const mood = () => container.querySelector('[data-mood]')?.getAttribute('data-mood');
    expect(mood()).toBe('neutral');
    rerender(<ProblemDisplay firstNumber={1} secondNumber={1} operation="addition" feedback="correct" isAnimating t={t} answer={2} />);
    expect(mood()).toBe('happy');
    rerender(<ProblemDisplay firstNumber={1} secondNumber={1} operation="addition" feedback="incorrect" isAnimating t={t} />);
    expect(mood()).toBe('thinking');
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

  describe('rounding', () => {
    it('renders the task chip, the number and a question mark', () => {
      render(
        <ProblemDisplay
          firstNumber={47}
          secondNumber={10}
          operation="rounding"
          feedback={null}
          isAnimating={false}
          t={t}
          answer={50}
        />
      );
      expect(screen.getByText('Round to the nearest 10')).toBeDefined();
      expect(screen.getByText('≈')).toBeDefined();
      expect(screen.getByText('?')).toBeDefined();
      expect(screen.queryByTestId('number-line')).toBeNull();
    });

    it('reveals the rounded answer once correct', () => {
      render(
        <ProblemDisplay
          firstNumber={47}
          secondNumber={10}
          operation="rounding"
          feedback="correct"
          isAnimating={false}
          t={t}
          answer={50}
        />
      );
      expect(screen.getByText('50')).toBeDefined();
      expect(screen.queryByText('?')).toBeNull();
    });

    it('shows the number line when enabled', () => {
      render(
        <ProblemDisplay
          firstNumber={47}
          secondNumber={10}
          operation="rounding"
          feedback={null}
          isAnimating={false}
          t={t}
          answer={50}
          showNumberLine
        />
      );
      expect(screen.getByTestId('number-line')).toBeDefined();
    });
  });

  describe('comparison', () => {
    it('renders both numbers around an empty box', () => {
      render(
        <ProblemDisplay
          firstNumber={7}
          secondNumber={9}
          operation="comparison"
          feedback={null}
          isAnimating={false}
          t={t}
          answer={-1}
        />
      );
      expect(screen.getByText('Which sign fits?')).toBeDefined();
      expect(screen.getByText('7')).toBeDefined();
      expect(screen.getByText('9')).toBeDefined();
      expect(screen.getByTestId('comparison-box').textContent).toBe('?');
    });

    it('fills the box with the sign once correct', () => {
      render(
        <ProblemDisplay
          firstNumber={7}
          secondNumber={9}
          operation="comparison"
          feedback="correct"
          isAnimating={false}
          t={t}
          answer={-1}
        />
      );
      expect(screen.getByTestId('comparison-box').textContent).toBe('<');
    });

    it('renders the sum on the left in sums mode', () => {
      render(
        <ProblemDisplay
          firstNumber={7}
          secondNumber={9}
          operation="comparison"
          feedback={null}
          isAnimating={false}
          t={t}
          answer={-1}
          addends={[3, 4]}
        />
      );
      expect(screen.getByText('3 + 4')).toBeDefined();
    });
  });
});
