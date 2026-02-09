# 💰 Investment Compound Calculator

A modern, feature-rich web-based investment calculator built with **React**, **TypeScript**, and **Webpack**. Calculate your investment growth over time with support for monthly contributions, pause periods, and withdrawals using compound interest calculations.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1+-blue.svg)
![React](https://img.shields.io/badge/React-18.2+-61dafb.svg)

## ✨ Features

### 📊 Flexible Investment Planning
- **Monthly Contributions**: Add regular investments during specified periods
- **Pause Periods**: Let your investments grow without new contributions
- **Withdrawal Periods**: Plan for regular withdrawals while remaining balance continues to grow
- **Multiple Periods**: Chain different period types to create complex investment scenarios

### 🧮 Accurate Calculations
- Compound interest calculations with configurable annual interest rate
- Monthly compounding frequency
- Detailed month-by-month breakdown
- Complete financial summary with totals

### 🎨 Clean User Interface
- Intuitive, modern design
- Responsive layout (mobile-friendly)
- Real-time calculations
- Easy period management (add/remove)
- Optional monthly breakdown table

### 💻 Technical Features
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
- **Annual Interest Rate**: Set expected annual return percentage (e.g., 5%)

### 2. Add Investment Periods

Create your investment timeline by adding different period types:

#### 📈 Monthly Contribution Period
- Regular monthly investments
- Example: Contribute 500 PLN/month for 60 months (5 years)

#### ⏸️ Pause Period
- No new contributions, but existing balance continues to grow
- Example: Pause for 12 months while traveling

#### 📉 Monthly Withdrawal Period
- Regular withdrawals from your investment
- Remaining balance continues to earn interest
- Example: Withdraw 1,000 PLN/month for 120 months (retirement)

Each period can have:
- **Duration**: Number of months
- **Amount**: Monthly contribution or withdrawal (not applicable for pause)
- **Label**: Optional description for easy reference

### 3. Calculate Results

Click **"Calculate Investment Growth"** to see:

- **Final Balance**: Total value at the end
- **Total Contributions**: All money you invested
- **Total Withdrawals**: All money you withdrew
- **Interest Earned**: Profit from compound interest
- **Net Profit**: Total gain (interest earned minus net contributions)
- **Total Duration**: Investment timeframe in months and years

### 4. View Monthly Breakdown

Toggle the **"Show Monthly Breakdown"** button to see detailed month-by-month data:
- Balance after each month
- Cumulative contributions and withdrawals
- Interest earned over time
- Period labels for context

## 💡 Usage Examples

### Example 1: Simple Long-Term Investment

**Scenario**: Start with 10,000 PLN, add 500 PLN monthly for 20 years at 6% annual interest

1. Set Initial Amount: `10,000`
2. Set Interest Rate: `6`
3. Add Period:
   - Type: Monthly Contribution
   - Duration: `240` months
   - Amount: `500` PLN/month
   - Label: "Long-term growth"
4. Click Calculate

**Result**: See how your investment grows to over 230,000 PLN!

### Example 2: Career Planning (Multi-Phase)

**Scenario**: Model a complete financial lifecycle

**Phase 1 - Early Career** (10 years):
- Type: Monthly Contribution
- Duration: 120 months
- Amount: 300 PLN/month
- Label: "Early career savings"

**Phase 2 - Mid Career** (15 years):
- Type: Monthly Contribution
- Duration: 180 months
- Amount: 800 PLN/month
- Label: "Higher income period"

**Phase 3 - Pre-Retirement Pause** (5 years):
- Type: Pause
- Duration: 60 months
- Label: "Let it grow"

**Phase 4 - Retirement** (20 years):
- Type: Monthly Withdrawal
- Duration: 240 months
- Amount: 2,000 PLN/month
- Label: "Retirement income"

This shows if your savings strategy can sustain your retirement!

### Example 3: Emergency Fund Break

**Scenario**: Pause contributions during financial hardship

1. Contribution period: 500 PLN/month for 36 months
2. Pause period: 12 months (difficult year)
3. Contribution period: 500 PLN/month for 60 months (back on track)

See how the pause affects your final balance.

## 🏗️ Project Structure

```
investment-compound-calculator/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   └── Calculator.tsx      # Main calculator component
│   ├── types/
│   │   └── investment.ts       # TypeScript interfaces and types
│   ├── utils/
│   │   └── calculations.ts     # Calculation logic and utilities
│   ├── styles/
│   │   └── main.css            # Global styles
│   ├── App.tsx                 # Root application component
│   └── index.tsx               # Application entry point
├── .gitignore                  # Git ignore rules
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── webpack.config.js           # Webpack bundler configuration
└── README.md                   # This file
```

## 🛠️ Technology Stack

- **React 18.2** - UI library
- **TypeScript 5.1** - Type-safe JavaScript
- **Webpack 5** - Module bundler
- **CSS3** - Styling with modern features
- **HTML5** - Semantic markup

## 🔧 Development

### Available Scripts

- `npm start` - Start development server with hot reloading
- `npm run build` - Create production build
- `npm run type-check` - Run TypeScript compiler checks

### Code Organization

- **Components**: Reusable React components with TypeScript
- **Types**: Centralized TypeScript interfaces and enums
- **Utils**: Pure functions for calculations and formatting
- **Styles**: Global CSS with responsive design

### Key Files

- **Calculator.tsx**: Main UI component with form handling and state management
- **calculations.ts**: Core compound interest calculation algorithm
- **investment.ts**: TypeScript type definitions for type safety

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the file for details.

## 👤 Author

**JFTech**

- GitHub: [@WavyWare](https://github.com/WavyWare)

## 🙏 Acknowledgments

- Inspired by the need for flexible investment planning tools
- Built with modern web technologies for optimal performance
- Designed with user experience as top priority

## 📞 Support

If you have any questions or run into issues:

1. Check the [Usage Examples](#-usage-examples) section
2. Review existing [Issues](https://github.com/WavyWare/investment-compound-calculator/issues)
3. Open a new issue with details about your problem

## 🔮 Future Enhancements

Potential features for future versions:

- 📊 Interactive charts and graphs
- 💾 Save/load investment scenarios
- 📤 Export results to PDF or Excel
- 🌍 Multi-currency support
- 📱 Progressive Web App (PWA) capabilities
- 🎯 Investment goal tracking
- 📈 Historical performance comparison

---

**Happy Investing! 📈💰**

*Remember: This calculator is for educational and planning purposes. Always consult with a financial advisor for professional investment advice.*
