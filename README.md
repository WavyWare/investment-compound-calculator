# 💰 Investment Compound Calculator

A modern, feature-rich investment calculator built with **React**, **TypeScript**, and **Chart.js**. Calculate your investment growth over time with support for monthly contributions, pause periods, and withdrawals using compound interest calculations.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1+-blue.svg)
![React](https://img.shields.io/badge/React-18.2+-61dafb.svg)

## ✨ Features

### 📊 Comprehensive Investment Planning
- **Monthly Contributions**: Add regular investments during specified periods (e.g., 500 PLN/month)
- **Pause Periods**: Let your investments grow without new contributions while earning compound interest
- **Withdrawal Periods**: Plan for regular withdrawals while remaining balance continues to grow
- **Multiple Periods**: Chain different period types to create complex investment scenarios

### 📈 Interactive Visualization
- **Chart.js Integration**: Beautiful, interactive charts showing investment growth over time
- **Clickable Data Points**: Click any month on the chart to see detailed information for that specific time period
- **Real-time Updates**: Chart and calculations update dynamically as you change inputs
- **Visual Period Indicators**: Color-coded chart showing different investment period types

### 🧮 Accurate Calculations
- Compound interest calculations with configurable annual interest rate
- Monthly compounding frequency for precise results
- Detailed month-by-month breakdown
- Complete financial summary with totals and net profit

### 🎨 Modern User Interface
- Clean, intuitive design with gradient color scheme
- Fully responsive layout (works on mobile, tablet, and desktop)
- Easy period management (add/remove/configure)
- Expandable monthly breakdown table
- Period summaries with detailed statistics

### 💻 Technical Excellence
- Built with React 18 and TypeScript for type safety
- Webpack bundler for optimized production builds
- Hot Module Replacement for fast development
- Well-documented, maintainable code
- Modern ES2020+ JavaScript features

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ (with npm)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/WavyWare/investment-compound-calculator.git
   cd investment-compound-calculator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The application will automatically open in your browser at `http://localhost:3000`

### Build for Production

To create an optimized production build:

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Type Checking

To run TypeScript type checking:

```bash
npm run type-check
```

## 📖 How to Use

### 1. Set Investment Parameters

- **Initial Investment Amount**: Enter your starting capital (e.g., 10,000 PLN)
- **Annual Interest Rate**: Set expected annual return percentage (e.g., 7%)

### 2. Add Investment Periods

Create your investment timeline by adding different period types:

#### 📈 Monthly Contribution Period
- Regular monthly investments
- Example: Contribute 500 PLN/month for 60 months (5 years)
- Your balance grows through both contributions and compound interest

#### ⏸️ Pause Period
- No new contributions, but existing balance continues to grow
- Example: Pause for 12 months while taking a career break
- Compound interest continues to work on your existing balance

#### 📉 Monthly Withdrawal Period
- Regular withdrawals from your investment
- Remaining balance continues to earn interest
- Example: Withdraw 2,000 PLN/month for 120 months (retirement income)

### 3. View Results

The calculator automatically displays:

- **Summary Cards**: Key financial metrics at a glance
  - Final Balance
  - Total Contributions
  - Total Withdrawals
  - Interest Earned
  - Net Profit
  - Total Duration

- **Interactive Chart**: Visual representation of your investment growth
  - Click any point to see month-specific details
  - Color-coded lines for balance, contributions, and withdrawals
  - Smooth animations and hover effects

- **Monthly Breakdown**: Expandable table with month-by-month data
  - Balance progression
  - Contributions and withdrawals
  - Interest earned each month
  - Period identification

- **Period Summaries**: Detailed statistics for each investment period
  - Starting and ending balances
  - Total contributions/withdrawals for the period
  - Interest earned during the period

## 💡 Usage Examples

### Example 1: Long-Term Wealth Building

**Scenario**: Start with 10,000 PLN, add 500 PLN monthly for 20 years at 6% annual interest

1. Set Initial Amount: `10,000`
2. Set Interest Rate: `6`
3. Add Period:
   - Type: Monthly Contribution
   - Duration: `240` months
   - Amount: `500` PLN/month
4. View Results

**Expected Outcome**: Over 240,000 PLN from consistent investing!

### Example 2: Complete Financial Lifecycle

**Phase 1 - Early Career** (10 years):
- Type: Monthly Contribution
- Duration: 120 months
- Amount: 300 PLN/month

**Phase 2 - Mid Career** (15 years):
- Type: Monthly Contribution
- Duration: 180 months
- Amount: 800 PLN/month

**Phase 3 - Pre-Retirement Pause** (5 years):
- Type: Pause
- Duration: 60 months

**Phase 4 - Retirement** (20 years):
- Type: Monthly Withdrawal
- Duration: 240 months
- Amount: 2,000 PLN/month

This shows if your savings strategy can sustain your retirement goals!

### Example 3: Emergency Fund Break

**Scenario**: Pause contributions during financial hardship

1. Contribution period: 500 PLN/month for 36 months
2. Pause period: 12 months (difficult year)
3. Contribution period: 500 PLN/month for 60 months (back on track)

See how the pause affects your final balance while compound interest keeps working.

## 🏗️ Project Structure

```
investment-compound-calculator/
├── public/
│   └── index.html                 # HTML template
├── src/
│   ├── components/
│   │   ├── Calculator.tsx          # Main calculator with inputs
│   │   ├── InvestmentChart.tsx     # Interactive Chart.js component
│   │   ├── PeriodCard.tsx          # Single period configuration
│   │   └── ResultsSummary.tsx      # Results display with breakdown
│   ├── styles/
│   │   ├── global.css              # Global styles
│   │   ├── App.css                 # App component styles
│   │   ├── Calculator.css          # Calculator styles
│   │   └── Chart.css               # Chart styles
│   ├── types/
│   │   └── index.ts                # TypeScript type definitions
│   ├── utils/
│   │   └── calculations.ts         # Calculation logic
│   ├── App.tsx                     # Root component
│   └── index.tsx                   # Application entry point
├── .gitignore                      # Git ignore rules
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── webpack.config.js               # Webpack bundler config
├── index.html                      # Standalone HTML version
├── styles.css                      # Standalone CSS version
├── calculator.js                   # Standalone JS version
└── README.md                       # This file
```

## 🛠️ Technology Stack

- **React 18.2** - UI library with hooks
- **TypeScript 5.1** - Type-safe JavaScript
- **Chart.js 4.4** - Interactive data visualization
- **Webpack 5** - Module bundler and dev server
- **CSS3** - Modern styling with gradients and animations
- **HTML5** - Semantic markup

## 🔧 Development

### Available Scripts

- `npm start` - Start development server with hot reloading on port 3000
- `npm run build` - Create optimized production build in `dist/` folder
- `npm run type-check` - Run TypeScript compiler type checking

### Code Organization

- **Components**: Reusable React components with TypeScript
- **Types**: Centralized TypeScript interfaces and type definitions
- **Utils**: Pure functions for calculations and formatting
- **Styles**: Modular CSS with component-specific styling

### Key Implementation Details

1. **Real-time Calculations**: Uses React's `useEffect` hook to recalculate when inputs change
2. **Interactive Chart**: Chart.js with custom onClick handlers for point selection and highlighting
3. **Type Safety**: Full TypeScript implementation with interfaces for all data structures
4. **Responsive Design**: CSS Grid and Flexbox for adaptive layouts
5. **Optimized Builds**: Webpack with code splitting and content-based hashing for caching

## 🎨 Customization

### Change Currency
Edit the `formatCurrency` function in `src/utils/calculations.ts`:
```typescript
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`; // Change PLN to your currency
};
```

### Adjust Colors
Modify colors in `src/styles/global.css` and component CSS files:
```css
/* Example: Change primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Add Features
Potential enhancements:
- Export results to PDF or CSV
- Save/load investment plans to localStorage
- Compare multiple scenarios side-by-side
- Add inflation adjustment calculations
- Include tax impact estimations
- Add investment goal tracking

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - free to use for personal or commercial purposes.

## 👤 Author

**JFTech**

- GitHub: [@WavyWare](https://github.com/WavyWare)
- Repository: [investment-compound-calculator](https://github.com/WavyWare/investment-compound-calculator)

## 📞 Support

If you have questions or encounter issues:

1. Check the [Usage Examples](#-usage-examples) section
2. Review existing [Issues](https://github.com/WavyWare/investment-compound-calculator/issues)
3. Open a new issue with details about your problem

## ⚠️ Disclaimer

This calculator is for educational and planning purposes only. Actual investment returns may vary significantly due to:
- Market conditions and volatility
- Fees and expenses
- Taxes
- Economic factors
- Investment risk

Always consult with a qualified financial advisor before making investment decisions.

## 🌟 Acknowledgments

- Built with modern React and TypeScript
- Chart visualization powered by Chart.js
- Inspired by the need for flexible, transparent investment planning tools
- Thanks to the open-source community

---

**Made with ❤️ by JFTech | Happy Investing! 📈💰**
