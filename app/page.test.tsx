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

const wrongAnswerButton = () =>
    screen.getAllByRole('button').find(b => b.getAttribute('data-state') === 'idle' && b.textContent !== '4') as HTMLButtonElement;

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
        expect(screen.getByText('Next')).toBeDefined();

        const wrapper = screen.getByRole('link', { name: 'Settings' }).closest('header');
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

    const renderFixed = () => {
        window.localStorage.setItem('math-practice:testParameters', JSON.stringify(fixedParameters));
        render(<Home />, { wrapper: Wrapper });
    };

    const advanceButton = () => screen.getByTestId('advance-button');

    afterEach(() => {
        vi.useRealTimers();
        window.localStorage.clear();
    });

    it('offers a live "Skip" button before answering', () => {
        renderFixed();

        expect(advanceButton()).toHaveProperty('disabled', false);
        expect(advanceButton().textContent).toContain('Skip');
        expect(screen.queryByTestId('auto-advance-fill')).toBeNull();
    });

    it('skipping loads a new problem and resets the streak', () => {
        renderFixed();

        fireEvent.click(screen.getByRole('button', { name: '4' }));
        fireEvent.click(advanceButton());
        fireEvent.click(screen.getByRole('button', { name: '4' }));
        expect(screen.getByTestId('streak-badge').textContent).toContain('2');

        fireEvent.click(advanceButton());
        fireEvent.click(advanceButton());
        expect(screen.queryByTestId('streak-badge')).toBeNull();
        expect(screen.getByRole('button', { name: '4' })).toHaveProperty('disabled', false);
    });

    it('turns into "Next" and starts the green countdown on a correct answer', () => {
        renderFixed();

        fireEvent.click(screen.getByRole('button', { name: '4' }));

        expect(advanceButton()).toHaveProperty('disabled', false);
        expect(advanceButton().textContent).toContain('Next');
        expect(screen.getByTestId('auto-advance-fill').getAttribute('style')).toContain('animation-duration: 2000ms');
    });

    it('presses the button itself when the green runs out', () => {
        vi.useFakeTimers();
        renderFixed();

        fireEvent.click(screen.getByRole('button', { name: '4' }));
        fireEvent.animationEnd(screen.getByTestId('auto-advance-fill'));

        expect(advanceButton().classList.contains('translate-x-2')).toBe(true);

        act(() => {
            vi.advanceTimersByTime(160);
        });

        expect(advanceButton().textContent).toContain('Skip');
        expect(advanceButton().classList.contains('translate-x-2')).toBe(false);
        expect(screen.queryByTestId('auto-advance-fill')).toBeNull();
        expect(screen.getByRole('button', { name: '4' })).toHaveProperty('disabled', false);
    });

    it('advances immediately when the button is tapped during the countdown', () => {
        renderFixed();

        fireEvent.click(screen.getByRole('button', { name: '4' }));
        fireEvent.click(advanceButton());

        expect(advanceButton().textContent).toContain('Skip');
        expect(screen.queryByTestId('auto-advance-fill')).toBeNull();
    });

    it('never starts the countdown after a wrong answer', () => {
        vi.useFakeTimers();
        renderFixed();

        fireEvent.click(wrongAnswerButton());

        expect(advanceButton().textContent).toContain('Skip');
        expect(screen.queryByTestId('auto-advance-fill')).toBeNull();

        act(() => {
            vi.advanceTimersByTime(3000);
        });

        expect(advanceButton().textContent).toContain('Skip');
        expect(screen.getByRole('button', { name: '4' })).toHaveProperty('disabled', false);
    });
});

describe('Home Page answer feedback', () => {
    const fixedParameters = {
        firstOperandMin: 2,
        firstOperandMax: 2,
        secondOperandMin: 2,
        secondOperandMax: 2,
        operations: ['addition'],
        numberOfResults: 4,
        sortResults: true,
    };

    const renderFixed = () => {
        window.localStorage.setItem('math-practice:testParameters', JSON.stringify(fixedParameters));
        render(<Home />, { wrapper: Wrapper });
    };

    afterEach(() => {
        vi.useRealTimers();
        window.localStorage.clear();
    });

    it('reveals the answer in the equation once correct', () => {
        renderFixed();
        expect(screen.getByTestId('equation-answer').textContent).toBe('?');

        fireEvent.click(screen.getByRole('button', { name: '4' }));

        expect(screen.getByTestId('equation-answer').textContent).toBe('4');
        expect(screen.getByTestId('equation-answer').className).toContain('text-neo-correct');
        expect(screen.getByRole('button', { name: '4' }).getAttribute('data-state')).toBe('correct');
    });

    it('keeps a wrong pick marked and disabled while the rest stay tappable', () => {
        vi.useFakeTimers();
        renderFixed();

        const wrong = wrongAnswerButton();
        fireEvent.click(wrong);
        expect(wrong.getAttribute('data-state')).toBe('wrong');

        act(() => {
            vi.advanceTimersByTime(800);
        });

        expect(wrong).toHaveProperty('disabled', true);
        expect(wrong.getAttribute('data-state')).toBe('wrong');
        expect(screen.getByTestId('equation-answer').textContent).toBe('?');
        expect(screen.getByRole('button', { name: '4' })).toHaveProperty('disabled', false);

        fireEvent.click(screen.getByRole('button', { name: '4' }));
        expect(wrong.getAttribute('data-state')).toBe('wrong');
        expect(screen.getByTestId('equation-answer').textContent).toBe('4');
    });

    it('fills the progress tray and shows the set-complete card after ten correct answers', () => {
        vi.useFakeTimers();
        renderFixed();

        const dots = () => screen.getByTestId('progress-tray').querySelectorAll('[data-filled="true"]').length;
        expect(dots()).toBe(0);

        for (let i = 0; i < 10; i++) {
            fireEvent.click(screen.getByRole('button', { name: '4' }));
            expect(dots()).toBe(i + 1);
            fireEvent.click(screen.getByTestId('advance-button'));
        }

        expect(screen.getByTestId('set-complete')).toBeDefined();
        expect(screen.getByText('You did 10!')).toBeDefined();
        expect(screen.queryByTestId('advance-button')).toBeNull();

        fireEvent.click(screen.getByRole('button', { name: 'Keep going' }));
        expect(dots()).toBe(0);
        expect(screen.getByRole('button', { name: '4' })).toHaveProperty('disabled', false);
    });

    it('counts a streak only for first-try answers', () => {
        vi.useFakeTimers();
        renderFixed();

        fireEvent.click(screen.getByRole('button', { name: '4' }));
        expect(screen.queryByTestId('streak-badge')).toBeNull();
        fireEvent.click(screen.getByTestId('advance-button'));

        fireEvent.click(screen.getByRole('button', { name: '4' }));
        expect(screen.getByTestId('streak-badge').textContent).toContain('2');
        fireEvent.click(screen.getByTestId('advance-button'));

        fireEvent.click(wrongAnswerButton());
        act(() => {
            vi.advanceTimersByTime(800);
        });
        fireEvent.click(screen.getByRole('button', { name: '4' }));
        expect(screen.queryByTestId('streak-badge')).toBeNull();
    });
});
