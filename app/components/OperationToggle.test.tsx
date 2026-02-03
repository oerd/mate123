import { render, screen, fireEvent } from '@testing-library/react';
import { OperationToggle } from './OperationToggle';
import { describe, it, expect, vi } from 'vitest';
import { TestParametersProvider } from '../TestParametersContext';
import { LanguageProvider } from '../LanguageContext';

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
          onToggle={() => {}}
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
          onToggle={() => {}}
          options={['addition', 'subtraction', 'multiplication']}
        />
      </Wrapper>
    );
    
    const addBtn = screen.getByTitle(/addition/i);
    const subBtn = screen.getByTitle(/subtraction/i);
    const mulBtn = screen.getByTitle(/multiplication/i);

    // Default active class contains border-ctp-blue
    expect(addBtn.className).toContain('border-ctp-blue');
    expect(subBtn.className).toContain('border-ctp-blue');
    expect(mulBtn.className).not.toContain('border-ctp-blue');
  });
});
