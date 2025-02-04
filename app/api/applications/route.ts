import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function GET() {
  try {
    // Get all keys matching our pattern
    const keys = await redis.keys('application:*');
    console.log('Found keys:', keys);

    // Get all applications
    const applications = await Promise.all(
      keys.map(async (key) => {
        const data = await redis.get(key);
        return data;
      })
    );

    console.log('Found applications:', applications);

    return NextResponse.json({
      data: applications.filter(Boolean),
      total: applications.length,
      page: 1,
      pageSize: 100
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications', details: String(error) },
      { status: 500 }
    );
  }
}