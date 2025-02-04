import { NextResponse } from 'next/server';
import { getApplications } from '@/lib/storage';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Basic auth check
    const authCookie = cookies().get('next-auth.session-token');
    if (!authCookie) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get applications with default pagination
    const result = await getApplications();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}