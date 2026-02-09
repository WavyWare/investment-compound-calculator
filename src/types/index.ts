/**
 * Type definitions for the Investment Calculator
 */

export type PeriodType = 'contribution' | 'pause' | 'withdrawal';

/**
 * Represents a single investment period
 */
export interface Period {
  id: number;
  type: PeriodType;
  duration: number; // in months
  amount?: number; // for contribution or withdrawal
}

/**
 * Data for a single month in the calculation
 */
export interface MonthlyData {
  month: number;
  balance: number;
  contribution: number;
  withdrawal: number;
  interest: number;
  periodType: PeriodType;
  periodNumber: number;
}

/**
 * Summary data for a period
 */
export interface PeriodSummary {
  periodNumber: number;
  type: PeriodType;
  duration: number;
  startBalance: number;
  endBalance: number;
  totalContributions: number;
  totalWithdrawals: number;
  totalInterest: number;
  monthlyAmount: number;
}

/**
 * Complete calculation result
 */
export interface CalculationResult {
  monthlyData: MonthlyData[];
  periodSummaries: PeriodSummary[];
  totalContributions: number;
  totalWithdrawals: number;
  totalInterest: number;
  finalBalance: number;
}
