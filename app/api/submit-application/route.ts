import { NextResponse } from "next/server"
import { saveApplication, isEmailRegistered, isDiscordIdRegistered } from "@/lib/storage"
import { Resend } from 'resend'
import { Redis } from '@upstash/redis'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    // Test Redis connection first
    const redis = new Redis({
      url: 'https://proper-cheetah-10029.upstash.io',
      token: 'ASctAAIjcDFlZDUzOWE4YTQ1ZmM0NWI2OWU1OTMxMTcwNDA5OTgyMnAxMA',
    })

    // Log connection test
    console.log('Testing Redis connection...')
    await redis.set('test-key', 'test-value')
    const testValue = await redis.get('test-key')
    console.log('Redis test result:', testValue)

    // Log environment variables (redacted for security)
    console.log('Redis URL exists:', !!process.env.KV_REST_API_URL)
    console.log('Redis Token exists:', !!process.env.KV_REST_API_TOKEN)

    const data = await request.json()
    console.log('Received data:', data)

    // Check for existing email and discord ID
    const emailExists = await isEmailRegistered(data.email)
    if (emailExists) {
      return NextResponse.json(
        { success: false, error: 'email_exists' },
        { status: 400 }
      )
    }

    const discordExists = await isDiscordIdRegistered(data.discordId)
    if (discordExists) {
      return NextResponse.json(
        { success: false, error: 'discord_exists' },
        { status: 400 }
      )
    }

    const savedApplication = await saveApplication(data)
    console.log('Saved application:', savedApplication)
    
    // Send confirmation email
    await resend.emails.send({
      from: 'info@metamindinglab.com',
      to: data.email,
      subject: 'MML Competition Application Confirmation',
      html: `
        <h1>Application Received</h1>
        <p>Thank you for your application!</p>
        <p>Your application ID is: ${savedApplication.id}</p>
        <p>We will review your application and get back to you soon.</p>
      `
    })

    return NextResponse.json({ 
      success: true, 
      applicationId: savedApplication.id 
    })
  } catch (error) {
    // Log detailed error
    console.error('Submission error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to submit application',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

