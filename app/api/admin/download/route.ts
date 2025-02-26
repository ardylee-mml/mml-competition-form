import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const convertToCSV = (data: any[]) => {
  if (data.length === 0) return '';
  
  // Get headers from the first object
  const headers = Object.keys(data[0]);
  
  // Create CSV header row
  const headerRow = headers.join(',');
  
  // Create CSV data rows
  const rows = data.map(obj => 
    headers.map(header => {
      let cell = obj[header];
      // Handle special characters and commas
      if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))) {
        cell = `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    }).join(',')
  );
  
  return [headerRow, ...rows].join('\n');
};

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get format from query parameter
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format');

    // Fetch all applications from database
    const applications = await prisma.application.findMany({
      select: {
        id: true,
        createdAt: true,
        name: true,
        email: true,
        age: true,
        country: true,
        robloxUsername: true,
        discordUsername: true,
        experience: true,
        portfolio: true,
        motivation: true,
        status: true,
      }
    });

    // Format dates and prepare data
    const formattedData = applications.map(app => ({
      ...app,
      createdAt: app.createdAt.toISOString(),
    }));

    if (format === 'csv') {
      const csv = convertToCSV(formattedData);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=applications.csv',
        },
      });
    } else if (format === 'json') {
      return new NextResponse(JSON.stringify(formattedData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename=applications.json',
        },
      });
    } else {
      return new NextResponse('Invalid format specified', { status: 400 });
    }
  } catch (error) {
    console.error('Download error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 