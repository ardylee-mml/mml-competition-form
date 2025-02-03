import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log('Middleware: Checking admin access');
    console.log('Has ADMIN_USERNAME:', !!process.env.ADMIN_USERNAME);
    console.log('Has ADMIN_PASSWORD:', !!process.env.ADMIN_PASSWORD);
    
    const authHeader = request.headers.get('authorization')
    
    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
      console.error('Admin credentials not configured');
      return new NextResponse('Server configuration error', { status: 500 });
    }

    if (!authHeader) {
      console.log('No auth header provided');
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Access Required"'
        },
      })
    }

    try {
      const base64Credentials = authHeader.split(' ')[1]
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
      const [username, password] = credentials.split(':')
      
      console.log('Auth attempt - Username matches:', username === process.env.ADMIN_USERNAME);
      console.log('Auth attempt - Password matches:', password === process.env.ADMIN_PASSWORD);
      
      if (username === process.env.ADMIN_USERNAME && 
          password === process.env.ADMIN_PASSWORD) {
        return NextResponse.next()
      }
    } catch (error) {
      console.error('Auth error:', error)
    }

    return new NextResponse('Invalid credentials', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Access Required"'
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
} 