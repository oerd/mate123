import { render, screen, fireEvent } from '@testing-library/react';
import { ResultGrid, answerState } from './ResultGrid';
import { describe, it, expect, vi } from 'vitest';

const idle = { correctValue: null, wrongValues: [], pendingValue: null };

describe('answerState', () => {
  it('keeps wrong picks red even after the right answer is found', () => {
    expect(answerState(3, 5, [3], null)).toBe('wrong');
    expect(answerState(5, 5, [3], null)).toBe('correct');
    expect(answerState(7, 5, [3], null)).toBe('dimmed');
  });

  it('rings only the pick being checked', () => {
    expect(answerState(3, null, [], 3)).toBe('pending');
    expect(answerState(4, null, [], 3)).toBe('idle');
  });
});

describe('ResultGrid', () => {
  it('renders all answer options', () => {
    const options = [10, 20, 30, 40];
    render(<ResultGrid answerOptions={options} {...idle} onOptionClick={() => { }} />);
    options.forEach(opt => {
      expect(screen.getByText(opt.toString())).toBeDefined();
    });
  });

  it('calls onOptionClick when an option is clicked', () => {
    const onOptionClick = vi.fn();
    render(<ResultGrid answerOptions={[5, 10, 15]} {...idle} onOptionClick={onOptionClick} />);
    fireEvent.click(screen.getByText('10'));
    expect(onOptionClick).toHaveBeenCalledWith(10);
  });

  it('disables every button once the correct answer is revealed', () => {
    render(<ResultGrid answerOptions={[1, 2, 3]} correctValue={2} wrongValues={[1]} pendingValue={2} onOptionClick={() => { }} />);

    const btn1 = screen.getByText('1').closest('button') as HTMLButtonElement;
    const btn2 = screen.getByText('2').closest('button') as HTMLButtonElement;
    const btn3 = screen.getByText('3').closest('button') as HTMLButtonElement;

    expect(btn1.disabled).toBe(true);
    expect(btn1.getAttribute('data-state')).toBe('wrong');
    expect(btn2.disabled).toBe(true);
    expect(btn2.getAttribute('data-state')).toBe('correct');
    expect(btn3.disabled).toBe(true);
    expect(btn3.getAttribute('data-state')).toBe('dimmed');
  });

  it('keeps the remaining options tappable after a wrong pick', () => {
    render(<ResultGrid answerOptions={[1, 2, 3]} correctValue={null} wrongValues={[1]} pendingValue={null} onOptionClick={() => { }} />);
    expect((screen.getByText('1').closest('button') as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByText('2').closest('button') as HTMLButtonElement).disabled).toBe(false);
    expect((screen.getByText('3').closest('button') as HTMLButtonElement).disabled).toBe(false);
  });

  describe('grid column layout', () => {
    function getGridContainer(options: number[]) {
      const { container } = render(
        <ResultGrid answerOptions={options} {...idle} onOptionClick={() => { }} />
      );
      return container.querySelector('[class*="grid"]') as HTMLElement;
    }

    it('uses single row for 2 options', () => {
      const grid = getGridContainer([1, 2]);
      expect(grid.className).toContain('grid-cols-2');
      expect(grid.className).not.toContain('grid-cols-3');
    });

    it('uses single row for 3 options', () => {
      expect(getGridContainer([1, 2, 3]).className).toContain('grid-cols-3');
    });

    it('uses 2 rows of 2 for 4 options', () => {
      expect(getGridContainer([1, 2, 3, 4]).className).toContain('grid-cols-2');
    });

    it('uses 2 rows (3+2) for 5 options', () => {
      expect(getGridContainer([1, 2, 3, 4, 5]).className).toContain('grid-cols-3');
    });

    it('uses 2 rows of 3 for 6 options', () => {
      expect(getGridContainer([1, 2, 3, 4, 5, 6]).className).toContain('grid-cols-3');
    });

    it('uses 2 rows of 4 for 8 options', () => {
      expect(getGridContainer([1, 2, 3, 4, 5, 6, 7, 8]).className).toContain('grid-cols-4');
    });
  });
});
