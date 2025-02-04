import { NextResponse } from 'next/server';
import { getApplications } from '@/lib/storage';
import { auth } from '../../auth';

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get all applications with default pagination
    const result = await getApplications();
    
    // Log the request URL for debugging
    console.log('Request URL:', request.url);
    console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
    console.log('VERCEL_URL:', process.env.VERCEL_URL);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}