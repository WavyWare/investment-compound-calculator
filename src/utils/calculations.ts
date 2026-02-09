import { Period, CalculationResult, MonthlyData, PeriodSummary } from '../types';

/**
 * Calculate investment growth with compound interest
 * @param initialBalance Starting balance
 * @param annualRate Annual interest rate (percentage)
 * @param periods Array of investment periods
 * @returns Complete calculation result with monthly data
 */
export const calculateInvestment = (
  initialBalance: number,
  annualRate: number,
  periods: Period[]
): CalculationResult => {
  const monthlyRate = annualRate / 100 / 12;
  let balance = initialBalance;
  let cumulativeContributions = initialBalance;
  let cumulativeWithdrawals = 0;
  let cumulativeInterest = 0;
  
  const monthlyData: MonthlyData[] = [];
  const periodSummaries: PeriodSummary[] = [];
  let currentMonth = 0;

  periods.forEach((period, periodIndex) => {
    const periodStartBalance = balance;
    let periodContributions = 0;
    let periodWithdrawals = 0;
    let periodInterest = 0;

    for (let month = 1; month <= period.duration; month++) {
      currentMonth++;
      
      // Calculate interest on current balance FIRST
      const monthlyInterest = balance * monthlyRate;
      balance += monthlyInterest;
      periodInterest += monthlyInterest;
      cumulativeInterest += monthlyInterest;

      let contribution = 0;
      let withdrawal = 0;

      // Apply monthly action based on period type AFTER interest
      if (period.type === 'contribution') {
        contribution = period.amount;
        balance += contribution;
        periodContributions += contribution;
        cumulativeContributions += contribution;
      } else if (period.type === 'withdrawal') {
        withdrawal = period.amount;
        balance = Math.max(0, balance - withdrawal); // Don't go negative
        periodWithdrawals += withdrawal;
        cumulativeWithdrawals += withdrawal;
      }

      // Store monthly data
      monthlyData.push({
        month: currentMonth,
        balance: Math.max(0, balance),
        contribution,
        withdrawal,
        interest: monthlyInterest,
        cumulativeContributions,
        cumulativeWithdrawals,
        cumulativeInterest,
        periodType: period.type,
        periodNumber: periodIndex + 1
      });
    }

    // Store period summary
    periodSummaries.push({
      periodNumber: periodIndex + 1,
      type: period.type,
      duration: period.duration,
      startBalance: periodStartBalance,
      endBalance: balance,
      totalContributions: periodContributions,
      totalWithdrawals: periodWithdrawals,
      totalInterest: periodInterest,
      monthlyAmount: period.amount
    });
  });

  return {
    monthlyData,
    periodSummaries,
    totalContributions: cumulativeContributions,
    totalWithdrawals: cumulativeWithdrawals,
    totalInterest: cumulativeInterest,
    finalBalance: Math.max(0, balance)
  };
};

/**
 * Format number as currency (PLN)
 */
export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString('pl-PL', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })} PLN`;
};

/**
 * Format number as percentage
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

/**
 * Get display label for period type
 */
export const getPeriodTypeLabel = (type: string): string => {
  switch (type) {
    case 'contribution':
      return 'Monthly Contribution';
    case 'pause':
      return 'Pause Period';
    case 'withdrawal':
      return 'Monthly Withdrawal';
    default:
      return type;
  }
};

/**
 * Get color for period type
 */
export const getPeriodColor = (type: string): string => {
  switch (type) {
    case 'contribution':
      return '#4caf50'; // Green
    case 'pause':
      return '#ff9800'; // Orange
    case 'withdrawal':
      return '#f44336'; // Red
    default:
      return '#667eea'; // Default purple
  }
};
