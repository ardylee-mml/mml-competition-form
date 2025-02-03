import { NextResponse } from "next/server"
import { saveApplication, isEmailRegistered, isDiscordIdRegistered } from "@/lib/storage"
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    // Log environment variables (redacted for security)
    console.log('Redis URL exists:', !!process.env.KV_REST_API_URL);
    console.log('Redis Token exists:', !!process.env.KV_REST_API_TOKEN);

    const data = await request.json()
    console.log('Received data:', data);

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
    console.log('Saved application:', savedApplication);
    
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
    // Log the full error
    console.error('Detailed error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to submit application'
      },
      { status: 500 }
    );
  }
}

