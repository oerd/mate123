import { render, screen, fireEvent } from '@testing-library/react';
import { AnswerButton } from './AnswerButton';
import { describe, it, expect, vi } from 'vitest';

describe('AnswerButton', () => {
  it('renders the value correctly', () => {
    render(<AnswerButton value={42} state="idle" onClick={() => { }} />);
    expect(screen.getByText('42')).toBeDefined();
  });

  it('calls onClick with value', () => {
    const mockClick = vi.fn();
    render(<AnswerButton value={42} state="idle" onClick={mockClick} />);
    fireEvent.click(screen.getByText('42'));
    expect(mockClick).toHaveBeenCalledWith(42);
  });

  it('marks the pending pick with a ring while it is being checked', () => {
    render(<AnswerButton value={42} state="pending" onClick={() => { }} />);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('ring-4');
    expect(btn.getAttribute('aria-pressed')).toBe('true');
  });

  it('uses smaller text for 3-digit values', () => {
    render(<AnswerButton value={100} state="idle" onClick={() => { }} />);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('sm:text-4xl');
    expect(btn.className).toContain('w-full');
  });

  it('uses the pill background while idle', () => {
    render(<AnswerButton value={1} state="idle" onClick={() => { }} />);
    expect(screen.getByRole('button').className).toContain('bg-neo-pill');
  });

  it('turns green with a check when correct', () => {
    render(<AnswerButton value={42} state="correct" onClick={() => { }} />);
    const btn = screen.getByRole('button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn.className).toContain('bg-neo-green');
    expect(btn.textContent).toContain('✓');
  });

  it('turns red with a cross and stays disabled when wrong', () => {
    render(<AnswerButton value={42} state="wrong" onClick={() => { }} />);
    const btn = screen.getByRole('button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn.className).toContain('bg-neo-red');
    expect(btn.className).not.toContain('grayscale');
    expect(btn.textContent).toContain('✕');
  });

  it('dims without grayscale once another option was correct', () => {
    render(<AnswerButton value={42} state="dimmed" onClick={() => { }} />);
    const btn = screen.getByRole('button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn.className).toContain('bg-neo-surface');
    expect(btn.className).not.toContain('grayscale');
    expect(btn.className).not.toContain('opacity-50');
  });
});
