import { NextResponse } from 'next/server';

const FLASK_API_URL = process.env.FLASK_API_URL || 'http://localhost:8080';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Proxy to Flask auth endpoints
    const endpoint = body.endpoint || 'login'; // login, register, me
    const url = `${FLASK_API_URL}/auth/${endpoint}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Auth proxy error:', error);
    return NextResponse.json({
      user: null,
      token: null,
      message: 'Backend unavailable'
    }, { status: 503 });
  }
}