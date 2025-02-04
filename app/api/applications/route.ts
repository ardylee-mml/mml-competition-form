import { NextResponse } from 'next/server';
import { getApplications } from '@/lib/storage';
import { headers } from 'next/headers';

export async function GET() {
  try {
    // Check for session token in cookie header
    const headersList = headers();
    const cookie = headersList.get('cookie') || '';
    const hasSessionToken = cookie.includes('next-auth.session-token');
    
    if (!hasSessionToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

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