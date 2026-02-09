import React from 'react';
import { Period, PeriodType } from '../types';
import { getPeriodTypeLabel, getPeriodColor } from '../utils/calculations';

interface PeriodCardProps {
  period: Period;
  index: number;
  onUpdate: (id: number, updates: Partial<Period>) => void;
  onRemove: (id: number) => void;
  canRemove: boolean;
}

const PeriodCard: React.FC<PeriodCardProps> = ({
  period,
  index,
  onUpdate,
  onRemove,
  canRemove
}) => {
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as PeriodType;
    onUpdate(period.id, { 
      type: newType,
      amount: newType === 'pause' ? 0 : period.amount || 500
    });
  };

  return (
    <div 
      className="period-card"
      style={{ borderLeftColor: getPeriodColor(period.type) }}
    >
      <div className="period-card-header">
        <h3 className="period-card-title">
          Period {index + 1}
          {period.label && <span className="period-label">: {period.label}</span>}
        </h3>
        {canRemove && (
          <button
            className="btn btn-remove"
            onClick={() => onRemove(period.id)}
            title="Remove period"
          >
            ✕
          </button>
        )}
      </div>

      <div className="period-card-body">
        <div className="input-group">
          <label htmlFor={`type-${period.id}`}>Period Type:</label>
          <select
            id={`type-${period.id}`}
            value={period.type}
            onChange={handleTypeChange}
            className="input-select"
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
            onChange={(e) => onUpdate(period.id, { duration: Number(e.target.value) })}
            min="1"
            step="1"
            className="input-number"
          />
        </div>

        {period.type !== 'pause' && (
          <div className="input-group">
            <label htmlFor={`amount-${period.id}`}>
              {period.type === 'contribution' ? 'Monthly Contribution' : 'Monthly Withdrawal'} (PLN):
            </label>
            <input
              id={`amount-${period.id}`}
              type="number"
              value={period.amount}
              onChange={(e) => onUpdate(period.id, { amount: Number(e.target.value) })}
              min="0"
              step="10"
              className="input-number"
            />
          </div>
        )}

        <div className="input-group">
          <label htmlFor={`label-${period.id}`}>Label (optional):</label>
          <input
            id={`label-${period.id}`}
            type="text"
            value={period.label || ''}
            onChange={(e) => onUpdate(period.id, { label: e.target.value })}
            placeholder="e.g., 'Early career', 'Retirement'"
            className="input-text"
          />
        </div>

        {period.type === 'pause' && (
          <p className="period-note">
            💡 During this period, no new contributions or withdrawals occur. 
            Your existing balance continues to earn compound interest.
          </p>
        )}
      </div>
    </div>
  );
};

export default PeriodCard;
