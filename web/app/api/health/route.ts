import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json(JSON.stringify({ status: 'ok' }));
}