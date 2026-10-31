import React from 'react';
import { useLanguage } from '../LanguageContext';
import { translations } from '../translations';
import { Operation, operationLookup, allOperations } from '../TestParametersContext';
import { motion } from 'framer-motion';

interface OperationToggleProps {
  options?: Operation[];
  selected: Operation | Operation[];
  onToggle: (operation: Operation) => void;
  className?: string;
  renderButtonClass?: (op: Operation, isSelected: boolean) => string;
  activeOverlayClass?: string | null;
  showLabels?: boolean;
}

export const OperationToggle: React.FC<OperationToggleProps> = ({
  options = allOperations,
  selected,
  onToggle,
  className = "flex bg-neo-surface border-4 border-neo-ink box-shadow-hard rounded-full p-1 sm:p-2 mb-4 sm:mb-6 gap-1 sm:gap-2",
  renderButtonClass,
  activeOverlayClass = "absolute inset-0 bg-neo-pink border-4 border-neo-ink box-shadow-hard rounded-full -z-10",
  showLabels = false
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
    `relative p-2 sm:p-3 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-2xl sm:text-3xl md:text-4xl font-black rounded-full z-10 transition-colors ${active
      ? 'text-black'
      : 'text-neo-ink-muted hover:text-neo-ink hover:bg-neo-surface-muted'
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
            {activeOverlayClass && isSelected(op) && (
              <motion.div
                layoutId="activeOperation"
                className={activeOverlayClass}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            )}
            <span className={`relative z-10 ${op === 'comparison' ? 'text-base sm:text-lg md:text-xl tracking-tighter' : ''}`}>
              {operationLookup(op)}
            </span>
            {showLabels && <span className="relative z-10 text-xs font-bold leading-none">{t[op]}</span>}
          </button>
        )
      )}
    </div>
  );
};
