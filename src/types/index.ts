/**
 * Type definitions for the Investment Calculator
 */

export type PeriodType = 'contribution' | 'pause' | 'withdrawal';

export interface Period {
  id: number;
  type: PeriodType;
  duration: number; // in months
  amount: number; // for contribution or withdrawal (0 for pause)
  label?: string;
}

export interface MonthlyData {
  month: number;
  balance: number;
  contribution: number;
  withdrawal: number;
  interest: number;
  cumulativeContributions: number;
  cumulativeWithdrawals: number;
  cumulativeInterest: number;
  periodType: PeriodType;
  periodNumber: number;
}

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

export interface CalculationResult {
  monthlyData: MonthlyData[];
  periodSummaries: PeriodSummary[];
  totalContributions: number;
  totalWithdrawals: number;
  totalInterest: number;
  finalBalance: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
    fill: boolean;
  }[];
}
