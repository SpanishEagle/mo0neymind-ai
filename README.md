# MoneyMind AI

### Your Smart Personal Finance Assistant

**MoneyMind AI** is a web application designed to help people understand, organize, and manage their personal finances through an intuitive dashboard, interactive financial guidance, and educational investment tools.

Our mission is simple: **make financial education more accessible, practical, and understandable for everyone.**

**[Try MoneyMind AI Live](https://mo0neymind-ai.vozius8.workers.dev)**

---

## Features

### Financial Dashboard
- Overview of income, expenses, and available balance.
- Transaction management and expense categorization.
- Interactive financial statistics and charts.
- Clear visualization of spending habits.

### Savings Management
- Create and track personalized savings goals.
- Monitor progress toward financial objectives.
- Understand how regular saving contributes to long-term financial stability.

### Household Financial Planning
- Manage salaries, recurring bills, and everyday expenses.
- Analyze monthly budgets and cash flow.
- Explore the **50/30/20 budgeting rule**.
- Identify potential budget imbalances.
- Receive practical, context-based financial suggestions.

### Financial Assistant
MoneyMind AI includes an interactive, rule-based financial assistant designed to help users learn about:

- Personal budgeting and saving strategies.
- Income and expense management.
- Financial planning and emergency funds.
- Stocks, ETFs, and investment funds.
- Dividends, inflation, and financial risk.
- Stock market terminology and investment concepts.

The assistant provides educational explanations and calculations without requiring a paid external AI API.

### Stock Market Explorer
- Interactive charts powered by TradingView.
- Explore companies and major stock market indices.
- Search for supported market symbols.
- Save favorite companies to a watchlist.
- Learn about market movements and financial indicators.

**Note:** Market data is provided by third-party services and may be delayed.

### Investment Simulator
- Explore hypothetical investment scenarios.
- Compare educational fund examples.
- Simulate recurring contributions and compound growth.
- Visualize portfolio allocations.
- Learn about diversification, volatility, and financial risk.

**All investment operations are simulations. No real investments are executed.**

### User Accounts
- Email and password authentication.
- Cloud-based financial data storage using Supabase.
- Personalized user experience.
- Account management and password updates.

### Multilingual Support
MoneyMind AI supports:

- Spanish
- English

---

## Technologies Used

| Technology | Purpose |
|---|---|
| React | Frontend development |
| Vite | Development environment and production builds |
| JavaScript | Application logic |
| CSS | User interface and responsive styling |
| Recharts | Interactive financial charts |
| Lucide React | Icons |
| Supabase | Authentication and cloud database |
| TradingView | Stock market charts |
| GitHub | Version control |
| Cloudflare Workers | Web hosting and deployment |

---

## What Makes MoneyMind AI Different?

Traditional budgeting spreadsheets can calculate percentages and totals, but they often require users to interpret the results themselves.

MoneyMind AI aims to go further by combining financial calculations with contextual educational guidance.

For example, if a user's essential monthly expenses are unusually high compared with their income, the application can identify that imbalance and suggest areas to review.

Rather than simply displaying financial information, MoneyMind AI helps users understand **what the numbers mean** and how they can improve their financial planning.

---

## How It Works

1. **Create an account:** Register using an email address and password.
2. **Add financial information:** Record income, expenses, recurring bills, and savings goals.
3. **Explore your finances:** Use interactive dashboards and statistics to understand your financial situation.
4. **Ask the assistant:** Receive educational explanations and contextual financial guidance.
5. **Learn about investing:** Explore stock market charts and simulate investment scenarios.

---

## Installation

To run MoneyMind AI locally:

### 1. Clone the repository

```bash
git clone https://github.com/SpanishEagle/mo0neymind-ai.git
```

### 2. Enter the project directory

```bash
cd mo0neymind-ai
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the project's root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

A Supabase project with the required authentication and database configuration is needed for account features.

Never place Supabase secret or service-role keys in frontend environment variables.

### 5. Start the development server

```bash
npm run dev
```

Open the local address displayed in your terminal.

---

## Privacy and Security

MoneyMind AI uses Supabase for account authentication and cloud data storage.

The application is designed to keep financial information associated with individual user accounts. Database access must be protected through appropriate Row Level Security (RLS) policies.

Financial information should be treated carefully, and users should avoid entering sensitive banking credentials.

---

## Our Mission

Financial knowledge is an essential life skill, yet many young people and first-time workers have limited experience managing income, expenses, and investments.

MoneyMind AI was created to make personal finance easier to understand through technology, interactive learning, and practical tools.

We believe that **financial education should be accessible to everyone.**

---

## Project Authors

**Iñigo Unamunzaga & Ángel Cosgaya**

Developed as a student innovation project combining technology, financial education, and artificial intelligence concepts.

---

## Disclaimer

MoneyMind AI is an educational personal finance application.

It does not provide regulated financial advice, execute real stock market trades, or guarantee investment returns.

Stock market data may be delayed, and hypothetical performance does not represent future results.

---

### MoneyMind AI — Understand Your Money. Build Your Future.
