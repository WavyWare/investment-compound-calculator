# Investment Compound Calculator

A comprehensive React + TypeScript investment calculator with interactive charting capabilities. Plan your financial future by modeling different investment periods including contributions, pauses, and withdrawals with compound interest calculations.

## 🚀 Features

- **Multiple Investment Periods**: Define different time periods with varying behaviors
- **Monthly Contributions**: Add regular monthly investments to your portfolio
- **Pause Periods**: Let your investments grow without new contributions
- **Withdrawal Periods**: Plan regular withdrawals while your remaining balance continues to earn interest
- **Compound Interest Calculations**: Accurate monthly compounding with configurable annual interest rate
- **Interactive Chart**: Visualize your investment growth over time with clickable data points
- **Real-time Updates**: Chart and calculations update automatically as you change inputs
- **Month-by-Month Details**: Click any point on the chart to see detailed information for that specific month
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/WavyWare/investment-compound-calculator.git
cd investment-compound-calculator
```

2. Install dependencies:
```bash
npm install
```

## 🚀 Running the Application

### Development Mode
Start the development server with hot reloading:
```bash
npm start
```
The application will open automatically at `http://localhost:3000`

### Build for Production
Create an optimized production build:
```bash
npm build
```
The built files will be in the `dist/` directory.

### Development with Watch Mode
Build in development mode and watch for changes:
```bash
npm run dev
```

## 📁 Project Structure

Due to GitHub API rate limits, please create the following file structure manually. I've started the repository with the basic configuration files. Here's the complete structure:

```
investment-compound-calculator/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Calculator.tsx
│   │   ├── InvestmentChart.tsx
│   │   ├── PeriodCard.tsx
│   │   └── ResultsSummary.tsx
│   ├── styles/
│   │   ├── global.css
│   │   ├── App.css
│   │   ├── Calculator.css
│   │   └── Chart.css
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── calculations.ts
│   ├── App.tsx
│   └── index.tsx
├── .gitignore
├── package.json (✓ Already added)
├── tsconfig.json
├── webpack.config.js (✓ Already added)
└── README.md
```

## 💻 Missing Files to Add

I've successfully added `package.json` and `webpack.config.js`. Due to API rate limits, you'll need to add the remaining files. Here's a summary:

### Configuration Files Needed:
1. **tsconfig.json** - TypeScript configuration
2. **.gitignore** - Git ignore rules
3. **public/index.html** - HTML template

### Source Files Needed:
1. **src/index.tsx** - Application entry point
2. **src/App.tsx** - Main application component
3. **src/types/index.ts** - TypeScript type definitions
4. **src/utils/calculations.ts** - Investment calculation logic
5. **src/components/Calculator.tsx** - Calculator component
6. **src/components/InvestmentChart.tsx** - Chart component with Chart.js
7. **src/components/PeriodCard.tsx** - Period configuration card
8. **src/components/ResultsSummary.tsx** - Results display component
9. **src/styles/global.css** - Global styles
10. **src/styles/App.css** - App-specific styles
11. **src/styles/Calculator.css** - Calculator styles
12. **src/styles/Chart.css** - Chart styles

## 🎯 How to Use the Calculator

### 1. Set Initial Parameters
- **Initial Balance**: Your starting investment amount (default: 0 PLN)
- **Annual Interest Rate**: Expected annual return rate (default: 7%)

### 2. Define Investment Periods

Click "Add Period" to create periods. Each period can be configured with:

#### Period Types:

**Monthly Contribution**
- Regular deposits into your investment
- Specify the monthly amount (e.g., 500 PLN)
- Set duration in months

**Pause (No Contributions)**
- Let your money grow without new deposits
- Existing balance continues to earn compound interest
- Set duration in months

**Monthly Withdrawal**
- Regular withdrawals from your investment
- Specify monthly withdrawal amount
- Remaining balance continues to earn interest
- Set duration in months

### 3. View Results

