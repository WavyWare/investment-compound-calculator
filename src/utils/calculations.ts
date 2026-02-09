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
  let totalContributions = initialBalance;
  let totalWithdrawals = 0;
  
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
      
      // Calculate interest on current balance
      const monthlyInterest = balance * monthlyRate;
      balance += monthlyInterest;
      periodInterest += monthlyInterest;

      let contribution = 0;
      let withdrawal = 0;

      // Apply monthly action based on period type
      if (period.type === 'contribution' && period.amount) {
        contribution = period.amount;
        balance += contribution;
        periodContributions += contribution;
        totalContributions += contribution;
      } else if (period.type === 'withdrawal' && period.amount) {
        withdrawal = period.amount;
        balance -= withdrawal;
        periodWithdrawals += withdrawal;
        totalWithdrawals += withdrawal;
      }

      // Store monthly data
      monthlyData.push({
        month: currentMonth,
        balance: Math.max(0, balance),
        contribution,
        withdrawal,
        interest: monthlyInterest,
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
      monthlyAmount: period.amount || 0
    });
  });

  const totalInterest = balance - totalContributions + totalWithdrawals;

  return {
    monthlyData,
    periodSummaries,
    totalContributions,
    totalWithdrawals,
    totalInterest,
    finalBalance: Math.max(0, balance)
  };
};

/**
 * Format number as currency (PLN)
 */
export const formatCurrency = (amount: number): string => {
  return `${amount.toFixed(2)} PLN`;
};

/**
 * Format number as percentage
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

/**
 * Format number with thousands separator
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};
