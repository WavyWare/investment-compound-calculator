import React from 'react';
import { Period, CalculationResult } from '../types';
import PeriodCard from './PeriodCard';
import ResultsSummary from './ResultsSummary';
import { formatCurrency } from '../utils/calculations';
import '../styles/Calculator.css';

interface CalculatorProps {
  initialBalance: number;
  annualRate: number;
  periods: Period[];
  result: CalculationResult | null;
  selectedMonth: number | null;
  onInitialBalanceChange: (value: number) => void;
  onAnnualRateChange: (value: number) => void;
  onAddPeriod: () => void;
  onUpdatePeriod: (id: number, updates: Partial<Period>) => void;
  onRemovePeriod: (id: number) => void;
}

/**
 * Main Calculator Component
 * Handles all input fields and period management
 */
const Calculator: React.FC<CalculatorProps> = ({
  initialBalance,
  annualRate,
  periods,
  result,
  selectedMonth,
  onInitialBalanceChange,
  onAnnualRateChange,
  onAddPeriod,
  onUpdatePeriod,
  onRemovePeriod
}) => {
  return (
    <div className="calculator">
      {/* Initial Settings */}
      <div className="calculator-section">
        <h2>📊 Investment Parameters</h2>
        
        <div className="input-group">
          <label htmlFor="initialBalance">
            Initial Investment Amount (PLN):
          </label>
          <input
            id="initialBalance"
            type="number"
            value={initialBalance}
            onChange={(e) => onInitialBalanceChange(Number(e.target.value))}
            min="0"
            step="100"
          />
        </div>

        <div className="input-group">
          <label htmlFor="interestRate">
            Annual Interest Rate (%):
          </label>
          <input
            id="interestRate"
            type="number"
            value={annualRate}
            onChange={(e) => onAnnualRateChange(Number(e.target.value))}
            min="0"
            max="100"
            step="0.1"
          />
        </div>
      </div>

      {/* Period Management */}
      <div className="calculator-section">
        <h2>📅 Investment Periods</h2>
        
        <div className="periods-list">
          {periods.map((period, index) => (
            <PeriodCard
              key={period.id}
              period={period}
              periodNumber={index + 1}
              onUpdate={onUpdatePeriod}
              onRemove={onRemovePeriod}
              canRemove={periods.length > 1}
            />
          ))}
        </div>

        <button className="btn btn-primary" onClick={onAddPeriod}>
          ➕ Add Period
        </button>
      </div>

      {/* Results Summary */}
      {result && (
        <ResultsSummary result={result} selectedMonth={selectedMonth} />
      )}
    </div>
  );
};

export default Calculator;