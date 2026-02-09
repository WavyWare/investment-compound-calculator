class InvestmentCalculator {
    constructor() {
        this.periods = [];
        this.init();
    }

    init() {
        document.getElementById('add-period').addEventListener('click', () => this.addPeriod());
        document.getElementById('calculate').addEventListener('click', () => this.calculate());
        
        // Add initial period
        this.addPeriod();
    }

    addPeriod() {
        const periodId = Date.now();
        const periodNumber = this.periods.length + 1;
        
        const periodCard = document.createElement('div');
        periodCard.className = 'period-card';
        periodCard.dataset.periodId = periodId;
        
        periodCard.innerHTML = `
            <div class="period-header">
                <span class="period-title">Period ${periodNumber}</span>
                <button class="btn btn-danger" onclick="calculator.removePeriod(${periodId})">Remove</button>
            </div>
            <div class="form-group">
                <label>Period Type:</label>
                <select class="period-type" onchange="calculator.updatePeriodFields(${periodId})">
                    <option value="contribution">Monthly Contribution</option>
                    <option value="pause">Pause (No Contributions)</option>
                    <option value="withdrawal">Monthly Withdrawal</option>
                </select>
            </div>
            <div class="form-group">
                <label>Duration:</label>
                <input type="number" class="period-duration" value="12" min="1" step="1">
                <span class="currency">months</span>
            </div>
            <div class="period-dynamic-fields" id="dynamic-${periodId}">
                <div class="form-group">
                    <label>Monthly Amount:</label>
                    <input type="number" class="period-amount" value="500" min="0" step="50">
                    <span class="currency">PLN</span>
                </div>
            </div>
        `;
        
        document.getElementById('periods-container').appendChild(periodCard);
        this.periods.push(periodId);
        this.updatePeriodNumbers();
    }

    removePeriod(periodId) {
        const periodCard = document.querySelector(`[data-period-id="${periodId}"]`);
        if (periodCard) {
            periodCard.remove();
            this.periods = this.periods.filter(id => id !== periodId);
            this.updatePeriodNumbers();
        }
    }

    updatePeriodNumbers() {
        const periodCards = document.querySelectorAll('.period-card');
        periodCards.forEach((card, index) => {
            const title = card.querySelector('.period-title');
            title.textContent = `Period ${index + 1}`;
        });
    }

    updatePeriodFields(periodId) {
        const periodCard = document.querySelector(`[data-period-id="${periodId}"]`);
        const type = periodCard.querySelector('.period-type').value;
        const dynamicFields = periodCard.querySelector(`#dynamic-${periodId}`);
        
        let html = '';
        if (type === 'contribution') {
            html = `
                <div class="form-group">
                    <label>Monthly Contribution:</label>
                    <input type="number" class="period-amount" value="500" min="0" step="50">
                    <span class="currency">PLN</span>
                </div>
            `;
        } else if (type === 'withdrawal') {
            html = `
                <div class="form-group">
                    <label>Monthly Withdrawal:</label>
                    <input type="number" class="period-amount" value="500" min="0" step="50">
                    <span class="currency">PLN</span>
                </div>
            `;
        } else {
            html = '<p style="color: #666; font-style: italic;">No contributions or withdrawals during this period. Existing balance will continue to earn interest.</p>';
        }
        
        dynamicFields.innerHTML = html;
    }

    calculate() {
        const initialBalance = parseFloat(document.getElementById('initial-balance').value) || 0;
        const annualRate = parseFloat(document.getElementById('annual-rate').value) || 0;
        const monthlyRate = annualRate / 100 / 12;
        
        let balance = initialBalance;
        let totalContributions = initialBalance;
        let totalWithdrawals = 0;
        let timeline = [];
        
        const periodCards = document.querySelectorAll('.period-card');
        
        periodCards.forEach((card, index) => {
            const type = card.querySelector('.period-type').value;
            const duration = parseInt(card.querySelector('.period-duration').value) || 0;
            const amountInput = card.querySelector('.period-amount');
            const amount = amountInput ? parseFloat(amountInput.value) || 0 : 0;
            
            const periodStartBalance = balance;
            let periodContributions = 0;
            let periodWithdrawals = 0;
            
            for (let month = 1; month <= duration; month++) {
                // Apply interest first
                balance = balance * (1 + monthlyRate);
                
                // Then apply contribution or withdrawal
                if (type === 'contribution') {
                    balance += amount;
                    periodContributions += amount;
                    totalContributions += amount;
                } else if (type === 'withdrawal') {
                    balance -= amount;
                    periodWithdrawals += amount;
                    totalWithdrawals += amount;
                }
            }
            
            const periodEndBalance = balance;
            const periodInterest = periodEndBalance - periodStartBalance - periodContributions + periodWithdrawals;
            
            let typeLabel = '';
            let activityLabel = '';
            
            if (type === 'contribution') {
                typeLabel = 'Monthly Contributions';
                activityLabel = `Contributing ${amount.toFixed(2)} PLN/month`;
            } else if (type === 'withdrawal') {
                typeLabel = 'Monthly Withdrawals';
                activityLabel = `Withdrawing ${amount.toFixed(2)} PLN/month`;
            } else {
                typeLabel = 'Pause Period';
                activityLabel = 'No new contributions';
            }
            
            timeline.push({
                period: index + 1,
                type: typeLabel,
                activity: activityLabel,
                duration: duration,
                startBalance: periodStartBalance,
                endBalance: periodEndBalance,
                contributions: periodContributions,
                withdrawals: periodWithdrawals,
                interest: periodInterest
            });
        });
        
        const totalInterest = balance - totalContributions + totalWithdrawals;
        
        this.displayResults({
            totalContributions,
            totalWithdrawals,
            totalInterest,
            finalBalance: balance,
            timeline
        });
    }

    displayResults(results) {
        document.getElementById('total-contributions').textContent = 
            results.totalContributions.toFixed(2) + ' PLN';
        document.getElementById('total-withdrawals').textContent = 
            results.totalWithdrawals.toFixed(2) + ' PLN';
        document.getElementById('total-interest').textContent = 
            results.totalInterest.toFixed(2) + ' PLN';
        document.getElementById('final-balance').textContent = 
            results.finalBalance.toFixed(2) + ' PLN';
        
        const timeline = document.getElementById('timeline');
        timeline.innerHTML = '<h3 style="margin-bottom: 15px; color: #667eea;">Period-by-Period Breakdown</h3>';
        
        results.timeline.forEach(period => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.innerHTML = `
                <div class="timeline-period">Period ${period.period}: ${period.type}</div>
                <div class="timeline-details">
                    <strong>${period.activity}</strong> for ${period.duration} months<br>
                    Starting Balance: ${period.startBalance.toFixed(2)} PLN<br>
                    ${period.contributions > 0 ? `Total Contributions: ${period.contributions.toFixed(2)} PLN<br>` : ''}
                    ${period.withdrawals > 0 ? `Total Withdrawals: ${period.withdrawals.toFixed(2)} PLN<br>` : ''}
                    Interest Earned: ${period.interest.toFixed(2)} PLN<br>
                    Ending Balance: <strong>${period.endBalance.toFixed(2)} PLN</strong>
                </div>
            `;
            timeline.appendChild(item);
        });
        
        document.getElementById('results').style.display = 'block';
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize calculator
const calculator = new InvestmentCalculator();