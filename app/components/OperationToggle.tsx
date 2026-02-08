import React from 'react';
import { useLanguage } from '../LanguageContext';
import { translations } from '../translations';
import { Operation, operationLookup, allOperations } from '../TestParametersContext';

interface OperationToggleProps {
  // Operations to display
  options?: Operation[]; 
  
  // Selection state (single or multiple)
  selected: Operation | Operation[];
  
  // Callback
  onToggle: (operation: Operation) => void;
  
  // Styling
  className?: string;
  renderButtonClass?: (op: Operation, isSelected: boolean) => string;
}

export const OperationToggle: React.FC<OperationToggleProps> = ({ 
  options = allOperations,
  selected,
  onToggle,
  className = "flex gap-2 mb-6",
  renderButtonClass
}) => {
  const { language } = useLanguage();
  const t = translations[language];

  const isSelected = (op: Operation) => {
    if (Array.isArray(selected)) {
      return selected.includes(op);
    }
    return selected === op;
  };

  const defaultButtonClass = (op: Operation, active: boolean) => 
    `p-3 rounded-lg transition-all flex items-center justify-center w-12 h-12 text-xl font-bold ${
      active
        ? 'bg-ctp-surface1 border-2 border-ctp-blue scale-110'
        : 'bg-ctp-surface0 hover:bg-ctp-surface1'
    }`;

  const getButtonClass = renderButtonClass || defaultButtonClass;

  return (
    <div className={className}>
      {allOperations.map((op) => 
        options.includes(op) && (
          <button
            key={op}
            onClick={() => onToggle(op)}
            className={getButtonClass(op, isSelected(op))}
            aria-label={t[op]}
            aria-pressed={isSelected(op)}
            title={t[op]}
            type="button"
          >
            {operationLookup(op)}
          </button>
        )
      )}
    </div>
  );
};
