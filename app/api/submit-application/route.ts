import { NextResponse } from "next/server"
import { saveApplication, isEmailRegistered, isDiscordIdRegistered } from "@/lib/storage"
import { Resend } from 'resend'
import { Redis } from '@upstash/redis'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const formData = await request.json()
    
    const savedApplication = await saveApplication({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      education: formData.education,
      experience: formData.experience,
      skills: formData.skills,
      discordId: formData.discordId
    })
    
    return NextResponse.json({ success: true, id: savedApplication.id })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}

