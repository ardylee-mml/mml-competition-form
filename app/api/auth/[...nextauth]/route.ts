import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ user: null, expires: null });
}

export async function POST() {
  return NextResponse.json({ user: null, expires: null });
} 