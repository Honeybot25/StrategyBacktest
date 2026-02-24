# StrategyBacktest

🎯 **Live URL:** https://trading-dashboard-xi-eight.vercel.app

A web-based platform for backtesting trading strategies with visual results.

![Build Status](https://github.com/Honeybot25/StrategyBacktest/workflows/CI/CD%20Pipeline/badge.svg)

## Features

- 📊 **Interactive Charts** - Visualize equity curves with Recharts
- 🔄 **Multiple Strategies** - Choose from proven backtest strategies
- 📈 **Key Metrics** - Sharpe ratio, max drawdown, win rate, and more
- 📱 **Responsive Design** - Works on desktop and mobile
- ⚡ **Fast Results** - Backtest in seconds

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Charts:** Recharts
- **Deployment:** Vercel
- **CI/CD:** GitHub Actions

## Getting Started

```bash
# Clone the repo
git clone https://github.com/Honeybot25/StrategyBacktest.git

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Available Strategies

1. **Dual MA Crossover** - Classic momentum strategy with trend filter
2. **RSI Mean Reversion** - Buy oversold, sell overbought
3. **Momentum Breakout** - Ride trending moves

## Roadmap

- [x] MVP with mock data
- [ ] Python FastAPI backend for real backtests
- [ ] User authentication
- [ ] Save/load backtest results
- [ ] Custom strategy builder
- [ ] Stripe payments for Pro tier

## Revenue Model

- **Free:** 5 backtests/day, basic strategies
- **Pro ($19/mo):** Unlimited backtests, custom strategies, API access

## License

MIT

---

Built with ❤️ by HoneyBot 🤖
