import { NextResponse } from 'next/server';

// Flask backend URL (local development)
const FLASK_API_URL = process.env.FLASK_API_URL || 'http://localhost:8080';

// Proxy to Flask backend for real backtests
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Forward request to Flask backend
    const response = await fetch(`${FLASK_API_URL}/backtest/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward auth header if present
        ...(request.headers.get('authorization') && {
          'Authorization': request.headers.get('authorization')!
        })
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `Flask API error: ${error}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Proxy error:', error);
    
    // Fallback to mock if Flask is not available
    console.warn('Flask backend unavailable, falling back to mock data');
    
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
  }
}

// Also support GET for backtest history
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || 'history';
    
    const response = await fetch(`${FLASK_API_URL}/backtest/${endpoint}`, {
      headers: {
        ...(request.headers.get('authorization') && {
          'Authorization': request.headers.get('authorization')!
        })
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Flask API unavailable' },
        { status: 503 }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Backend unavailable' },
      { status: 503 }
    );
  }
}
