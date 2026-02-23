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
        onOptionClick={() => { }}
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
        onOptionClick={() => { }}
      />
    );

    const btn1 = screen.getByText('1').closest('button') as HTMLButtonElement;
    const btn2 = screen.getByText('2').closest('button') as HTMLButtonElement;
    const btn3 = screen.getByText('3').closest('button') as HTMLButtonElement;

    expect(btn1.disabled).toBe(true);
    expect(btn2.disabled).toBe(false);
    expect(btn3.disabled).toBe(true);
  });

  describe('grid column layout', () => {
    function getGridContainer(options: number[]) {
      const { container } = render(
        <ResultGrid answerOptions={options} selectedOptionValue={null} onOptionClick={() => { }} />
      );
      // The grid container is the inner div
      return container.querySelector('[class*="grid"]') as HTMLElement;
    }

    it('uses single row for 2 options', () => {
      const grid = getGridContainer([1, 2]);
      expect(grid.className).toContain('grid-cols-2');
      expect(grid.className).not.toContain('grid-cols-3');
    });

    it('uses single row for 3 options', () => {
      const grid = getGridContainer([1, 2, 3]);
      expect(grid.className).toContain('grid-cols-3');
    });

    it('uses 2 rows of 2 for 4 options', () => {
      const grid = getGridContainer([1, 2, 3, 4]);
      expect(grid.className).toContain('grid-cols-2');
    });

    it('uses 2 rows (3+2) for 5 options', () => {
      const grid = getGridContainer([1, 2, 3, 4, 5]);
      expect(grid.className).toContain('grid-cols-3');
    });

    it('uses 2 rows of 3 for 6 options', () => {
      const grid = getGridContainer([1, 2, 3, 4, 5, 6]);
      expect(grid.className).toContain('grid-cols-3');
    });

    it('uses 2 rows of 4 for 8 options', () => {
      const grid = getGridContainer([1, 2, 3, 4, 5, 6, 7, 8]);
      expect(grid.className).toContain('grid-cols-4');
    });
  });
});
