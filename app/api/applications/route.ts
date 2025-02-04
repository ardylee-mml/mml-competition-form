import { NextResponse } from 'next/server';
import { getApplications } from '@/lib/storage';

export async function GET() {
  try {
    const result = await getApplications();
    return NextResponse.json({ applications: result });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}