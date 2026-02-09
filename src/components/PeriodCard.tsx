import React from 'react';
import { Period, PeriodType } from '../types';

interface PeriodCardProps {
  period: Period;
  periodNumber: number;
  onUpdate: (id: number, updates: Partial<Period>) => void;
  onRemove: (id: number) => void;
  canRemove: boolean;
}

/**
 * Period Card Component
 * Represents a single investment period with configuration options
 */
const PeriodCard: React.FC<PeriodCardProps> = ({
  period,
  periodNumber,
  onUpdate,
  onRemove,
  canRemove
}) => {
  const getPeriodTypeLabel = (type: PeriodType): string => {
    switch (type) {
      case 'contribution':
        return '💵 Contribution';
      case 'pause':
        return '⏸️ Pause';
      case 'withdrawal':
        return '💸 Withdrawal';
      default:
        return type;
    }
  };

  return (
    <div className="period-card">
      <div className="period-header">
        <span className="period-title">
          Period {periodNumber}: {getPeriodTypeLabel(period.type)}
        </span>
        {canRemove && (
          <button
            className="btn btn-remove"
            onClick={() => onRemove(period.id)}
            title="Remove period"
          >
            ❌
          </button>
        )}
      </div>

      <div className="period-body">
        <div className="input-group">
          <label htmlFor={`type-${period.id}`}>Period Type:</label>
          <select
            id={`type-${period.id}`}
            value={period.type}
            onChange={(e) =>
              onUpdate(period.id, { type: e.target.value as PeriodType })
            }
          >
            <option value="contribution">Monthly Contribution</option>
            <option value="pause">Pause (No Activity)</option>
            <option value="withdrawal">Monthly Withdrawal</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor={`duration-${period.id}`}>Duration (months):</label>
          <input
            id={`duration-${period.id}`}
            type="number"
            value={period.duration}
            onChange={(e) =>
              onUpdate(period.id, { duration: Number(e.target.value) })
            }
            min="1"
            step="1"
          />
        </div>

        {period.type !== 'pause' && (
          <div className="input-group">
            <label htmlFor={`amount-${period.id}`}>
              {period.type === 'contribution'
                ? 'Monthly Contribution'
                : 'Monthly Withdrawal'}{' '}
              (PLN):
            </label>
            <input
              id={`amount-${period.id}`}
              type="number"
              value={period.amount || 0}
              onChange={(e) =>
                onUpdate(period.id, { amount: Number(e.target.value) })
              }
              min="0"
              step="10"
            />
          </div>
        )}

        {period.type === 'pause' && (
          <p className="pause-note">
            💡 No contributions or withdrawals during this period. Existing
            balance will continue to earn interest.
          </p>
        )}
      </div>
    </div>
  );
};

export default PeriodCard;