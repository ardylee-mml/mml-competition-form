import { NextResponse } from "next/server"
import { saveApplication, isEmailRegistered, isDiscordIdRegistered } from "@/lib/storage"
import { Resend } from 'resend'
import { Redis } from '@upstash/redis'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    // Test Redis connection with environment variables
    const redis = new Redis({
      url: process.env.KV_REST_API_URL || 'https://proper-cheetah-10029.upstash.io',
      token: process.env.KV_REST_API_TOKEN || 'ASctAAIjcDFlZDUzOWE4YTQ1ZmM0NWI2OWU1OTMxMTcwNDA5OTgyMnAxMA',
    })

    // Log connection attempt
    console.log('Connecting to Redis...')
    console.log('Using URL:', process.env.KV_REST_API_URL ? 'From env' : 'From fallback')

    // Test connection
    try {
      await redis.set('test-connection', 'working')
      const test = await redis.get('test-connection')
      console.log('Redis connection test:', test)
    } catch (redisError) {
      console.error('Redis connection error:', redisError)
      throw new Error('Redis connection failed')
    }

    // Get form data and ensure it's properly formatted
    const formData = await request.json()
    console.log('Raw form data:', formData)

    // Format the data for storage
    const applicationData = {
      name: String(formData.name || ''),
      email: String(formData.email || ''),
      phone: String(formData.phone || ''),
      address: String(formData.address || ''),
      education: String(formData.education || ''),
      experience: String(formData.experience || ''),
      skills: String(formData.skills || '')
    }

    // Check for existing email and discord ID
    const emailExists = await isEmailRegistered(applicationData.email)
    if (emailExists) {
      return NextResponse.json(
        { success: false, error: 'email_exists' },
        { status: 400 }
      )
    }

    const discordExists = await isDiscordIdRegistered(formData.discordId)
    if (discordExists) {
      return NextResponse.json(
        { success: false, error: 'discord_exists' },
        { status: 400 }
      )
    }

    // Save application
    const savedApplication = await saveApplication(applicationData)
    console.log('Application saved:', savedApplication)
    
    // Send confirmation email
    await resend.emails.send({
      from: 'info@metamindinglab.com',
      to: applicationData.email,
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
    console.error('Full error details:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

