import { render, screen, fireEvent } from '@testing-library/react';
import { ResultGrid } from './ResultGrid';
import { describe, it, expect, vi } from 'vitest';

describe('ResultGrid', () => {
  it('renders all answer options', () => {
    const options = [10, 20, 30, 40];
    
    render(
      <ResultGrid
        answerOptions={options}
        selectedOptionValue={null}
        onOptionClick={() => {}}
      />
    );

    options.forEach(opt => {
      expect(screen.getByText(opt.toString())).toBeDefined();
    });
  });

  it('calls onOptionClick when an option is clicked', () => {
    const options = [5, 10, 15];
    const onOptionClick = vi.fn();

    render(
      <ResultGrid
        answerOptions={options}
        selectedOptionValue={null}
        onOptionClick={onOptionClick}
      />
    );

    fireEvent.click(screen.getByText('10'));
    expect(onOptionClick).toHaveBeenCalledWith(10);
  });

  it('disables other buttons when one is selected', () => {
    const options = [1, 2, 3];
    
    render(
      <ResultGrid
        answerOptions={options}
        selectedOptionValue={2}
        onOptionClick={() => {}}
      />
    );

    const btn1 = screen.getByText('1').closest('button') as HTMLButtonElement;
    const btn2 = screen.getByText('2').closest('button') as HTMLButtonElement;
    const btn3 = screen.getByText('3').closest('button') as HTMLButtonElement;

    expect(btn1.disabled).toBe(true);
    expect(btn2.disabled).toBe(false);
    expect(btn3.disabled).toBe(true);
  });
});
