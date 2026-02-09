import React, { useState, useEffect } from 'react';
import Calculator from './components/Calculator';
import InvestmentChart from './components/InvestmentChart';
import ResultsSummary from './components/ResultsSummary';
import { Period, CalculationResult } from './types';
import { calculateInvestment } from './utils/calculations';
import './styles/App.css';

const App: React.FC = () => {
  const [initialBalance, setInitialBalance] = useState<number>(10000);
  const [annualRate, setAnnualRate] = useState<number>(7);
  const [periods, setPeriods] = useState<Period[]>([
    {
      id: Date.now(),
      type: 'contribution',
      duration: 12,
      amount: 500,
      label: 'Initial savings'
    }
  ]);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // Recalculate when inputs change
  useEffect(() => {
    if (periods.length > 0) {
      const calculationResult = calculateInvestment(
        initialBalance,
        annualRate,
        periods
      );
      setResult(calculationResult);
    }
  }, [initialBalance, annualRate, periods]);

  const addPeriod = () => {
    setPeriods([
      ...periods,
      {
        id: Date.now(),
        type: 'contribution',
        duration: 12,
        amount: 500
      }
    ]);
  };

  const updatePeriod = (id: number, updates: Partial<Period>) => {
    setPeriods(
      periods.map(period =>
        period.id === id ? { ...period, ...updates } : period
      )
    );
  };

  const removePeriod = (id: number) => {
    if (periods.length > 1) {
      setPeriods(periods.filter(period => period.id !== id));
    }
  };

  const handleChartClick = (monthIndex: number) => {
    setSelectedMonth(monthIndex);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>💰 Investment Compound Calculator</h1>
        <p className="app-subtitle">
          Plan your financial future with compound interest calculations
        </p>
      </header>

      <div className="app-container">
        <Calculator
          initialBalance={initialBalance}
          annualRate={annualRate}
          periods={periods}
          onInitialBalanceChange={setInitialBalance}
          onAnnualRateChange={setAnnualRate}
          onAddPeriod={addPeriod}
          onUpdatePeriod={updatePeriod}
          onRemovePeriod={removePeriod}
        />

        {result && (
          <>
            <ResultsSummary 
              result={result} 
              selectedMonth={selectedMonth}
            />
            <InvestmentChart
              result={result}
              onPointClick={handleChartClick}
              selectedMonth={selectedMonth}
            />
          </>
        )}
      </div>

      <footer className="app-footer">
        <p>
          Created by JFTech | 
          <a 
            href="https://github.com/WavyWare/investment-compound-calculator" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