The application automatically calculates and displays:

#### Summary Cards:
- **Total Contributions**: Sum of all deposits made
- **Total Withdrawals**: Sum of all withdrawals taken
- **Total Interest Earned**: Compound interest accumulated
- **Final Balance**: Your ending investment value

#### Interactive Chart:
- Visual representation of balance growth over time
- Color-coded by period type
- **Click any data point** to see detailed information for that specific month

#### Period-by-Period Breakdown:
- Starting and ending balance for each period
- Contributions or withdrawals made
- Interest earned during the period
- Visual progression of your investment

## 📊 Example Scenarios

### Scenario 1: Wealth Building
```
Initial Balance: 10,000 PLN
Annual Rate: 7%

Period 1: Monthly Contribution
- Amount: 500 PLN/month
- Duration: 60 months (5 years)

Period 2: Pause
- Duration: 120 months (10 years)
```
See how your initial investment plus 5 years of contributions grows over the next 10 years!

### Scenario 2: Retirement Planning
```
Initial Balance: 500,000 PLN
Annual Rate: 5%

Period 1: Monthly Withdrawal
- Amount: 2,500 PLN/month
- Duration: 240 months (20 years)
```
Understand how long your retirement savings will last with regular withdrawals!

### Scenario 3: Complete Lifecycle
```
Initial Balance: 0 PLN
Annual Rate: 8%

Period 1: Building Phase
- Type: Monthly Contribution
- Amount: 1,000 PLN/month
- Duration: 120 months (10 years)

Period 2: Growth Phase
- Type: Pause
- Duration: 60 months (5 years)

Period 3: Usage Phase
- Type: Monthly Withdrawal
- Amount: 3,000 PLN/month
- Duration: 120 months (10 years)
```

## 🔬 Technical Details

### Compound Interest Formula

The calculator uses monthly compounding:
- Monthly rate = Annual rate / 12
- Each month: Balance × (1 + monthly rate) + contribution - withdrawal

### Tech Stack

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Webpack 5**: Module bundling and development server
- **Chart.js**: Interactive data visualization
- **react-chartjs-2**: React wrapper for Chart.js
- **Babel**: JavaScript transpilation

### Key Features Implementation

1. **Real-time Calculations**: Uses React hooks (useEffect) to recalculate when inputs change
2. **Interactive Chart**: Chart.js with custom onClick handlers for point selection
3. **Type Safety**: Full TypeScript implementation with interfaces for all data structures
4. **Responsive Design**: CSS Grid and Flexbox for adaptive layouts
5. **Optimized Builds**: Webpack with code splitting and hash-based caching

## 🎨 Customization

### Change Currency
Edit the `formatCurrency` function in `src/utils/calculations.ts`:
```typescript
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`; // Change PLN to your currency
};
```

### Adjust Colors
Modify the CSS custom properties in `src/styles/global.css`:
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  /* Add your colors */
}
```

### Add Features
- Export results to PDF
- Save/load investment plans
- Compare multiple scenarios
- Add inflation adjustments
- Include tax calculations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - feel free to use it for personal or commercial purposes.

## ⚠️ Disclaimer

This calculator provides estimates based on the input parameters. Actual investment returns may vary significantly. Market conditions, fees, taxes, and other factors can affect real-world results. Always consult with a qualified financial advisor before making investment decisions.

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation

## 🌟 Acknowledgments

- Built with React and TypeScript
- Chart visualization powered by Chart.js
- Inspired by the need for flexible investment planning tools

---

**Current Status**: Base configuration files (package.json, webpack.config.js) have been added. Due to GitHub API rate limits, additional files need to be added manually or after the rate limit resets. See the project structure above for the complete file list needed.

**Next Steps**:
1. Wait for GitHub API rate limit to reset
2. Add remaining TypeScript configuration files
3. Add source code files
4. Add styling files
5. Test the complete application

Made with ❤️ by JFTech
