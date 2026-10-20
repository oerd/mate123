import { render, screen, fireEvent } from '@testing-library/react';
import { OperationToggle } from './OperationToggle';
import { describe, it, expect, vi } from 'vitest';
import { TestParametersProvider } from '../TestParametersContext';
import { LanguageProvider } from '../LanguageContext';
import React from 'react';

// Wrap with providers since it uses useLanguage
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>
    <TestParametersProvider>
      {children}
    </TestParametersProvider>
  </LanguageProvider>
);

describe('OperationToggle', () => {
  it('renders buttons for available operations', () => {
    render(
      <Wrapper>
        <OperationToggle
          selected="addition"
          onToggle={() => { }}
          options={['addition', 'subtraction']}
        />
      </Wrapper>
    );

    expect(screen.getByTitle(/addition/i)).toBeDefined();
    expect(screen.getByTitle(/subtraction/i)).toBeDefined();
    expect(screen.queryByTitle(/multiplication/i)).toBeNull();
  });

  it('calls onToggle when clicked', () => {
    const mockOnToggle = vi.fn();
    render(
      <Wrapper>
        <OperationToggle
          selected="addition"
          onToggle={mockOnToggle}
          options={['addition', 'subtraction']}
        />
      </Wrapper>
    );

    fireEvent.click(screen.getByTitle(/subtraction/i));
    expect(mockOnToggle).toHaveBeenCalledWith('subtraction');
  });

  it('supports multi-select highlighting', () => {
    render(
      <Wrapper>
        <OperationToggle
          selected={['addition', 'subtraction']}
          onToggle={() => { }}
          options={['addition', 'subtraction', 'multiplication']}
        />
      </Wrapper>
    );

    const addBtn = screen.getByTitle(/addition/i);
    const subBtn = screen.getByTitle(/subtraction/i);
    const mulBtn = screen.getByTitle(/multiplication/i);

    // Active button gets text-black, inactive is text-gray-400
    expect(addBtn.className).toContain('text-black');
    expect(subBtn.className).toContain('text-black');
    expect(mulBtn.className).toContain('text-gray-400');
  });

  it('renders the rounding and comparison operations', () => {
    render(
      <Wrapper>
        <OperationToggle
          selected="rounding"
          onToggle={() => { }}
          options={['rounding', 'comparison']}
        />
      </Wrapper>
    );

    expect(screen.getByTitle(/rounding/i).textContent).toBe('≈');
    expect(screen.getByTitle(/comparison/i).textContent).toBe('<=>');
  });
});
