import React, { useState } from 'react';
import { CalculationResult } from '../types';
import { formatCurrency } from '../utils/calculations';

interface ResultsSummaryProps {
  result: CalculationResult;
  selectedMonth: number | null;
}

/**
 * Results Summary Component
 * Displays calculation results and optional monthly breakdown
 */
const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  result,
  selectedMonth
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const selectedMonthData =
    selectedMonth !== null ? result.monthlyData[selectedMonth] : null;

  return (
    <div className="calculator-section results">
      <h2>📈 Results</h2>

      {/* Summary Cards */}
      <div className="results-summary">
        <div className="result-card">
          <h3>Final Balance</h3>
          <p className="result-value primary">
            {formatCurrency(result.finalBalance)}
          </p>
        </div>

        <div className="result-card">
          <h3>Total Contributions</h3>
          <p className="result-value">
            {formatCurrency(result.totalContributions)}
          </p>
        </div>

        <div className="result-card">
          <h3>Total Withdrawals</h3>
          <p className="result-value">
            {formatCurrency(result.totalWithdrawals)}
          </p>
        </div>

        <div className="result-card">
          <h3>Interest Earned</h3>
          <p className="result-value success">
            {formatCurrency(result.totalInterest)}
          </p>
        </div>

        <div className="result-card">
          <h3>Net Profit</h3>
          <p className="result-value success">
            {formatCurrency(
              result.finalBalance -
                result.totalContributions +
                result.totalWithdrawals
            )}
          </p>
        </div>

        <div className="result-card">
          <h3>Total Duration</h3>
          <p className="result-value">
            {result.monthlyData.length} months ({
              (result.monthlyData.length / 12).toFixed(1)
            }{' '}
            years)
          </p>
        </div>
      </div>

      {/* Selected Month Details */}
      {selectedMonthData && (
        <div className="selected-month-details">
          <h3>📍 Month {selectedMonthData.month} Details</h3>
          <div className="month-details-grid">
            <div>
              <strong>Balance:</strong> {formatCurrency(selectedMonthData.balance)}
            </div>
            <div>
              <strong>Contribution:</strong>{' '}
              {formatCurrency(selectedMonthData.contribution)}
            </div>
            <div>
              <strong>Withdrawal:</strong>{' '}
              {formatCurrency(selectedMonthData.withdrawal)}
            </div>
            <div>
              <strong>Interest:</strong> {formatCurrency(selectedMonthData.interest)}
            </div>
            <div>
              <strong>Period Type:</strong> {selectedMonthData.periodType}
            </div>
            <div>
              <strong>Period Number:</strong> {selectedMonthData.periodNumber}
            </div>
          </div>
        </div>
      )}

      {/* Monthly Breakdown Toggle */}
      <div className="breakdown-toggle">
        <button
          className="btn btn-secondary"
          onClick={() => setShowBreakdown(!showBreakdown)}
        >
          {showBreakdown ? '🔼 Hide' : '🔽 Show'} Monthly Breakdown
        </button>
      </div>

      {/* Monthly Breakdown Table */}
      {showBreakdown && (
        <div className="monthly-breakdown">
          <h3>Monthly Breakdown</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Period</th>
                  <th>Balance</th>
                  <th>Contribution</th>
                  <th>Withdrawal</th>
                  <th>Interest</th>
                </tr>
              </thead>
              <tbody>
                {result.monthlyData.map((data) => (
                  <tr key={data.month}>
                    <td>{data.month}</td>
                    <td>
                      Period {data.periodNumber} ({data.periodType})
                    </td>
                    <td>{formatCurrency(data.balance)}</td>
                    <td>{formatCurrency(data.contribution)}</td>
                    <td>{formatCurrency(data.withdrawal)}</td>
                    <td>{formatCurrency(data.interest)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Period Summaries */}
      <div className="period-summaries">
        <h3>Period Summaries</h3>
        {result.periodSummaries.map((summary) => (
          <div key={summary.periodNumber} className="period-summary-card">
            <h4>
              Period {summary.periodNumber}: {summary.type} ({summary.duration}{' '}
              months)
            </h4>
            <div className="summary-details">
              <p>
                <strong>Starting Balance:</strong>{' '}
                {formatCurrency(summary.startBalance)}
              </p>
              <p>
                <strong>Ending Balance:</strong>{' '}
                {formatCurrency(summary.endBalance)}
              </p>
              {summary.totalContributions > 0 && (
                <p>
                  <strong>Total Contributions:</strong>{' '}
                  {formatCurrency(summary.totalContributions)}
                </p>
              )}
              {summary.totalWithdrawals > 0 && (
                <p>
                  <strong>Total Withdrawals:</strong>{' '}
                  {formatCurrency(summary.totalWithdrawals)}
                </p>
              )}
              <p>
                <strong>Interest Earned:</strong>{' '}
                {formatCurrency(summary.totalInterest)}
              </p>
            </div>
          </div>
        ))}\n      </div>
    </div>
  );
};

export default ResultsSummary;
