import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { NextAuthProvider } from './providers'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MML Competition Form',
  description: 'MML Roblox Game Competition Application Form',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
