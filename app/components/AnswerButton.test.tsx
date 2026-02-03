import { render, screen, fireEvent } from '@testing-library/react';
import { AnswerButton } from './AnswerButton';
import { describe, it, expect, vi } from 'vitest';

describe('AnswerButton', () => {
  it('renders the value correctly', () => {
    render(
      <AnswerButton
        value={42}
        index={0}
        isSelected={false}
        isDisabled={false}
        onClick={() => {}}
      />
    );
    expect(screen.getByText('42')).toBeDefined();
  });

  it('calls onClick with value and index', () => {
    const mockClick = vi.fn();
    render(
      <AnswerButton
        value={42}
        index={5}
        isSelected={false}
        isDisabled={false}
        onClick={mockClick}
      />
    );
    fireEvent.click(screen.getByText('42'));
    expect(mockClick).toHaveBeenCalledWith(42, 5);
  });

  it('applies selected styling', () => {
    render(
      <AnswerButton
        value={42}
        index={0}
        isSelected={true}
        isDisabled={false}
        onClick={() => {}}
      />
    );
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('ring-2');
    expect(btn.className).toContain('ring-ctp-blue');
  });

  it('applies disabled styling', () => {
    render(
      <AnswerButton
        value={42}
        index={0}
        isSelected={false}
        isDisabled={true}
        onClick={() => {}}
      />
    );
    const btn = screen.getByRole('button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn.className).toContain('opacity-60');
  });
});
