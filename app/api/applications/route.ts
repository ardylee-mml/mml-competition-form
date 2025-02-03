import { NextResponse } from 'next/server';
import { loadApplications } from '@/lib/storage';

export async function GET() {
  try {
    const applications = await loadApplications();
    return NextResponse.json({ applications });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to load applications' },
      { status: 500 }
    );
  }
}