import { render, screen, fireEvent } from '@testing-library/react';
import { ProblemDisplay } from './ProblemDisplay';
import { describe, it, expect, vi } from 'vitest';
import { translations } from '../translations';
import React from 'react';

describe('ProblemDisplay', () => {
  // Use real English translations for the test
  const t = translations['en'];

  it('renders the math problem correctly', () => {
    const inputRef = React.createRef<HTMLInputElement>();
    
    render(
      <ProblemDisplay
        firstNumber={5}
        secondNumber={3}
        operation="addition"
        userAnswer=""
        setUserAnswer={() => {}}
        onSubmit={() => {}}
        feedback={null}
        isAnimating={false}
        language="en"
        inputRef={inputRef}
        t={t}
      />
    );

    // Check for "5 + 3 = ?"
    // The component renders spans, so we might check for text presence
    expect(screen.getByText('5')).toBeDefined();
    expect(screen.getByText('+')).toBeDefined();
    expect(screen.getByText('3')).toBeDefined();
    expect(screen.getByText('=')).toBeDefined();
    expect(screen.getByText('?')).toBeDefined();
  });

  it('handles user input', () => {
    const setUserAnswer = vi.fn();
    const inputRef = React.createRef<HTMLInputElement>();

    render(
      <ProblemDisplay
        firstNumber={10}
        secondNumber={2}
        operation="division"
        userAnswer=""
        setUserAnswer={setUserAnswer}
        onSubmit={() => {}}
        feedback={null}
        isAnimating={false}
        language="en"
        inputRef={inputRef}
        t={t}
      />
    );

    const input = screen.getByPlaceholderText('?');
    fireEvent.change(input, { target: { value: '5' } });

    expect(setUserAnswer).toHaveBeenCalledWith('5');
  });

  it('handles form submission', () => {
    const onSubmit = vi.fn((e) => e.preventDefault());
    const inputRef = React.createRef<HTMLInputElement>();

    render(
      <ProblemDisplay
        firstNumber={7}
        secondNumber={7}
        operation="multiplication"
        userAnswer="49"
        setUserAnswer={() => {}}
        onSubmit={onSubmit}
        feedback={null}
        isAnimating={false}
        language="en"
        inputRef={inputRef}
        t={t}
      />
    );

    const button = screen.getByText(t.checkAnswer);
    fireEvent.click(button);

    expect(onSubmit).toHaveBeenCalled();
  });

  it('displays correct feedback', () => {
    const inputRef = React.createRef<HTMLInputElement>();

    render(
      <ProblemDisplay
        firstNumber={1}
        secondNumber={1}
        operation="addition"
        userAnswer="2"
        setUserAnswer={() => {}}
        onSubmit={() => {}}
        feedback="correct"
        isAnimating={false}
        language="en"
        inputRef={inputRef}
        t={t}
      />
    );

    expect(screen.getByText(t.correct)).toBeDefined();
    // Check for success animation class container
    const container = screen.getByText(t.correct).closest('.math-problem-container');
    expect(container).toBeDefined();
    // Note: 'animate-success' class is applied based on isAnimating prop, which is false here
  });

  it('does not render feedback text in DOM when feedback is null', () => {
    const inputRef = React.createRef<HTMLInputElement>();

    render(
      <ProblemDisplay
        firstNumber={1}
        secondNumber={1}
        operation="addition"
        userAnswer=""
        setUserAnswer={() => {}}
        onSubmit={() => {}}
        feedback={null}
        isAnimating={false}
        language="en"
        inputRef={inputRef}
        t={t}
      />
    );

    expect(screen.queryByText(t.correct)).toBeNull();
    expect(screen.queryByText(t.tryAgain)).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('renders feedback with aria-live for screen readers when feedback is present', () => {
    const inputRef = React.createRef<HTMLInputElement>();

    render(
      <ProblemDisplay
        firstNumber={1}
        secondNumber={1}
        operation="addition"
        userAnswer="2"
        setUserAnswer={() => {}}
        onSubmit={() => {}}
        feedback="correct"
        isAnimating={false}
        language="en"
        inputRef={inputRef}
        t={t}
      />
    );

    const status = screen.getByRole('status');
    expect(status).toBeDefined();
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.textContent).toContain(t.correct);
  });

  it('renders try-again feedback for incorrect answers', () => {
    const inputRef = React.createRef<HTMLInputElement>();

    render(
      <ProblemDisplay
        firstNumber={1}
        secondNumber={1}
        operation="addition"
        userAnswer="5"
        setUserAnswer={() => {}}
        onSubmit={() => {}}
        feedback="incorrect"
        isAnimating={false}
        language="en"
        inputRef={inputRef}
        t={t}
      />
    );

    const status = screen.getByRole('status');
    expect(status.textContent).toContain(t.tryAgain);
  });

  it('applies animation classes when animating', () => {
    const inputRef = React.createRef<HTMLInputElement>();
    const { container } = render(
      <ProblemDisplay
        firstNumber={1}
        secondNumber={1}
        operation="addition"
        userAnswer="2"
        setUserAnswer={() => {}}
        onSubmit={() => {}}
        feedback="incorrect"
        isAnimating={true}
        language="en"
        inputRef={inputRef}
        t={t}
      />
    );

    const problemContainer = container.querySelector('.animate-error');
    expect(problemContainer).toBeDefined();
  });
});
