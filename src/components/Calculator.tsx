import React from 'react';
import PeriodCard from './PeriodCard';
import { Period } from '../types';
import '../styles/Calculator.css';

interface CalculatorProps {
  initialBalance: number;
  annualRate: number;
  periods: Period[];
  onInitialBalanceChange: (value: number) => void;
  onAnnualRateChange: (value: number) => void;
  onAddPeriod: () => void;
  onUpdatePeriod: (id: number, updates: Partial<Period>) => void;
  onRemovePeriod: (id: number) => void;
}

const Calculator: React.FC<CalculatorProps> = ({
  initialBalance,
  annualRate,
  periods,
  onInitialBalanceChange,
  onAnnualRateChange,
  onAddPeriod,
  onUpdatePeriod,
  onRemovePeriod
}) => {
  return (
    <div className="calculator">
      <section className="calculator-section">
        <h2 className="section-title">📊 Initial Settings</h2>
        
        <div className="settings-grid">
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
              className="input-number"
            />
          </div>

          <div className="input-group">
            <label htmlFor="annualRate">
              Annual Interest Rate (%):
            </label>
            <input
              id="annualRate"
              type="number"
              value={annualRate}
              onChange={(e) => onAnnualRateChange(Number(e.target.value))}
              min="0"
              max="100"
              step="0.1"
              className="input-number"
            />
          </div>
        </div>
      </section>

      <section className="calculator-section">
        <h2 className="section-title">📅 Investment Periods</h2>
        
        <div className="periods-list">
          {periods.map((period, index) => (
            <PeriodCard
              key={period.id}
              period={period}
              index={index}
              onUpdate={onUpdatePeriod}
              onRemove={onRemovePeriod}
              canRemove={periods.length > 1}
            />
          ))}
        </div>

        <button 
          className="btn btn-add"
          onClick={onAddPeriod}
        >
          ➕ Add New Period
        </button>
      </section>
    </div>
  );
};

export default Calculator;
