import React from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ThemeProvider } from './ThemeContext';
import { LanguageProvider } from './LanguageContext';
import { TestParametersProvider } from './TestParametersContext';
import Home from './page';

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
