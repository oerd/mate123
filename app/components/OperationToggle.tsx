import React from 'react';
import { useLanguage } from '../LanguageContext';
import { translations } from '../translations';
import { Operation, operationLookup, allOperations } from '../TestParametersContext';

interface OperationToggleProps {
  operation: Operation;
  setOperation: (operation: Operation) => void;
  availableOperations?: Operation[];
}

export const OperationToggle: React.FC<OperationToggleProps> = ({ 
  operation, 
  setOperation,
  availableOperations = ['addition', 'subtraction', 'multiplication', 'division'],
}) => {
  const { language } = useLanguage();
  const t = translations[language];



  return (
    <div className="flex gap-2 mb-6">
      {allOperations.map((op) => 
        availableOperations.includes(op) && (
          <button
            key={op}
            onClick={() => setOperation(op)}
            className={`p-3 rounded-lg transition-all flex items-center justify-center w-12 h-12 text-xl font-bold ${
              operation === op
                ? 'bg-ctp-surface1 border-2 border-ctp-blue scale-110'
                : 'bg-ctp-surface0 hover:bg-ctp-surface1'
            }`}
            aria-label={t[op]}
            title={t[op]}
          >
            {operationLookup(op)}
          </button>
        )
      )}
    </div>
  );
};