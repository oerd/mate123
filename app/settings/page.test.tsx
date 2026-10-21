import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { ThemeProvider } from '../ThemeContext';
import { LanguageProvider } from '../LanguageContext';
import { TestParametersProvider } from '../TestParametersContext';
import Settings from './page';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <LanguageProvider>
      <TestParametersProvider>
        {children}
      </TestParametersProvider>
    </LanguageProvider>
  </ThemeProvider>
);

describe('Settings Page', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.pushState({}, '', '/');
  });

  it('renders all sections (language, teacher settings)', () => {
    render(<Settings />, { wrapper: Wrapper });

    expect(screen.getByText('Language Settings')).toBeDefined();
    expect(screen.getByText('Teacher Settings')).toBeDefined();
  });

  it('switches theme and persists the choice', () => {
    render(<Settings />, { wrapper: Wrapper });

    const dark = screen.getByRole('button', { name: 'Dark' });
    const system = screen.getByRole('button', { name: 'System' });
    expect(system.getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(dark);

    expect(dark.getAttribute('aria-pressed')).toBe('true');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(window.localStorage.getItem('math-practice:themeMode')).toBe('dark');
  });

  it('cannot reduce operations below 1', () => {
    window.localStorage.setItem(
      'math-practice:testParameters',
      JSON.stringify({
        firstOperandMin: 1,
        firstOperandMax: 10,
        secondOperandMin: 1,
        secondOperandMax: 10,
        operations: ['addition'],
        numberOfResults: 6,
        sortResults: false,
      })
    );

    render(<Settings />, { wrapper: Wrapper });

    const additionButton = screen.getByTitle('Addition');
    fireEvent.click(additionButton);

    expect(additionButton.getAttribute('aria-pressed')).toBe('true');
  });

  it('save button updates context and localStorage', () => {
    render(<Settings />, { wrapper: Wrapper });

    const saveButton = screen.getByText('Save Settings');
    fireEvent.click(saveButton);

    const stored = window.localStorage.getItem('math-practice:testParameters');
    expect(stored).toBeDefined();

    const parsed = JSON.parse(stored!);
    expect(parsed.operations).toContain('addition');
    expect(parsed.operations).toContain('subtraction');
    expect(parsed.numberOfResults).toBe(6);
    expect(parsed.sortResults).toBe(false);
  });

  it('number of results slider works', () => {
    render(<Settings />, { wrapper: Wrapper });

    const slider = screen.getByRole('slider');
    expect(slider).toBeDefined();

    fireEvent.change(slider, { target: { value: '4' } });

    const saveButton = screen.getByText('Save Settings');
    fireEvent.click(saveButton);

    const stored = window.localStorage.getItem('math-practice:testParameters');
    const parsed = JSON.parse(stored!);
    expect(parsed.numberOfResults).toBe(4);
  });

  it('sort results toggle works', () => {
    render(<Settings />, { wrapper: Wrapper });

    const toggle = screen.getByRole('checkbox');
    expect(toggle).toBeDefined();

    fireEvent.click(toggle);

    const saveButton = screen.getByText('Save Settings');
    fireEvent.click(saveButton);

    const stored = window.localStorage.getItem('math-practice:testParameters');
    const parsed = JSON.parse(stored!);
    expect(parsed.sortResults).toBe(true);
  });

  it('shows rounding and comparison settings only when those operations are selected', () => {
    render(<Settings />, { wrapper: Wrapper });

    expect(screen.queryByTestId('rounding-settings')).toBeNull();
    expect(screen.queryByTestId('comparison-settings')).toBeNull();

    fireEvent.click(screen.getByTitle('Rounding'));
    expect(screen.getByTestId('rounding-settings')).toBeDefined();

    fireEvent.click(screen.getByTitle('Comparison'));
    expect(screen.getByTestId('comparison-settings')).toBeDefined();
  });

  it('saves rounding and comparison settings', () => {
    render(<Settings />, { wrapper: Wrapper });

    fireEvent.click(screen.getByTitle('Rounding'));
    fireEvent.click(screen.getByTitle('Comparison'));
    fireEvent.click(screen.getByRole('button', { name: '100' }));
    fireEvent.click(screen.getByRole('button', { name: '4 · with distractors' }));
    fireEvent.click(screen.getByLabelText('Show the number line'));
    fireEvent.click(screen.getByRole('button', { name: 'Sums' }));
    fireEvent.click(screen.getByText('Save Settings'));

    const stored = JSON.parse(window.localStorage.getItem('math-practice:testParameters') ?? '{}');
    expect(stored.operations).toEqual(['addition', 'subtraction', 'rounding', 'comparison']);
    expect(stored.roundingNearest).toBe(100);
    expect(stored.roundingAnswers).toBe(4);
    expect(stored.roundingNumberLine).toBe(true);
    expect(stored.comparisonModes).toEqual(['numbers', 'sums']);
  });

  it('keeps at least one comparison mode selected', () => {
    render(<Settings />, { wrapper: Wrapper });

    fireEvent.click(screen.getByTitle('Comparison'));
    const numbers = screen.getByRole('button', { name: 'Numbers' });
    expect(numbers.getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(numbers);
    expect(numbers.getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: 'Sums' }));
    fireEvent.click(numbers);
    expect(numbers.getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByRole('button', { name: 'Sums' }).getAttribute('aria-pressed')).toBe('true');
  });
});
