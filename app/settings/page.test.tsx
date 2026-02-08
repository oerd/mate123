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

  it('renders all sections (language, theme, teacher settings)', () => {
    render(<Settings />, { wrapper: Wrapper });

    expect(screen.getByText('Language Settings')).toBeDefined();
    expect(screen.getByText('Theme Settings')).toBeDefined();
    expect(screen.getByText('Teacher Settings')).toBeDefined();
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
});
