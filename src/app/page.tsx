'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BacktestResult {
  totalReturn: number;
  annualizedReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  totalTrades: number;
  equityCurve: { date: string; equity: number }[];
  trades: { entryDate: string; exitDate: string; pnl: number; pnlPct: number }[];
}

export default function Home() {
  const [ticker, setTicker] = useState('SPY');
  const [strategy, setStrategy] = useState('dual_ma');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BacktestResult | null>(null);

  const runBacktest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/backtest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker, strategy }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Backtest failed:', error);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🎯 StrategyBacktest</h1>
          <p className="text-gray-400">Backtest trading strategies in seconds</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <label className="block text-sm font-medium mb-2">Ticker Symbol</label>
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              placeholder="e.g., SPY"
            />
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <label className="block text-sm font-medium mb-2">Strategy</label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="dual_ma">Dual MA Crossover</option>
              <option value="rsi">RSI Mean Reversion</option>
              <option value="breakout">Momentum Breakout</option>
            </select>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg flex items-end">
            <button
              onClick={runBacktest}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded transition"
            >
              {loading ? 'Running...' : '🚀 Run Backtest'}
            </button>
          </div>
        </div>

        {result && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <MetricCard
                label="Total Return"
                value={`${result.totalReturn.toFixed(2)}%`}
                color={result.totalReturn >= 0 ? 'green' : 'red'}
              />
              <MetricCard
                label="Annualized Return"
                value={`${result.annualizedReturn.toFixed(2)}%`}
                color={result.annualizedReturn >= 0 ? 'green' : 'red'}
              />
              <MetricCard label="Sharpe Ratio" value={result.sharpeRatio.toFixed(2)} />
              <MetricCard
                label="Max Drawdown"
                value={`${result.maxDrawdown.toFixed(2)}%`}
                color="red"
              />
              <MetricCard label="Win Rate" value={`${result.winRate.toFixed(1)}%`} />
              <MetricCard label="Total Trades" value={result.totalTrades.toString()} />
            </div>

            <div className="bg-gray-800 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-bold mb-4">Equity Curve</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={result.equityCurve}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" tick={{ fill: '#9CA3AF' }} />
                  <YAxis tick={{ fill: '#9CA3AF' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                    labelStyle={{ color: '#9CA3AF' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="equity"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Trade History</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-700">
                      <th className="pb-2">Entry Date</th>
                      <th className="pb-2">Exit Date</th>
                      <th className="pb-2">P&L</th>
                      <th className="pb-2">Return</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.trades.map((trade, i) => (
                      <tr key={i} className="border-b border-gray-700">
                        <td className="py-2">{trade.entryDate}</td>
                        <td className="py-2">{trade.exitDate}</td>
                        <td className={`py-2 ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ${trade.pnl.toFixed(2)}
                        </td>
                        <td className={`py-2 ${trade.pnlPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {trade.pnlPct.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  color = 'blue',
}: {
  label: string;
  value: string;
  color?: 'blue' | 'green' | 'red';
}) {
  const colorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    red: 'text-red-400',
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</p>
    </div>
  );
}
