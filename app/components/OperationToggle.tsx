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
}

export const OperationToggle: React.FC<OperationToggleProps> = ({
  options = allOperations,
  selected,
  onToggle,
  className = "flex bg-white border-4 border-black box-shadow-hard rounded-full p-2 mb-6 gap-2",
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
    `relative p-3 flex items-center justify-center w-16 h-16 text-4xl font-black rounded-full z-10 transition-colors ${active
      ? 'text-black'
      : 'text-gray-400 hover:text-black hover:bg-gray-100'
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
            {isSelected(op) && (
              <motion.div
                layoutId="activeOperation"
                className="absolute inset-0 bg-neo-pink border-4 border-black box-shadow-hard rounded-full -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            )}
            <span className="relative z-10">{operationLookup(op)}</span>
          </button>
        )
      )}
    </div>
  );
};
