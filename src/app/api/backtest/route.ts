import { NextResponse } from 'next/server';

// Simple in-memory backtest (will be replaced with Python API)
export async function POST(request: Request) {
  try {
    const { ticker, strategy } = await request.json();

    // Mock backtest results based on our earlier SPY test
    // In production, this calls the Python FastAPI backend
    const mockResult = {
      totalReturn: 68.67,
      annualizedReturn: 26.81,
      sharpeRatio: 0.65,
      maxDrawdown: -33.78,
      winRate: 100.0,
      totalTrades: 3,
      equityCurve: [
        { date: '2022-01-01', equity: 100000 },
        { date: '2022-06-01', equity: 95000 },
        { date: '2023-01-01', equity: 105000 },
        { date: '2023-06-01', equity: 110000 },
        { date: '2023-09-21', equity: 113806 },
        { date: '2024-01-01', equity: 115000 },
        { date: '2024-04-19', equity: 121780 },
        { date: '2024-12-31', equity: 168673 },
      ],
      trades: [
        { entryDate: '2022-10-15', exitDate: '2023-09-21', pnl: 3806.60, pnlPct: 7.6 },
        { entryDate: '2023-11-01', exitDate: '2024-04-19', pnl: 5780.96, pnlPct: 11.1 },
        { entryDate: '2024-07-15', exitDate: '2024-12-31', pnl: 4618.50, pnlPct: 8.5 },
      ],
    };

    return NextResponse.json(mockResult);
  } catch (error) {
    return NextResponse.json(
      { error: 'Backtest failed' },
      { status: 500 }
    );
  }
}
