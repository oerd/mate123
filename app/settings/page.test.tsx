import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
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

  it('does not apply the interactive press effect to the settings overlay', () => {
    const { container } = render(<Settings />, { wrapper: Wrapper });

    const overlay = container.firstElementChild as HTMLElement;
    expect(overlay.className).toContain('shadow-hard');
    expect(overlay.className).not.toContain('box-shadow-hard');
  });

  it('uses only theme tokens, no leftover Catppuccin classes', () => {
    const { container } = render(<Settings />, { wrapper: Wrapper });
    expect(container.innerHTML).not.toMatch(/ctp-/);
  });

  it('highlights the active language chip in the shared selected color', () => {
    render(<Settings />, { wrapper: Wrapper });
    const english = screen.getByRole('button', { name: 'English' });
    expect(english.getAttribute('aria-pressed')).toBe('true');
    expect(english.className).toContain('bg-neo-orange');
    fireEvent.click(screen.getByRole('button', { name: 'Deutsch' }));
    expect(screen.getByRole('button', { name: 'Deutsch' }).className).toContain('bg-neo-orange');
  });

  it('marks selected operations without the animated overlay', () => {
    const { container } = render(<Settings />, { wrapper: Wrapper });

    const addition = screen.getByTitle(/addition/i);
    expect(addition.getAttribute('aria-pressed')).toBe('true');
    expect(addition.className).toContain('bg-neo-orange');
    expect(container.querySelector('button[title] > div')).toBeNull();
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

  it('saves every change to localStorage without a save button', () => {
    render(<Settings />, { wrapper: Wrapper });

    expect(screen.queryByText('Save Settings')).toBeNull();
    expect(window.localStorage.getItem('math-practice:testParameters')).toBeNull();

    fireEvent.click(screen.getByTitle('Multiplication'));

    const parsed = JSON.parse(window.localStorage.getItem('math-practice:testParameters')!);
    expect(parsed.operations).toEqual(['addition', 'subtraction', 'multiplication']);
    expect(parsed.numberOfResults).toBe(6);
    expect(parsed.sortResults).toBe(false);
  });

  it('number of results chips work', () => {
    render(<Settings />, { wrapper: Wrapper });

    const group = screen.getByRole('group', { name: 'Number of Answers' });
    const six = within(group).getByRole('button', { name: '6' });
    expect(six.getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(within(group).getByRole('button', { name: '4' }));

    const stored = window.localStorage.getItem('math-practice:testParameters');
    const parsed = JSON.parse(stored!);
    expect(parsed.numberOfResults).toBe(4);
  });

  it('sort results toggle works', () => {
    render(<Settings />, { wrapper: Wrapper });

    const toggle = screen.getByRole('checkbox');
    expect(toggle).toBeDefined();

    fireEvent.click(toggle);

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

    const stored = JSON.parse(window.localStorage.getItem('math-practice:testParameters') ?? '{}');
    expect(stored.operations).toEqual(['addition', 'subtraction', 'rounding', 'comparison']);
    expect(stored.roundingNearest).toEqual([10, 100]);
    expect(stored.roundingAnswers).toBe(4);
    expect(stored.roundingNumberLine).toBe(true);
    expect(stored.comparisonModes).toEqual(['numbers', 'sums']);
  });

  it('allows selecting multiple rounding targets but keeps at least one', () => {
    render(<Settings />, { wrapper: Wrapper });

    fireEvent.click(screen.getByTitle('Rounding'));
    const ten = screen.getByRole('button', { name: '10' });
    const thousand = screen.getByRole('button', { name: '1000' });
    expect(ten.getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(ten);
    expect(ten.getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(thousand);
    expect(thousand.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(ten);
    expect(ten.getAttribute('aria-pressed')).toBe('false');
    const stored = JSON.parse(window.localStorage.getItem('math-practice:testParameters') ?? '{}');
    expect(stored.roundingNearest).toEqual([1000]);
  });

  it('reflects toggle switch state on the checkbox', () => {
    render(<Settings />, { wrapper: Wrapper });

    const sort = screen.getByLabelText('Randomize answer options') as HTMLInputElement;
    expect(sort.checked).toBe(false);
    fireEvent.click(sort);
    expect(sort.checked).toBe(true);
    expect(screen.getByLabelText('Sort answer options from smallest to largest')).toBe(sort);
    expect(sort.nextElementSibling?.className).toContain('peer-checked:bg-neo-green');
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

  it('shows the autosave status and turns it red when settings cannot be stored', () => {
    render(<Settings />, { wrapper: Wrapper });

    const status = screen.getByTestId('autosave-status');
    expect(status.getAttribute('data-status')).toBe('success');
    expect(status.textContent).toContain('Saved automatically');

    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    fireEvent.click(screen.getByTitle('Multiplication'));

    expect(status.getAttribute('data-status')).toBe('error');
    expect(status.className).toContain('bg-neo-red');
    expect(status.textContent).toContain('Save failed');
    setItem.mockRestore();

    fireEvent.click(screen.getByTitle('Division'));
    expect(status.getAttribute('data-status')).toBe('success');
    const parsed = JSON.parse(window.localStorage.getItem('math-practice:testParameters')!);
    expect(parsed.operations).toContain('division');
  });

  it('turns share green on copy and back to blue after a change', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<Settings />, { wrapper: Wrapper });

    const share = screen.getByText('Share Settings').closest('button')!;
    expect(share.className).toContain('bg-neo-blue');

    fireEvent.click(share);
    await waitFor(() => expect(share.getAttribute('data-status')).toBe('success'));
    expect(share.className).toContain('bg-neo-green');
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('?fm='));

    fireEvent.click(screen.getByLabelText('Randomize answer options'));
    expect(share.getAttribute('data-status')).toBe('idle');
    expect(share.className).toContain('bg-neo-blue');
  });

  it('opens the native share sheet when available', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', { value: share, configurable: true });
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<Settings />, { wrapper: Wrapper });

    const button = screen.getByText('Share Settings').closest('button')!;
    fireEvent.click(button);

    await waitFor(() => expect(button.getAttribute('data-status')).toBe('success'));
    expect(share).toHaveBeenCalledWith(expect.objectContaining({ url: expect.stringContaining('?fm=') }));
    expect(writeText).not.toHaveBeenCalled();
    expect(button.textContent).toContain('Shared!');
    Reflect.deleteProperty(navigator, 'share');
  });

  it('stays idle when the share sheet is dismissed', async () => {
    const share = vi.fn().mockRejectedValue(new DOMException('cancelled', 'AbortError'));
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', { value: share, configurable: true });
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<Settings />, { wrapper: Wrapper });

    const button = screen.getByText('Share Settings').closest('button')!;
    fireEvent.click(button);

    await waitFor(() => expect(share).toHaveBeenCalled());
    expect(writeText).not.toHaveBeenCalled();
    expect(button.getAttribute('data-status')).toBe('idle');
    Reflect.deleteProperty(navigator, 'share');
  });

  it('falls back to copying when native share fails', async () => {
    const share = vi.fn().mockRejectedValue(new DOMException('denied', 'NotAllowedError'));
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', { value: share, configurable: true });
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<Settings />, { wrapper: Wrapper });

    const button = screen.getByText('Share Settings').closest('button')!;
    fireEvent.click(button);

    await waitFor(() => expect(button.getAttribute('data-status')).toBe('success'));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('?fm='));
    expect(button.textContent).toContain('Copied!');
    Reflect.deleteProperty(navigator, 'share');
  });

  it('keeps the title and close button in a sticky header', () => {
    render(<Settings />, { wrapper: Wrapper });

    const header = screen.getByTestId('settings-header');
    expect(header.className).toContain('sticky');
    expect(header.contains(screen.getByRole('heading', { level: 1 }))).toBe(true);
    expect(header.contains(screen.getByTestId('settings-close'))).toBe(true);
  });
});
