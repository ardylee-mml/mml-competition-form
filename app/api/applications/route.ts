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

    // Ensure request.url is a valid URL
    let url;
    try {
      url = new URL(request.url);
    } catch {
      // If request.url is relative, construct full URL
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      url = new URL(request.url, baseUrl);
    }

    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');

    const result = await getApplications(page, pageSize);
    console.log('Applications fetched:', result); // Debug log
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}