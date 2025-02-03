import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    hasAdminUsername: !!process.env.ADMIN_USERNAME,
    hasAdminPassword: !!process.env.ADMIN_PASSWORD,
    // Don't expose actual values in production!
    adminUsername: process.env.NODE_ENV === 'development' ? process.env.ADMIN_USERNAME : undefined,
    adminPassword: process.env.NODE_ENV === 'development' ? process.env.ADMIN_PASSWORD : undefined
  })
} 