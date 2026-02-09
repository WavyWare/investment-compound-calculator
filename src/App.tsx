import React, { useState, useEffect } from 'react';
import Calculator from './components/Calculator';
import InvestmentChart from './components/InvestmentChart';
import { Period, CalculationResult } from './types';
import { calculateInvestment } from './utils/calculations';
import './styles/App.css';

/**
 * Main Application Component
 */
const App: React.FC = () => {
  const [initialBalance, setInitialBalance] = useState<number>(0);
  const [annualRate, setAnnualRate] = useState<number>(7);
  const [periods, setPeriods] = useState<Period[]>([
    {
      id: Date.now(),
      type: 'contribution',
      duration: 12,
      amount: 500
    }
  ]);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // Recalculate when inputs change
  useEffect(() => {
    handleCalculate();
  }, [initialBalance, annualRate, periods]);

  const handleCalculate = () => {
    if (periods.length === 0) return;
    
    const calculationResult = calculateInvestment(
      initialBalance,
      annualRate,
      periods
    );
    setResult(calculationResult);
    setSelectedMonth(null);
  };

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
    <div className=\"app\">
      <header className=\"app-header\">
        <h1>💰 Investment Compound Calculator</h1>
        <p className=\"subtitle\">
          Plan your financial journey with precision
        </p>
      </header>

      <div className=\"app-container\">
        <Calculator
          initialBalance={initialBalance}
          annualRate={annualRate}
          periods={periods}
          result={result}
          selectedMonth={selectedMonth}
          onInitialBalanceChange={setInitialBalance}
          onAnnualRateChange={setAnnualRate}
          onAddPeriod={addPeriod}
          onUpdatePeriod={updatePeriod}
          onRemovePeriod={removePeriod}
        />

        {result && result.monthlyData.length > 0 && (
          <InvestmentChart
            result={result}
            onPointClick={handleChartClick}
            selectedMonth={selectedMonth}
          />
        )}
      </div>

      <footer className=\"app-footer\">
        <p>
          Created by JFTech | 
          <a 
            href=\"https://github.com/WavyWare/investment-compound-calculator\" 
            target=\"_blank\" 
            rel=\"noopener noreferrer\"
          >
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
