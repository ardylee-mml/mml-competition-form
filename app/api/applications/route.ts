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

    // Get page and pageSize from request headers instead of URL
    const page = 1;  // Default to first page
    const pageSize = 10;  // Default page size

    const result = await getApplications(page, pageSize);
    console.log('Applications fetched:', result);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}