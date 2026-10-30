import React from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider } from './ThemeContext';
import { LanguageProvider } from './LanguageContext';
import { TestParametersProvider } from './TestParametersContext';
import Home from './page';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>
        <LanguageProvider>
            <TestParametersProvider>
                {children}
            </TestParametersProvider>
        </LanguageProvider>
    </ThemeProvider>
);

describe('Home Page Hydration', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('hydrates without throwing Text content did not match errors', () => {
        // We spy on console.error to catch hydration warnings
        const consoleErrorSpy = vi.spyOn(console, 'error');

        // Create a container to simulate the document body
        const container = document.createElement('div');
        document.body.appendChild(container);

        // 1. Server Render
        const html = renderToString(
            <Wrapper>
                <Home />
            </Wrapper>
        );

        // Inject the server-rendered HTML into the container
        container.innerHTML = html;

        // 2. Client Hydration
        // This will trigger a hydration error if the server output doesn't match the client output
        hydrateRoot(
            container,
            <Wrapper>
                <Home />
            </Wrapper>
        );

        // Check if any error contains the hydration mismatch warning
        const hydrationErrors = consoleErrorSpy.mock.calls.filter(args =>
            args[0] && typeof args[0] === 'string' && args[0].includes('Text content did not match')
        );

        // We expect NO errors relating to "Text content did not match"
        expect(hydrationErrors.length).toBe(0);

        // Clean up
        document.body.removeChild(container);
    });
});

describe('Home Page settings link', () => {
    afterEach(() => {
        vi.useRealTimers();
        window.localStorage.clear();
    });

    it('keeps the settings link enabled after a correct answer', () => {
        vi.useFakeTimers();
        window.localStorage.setItem('math-practice:testParameters', JSON.stringify({
            firstOperandMin: 2,
            firstOperandMax: 2,
            secondOperandMin: 2,
            secondOperandMax: 2,
            operations: ['addition'],
            numberOfResults: 4,
            sortResults: true,
        }));

        render(<Home />, { wrapper: Wrapper });

        fireEvent.click(screen.getByRole('button', { name: '4' }));
        expect(screen.getByText('New Problem')).toBeDefined();

        const wrapper = screen.getByRole('link', { name: 'Settings' }).closest('.absolute');
        expect(wrapper?.className).not.toContain('pointer-events-none');

        act(() => {
            vi.advanceTimersByTime(2500);
        });
        expect(wrapper?.className).not.toContain('pointer-events-none');
    });
});

describe('Home Page auto-advance', () => {
    const fixedParameters = {
        firstOperandMin: 2,
        firstOperandMax: 2,
        secondOperandMin: 2,
        secondOperandMax: 2,
        operations: ['addition'],
        numberOfResults: 4,
        sortResults: true,
    };

    const renderFixed = (overrides: Record<string, unknown> = {}) => {
        window.localStorage.setItem('math-practice:testParameters', JSON.stringify({ ...fixedParameters, ...overrides }));
        render(<Home />, { wrapper: Wrapper });
    };

    const newProblemButton = () => screen.getByRole('button', { name: 'New Problem' });

    afterEach(() => {
        vi.useRealTimers();
        window.localStorage.clear();
    });

    it('shows a disabled "New Problem" button before answering', () => {
        renderFixed();

        expect(newProblemButton()).toHaveProperty('disabled', true);
        expect(screen.queryByTestId('auto-advance-fill')).toBeNull();
    });

    it('enables the button and starts the green countdown on a correct answer', () => {
        renderFixed();

        fireEvent.click(screen.getByRole('button', { name: '4' }));

        expect(newProblemButton()).toHaveProperty('disabled', false);
        expect(screen.getByTestId('auto-advance-fill').getAttribute('style')).toContain('animation-duration: 2000ms');
    });

    it('presses the button itself when the green runs out', () => {
        vi.useFakeTimers();
        renderFixed();

        fireEvent.click(screen.getByRole('button', { name: '4' }));
        fireEvent.animationEnd(screen.getByTestId('auto-advance-fill'));

        expect(newProblemButton().classList.contains('translate-x-2')).toBe(true);

        act(() => {
            vi.advanceTimersByTime(160);
        });

        expect(newProblemButton()).toHaveProperty('disabled', true);
        expect(newProblemButton().classList.contains('translate-x-2')).toBe(false);
        expect(screen.queryByTestId('auto-advance-fill')).toBeNull();
        expect(screen.getByRole('button', { name: '4' })).toHaveProperty('disabled', false);
    });

    it('advances immediately when the button is tapped during the countdown', () => {
        renderFixed();

        fireEvent.click(screen.getByRole('button', { name: '4' }));
        fireEvent.click(newProblemButton());

        expect(newProblemButton()).toHaveProperty('disabled', true);
        expect(screen.queryByTestId('auto-advance-fill')).toBeNull();
    });

    it('uses the delay of the configured speed', () => {
        renderFixed({ autoAdvance: 'fast' });

        fireEvent.click(screen.getByRole('button', { name: '4' }));

        expect(screen.getByTestId('auto-advance-fill').getAttribute('style')).toContain('animation-duration: 1000ms');
    });

    it('waits for a tap when auto-advance is off', () => {
        vi.useFakeTimers();
        renderFixed({ autoAdvance: 'off' });

        fireEvent.click(screen.getByRole('button', { name: '4' }));

        expect(newProblemButton()).toHaveProperty('disabled', false);
        expect(newProblemButton().classList.contains('bg-neo-green')).toBe(true);
        expect(screen.queryByTestId('auto-advance-fill')).toBeNull();

        act(() => {
            vi.advanceTimersByTime(5000);
        });
        expect(newProblemButton()).toHaveProperty('disabled', false);

        fireEvent.click(newProblemButton());
        expect(newProblemButton()).toHaveProperty('disabled', true);
    });

    it('never starts the countdown after a wrong answer', () => {
        vi.useFakeTimers();
        renderFixed();

        const wrongOption = screen.getAllByRole('button').find(b => /^\d+$/.test(b.textContent ?? '') && b.textContent !== '4');
        if (!wrongOption) throw new Error('expected a wrong answer option');
        fireEvent.click(wrongOption);

        expect(newProblemButton()).toHaveProperty('disabled', true);
        expect(screen.queryByTestId('auto-advance-fill')).toBeNull();

        act(() => {
            vi.advanceTimersByTime(3000);
        });

        expect(newProblemButton()).toHaveProperty('disabled', true);
        expect(wrongOption).toHaveProperty('disabled', false);
    });
});
