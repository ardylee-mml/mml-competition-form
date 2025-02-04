import { NextResponse } from "next/server"
import { saveApplication, isDiscordIdRegistered } from "@/lib/storage"
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const formData = await request.json()
    
    // Check if Discord ID is already registered
    if (await isDiscordIdRegistered(formData.discordId)) {
      return NextResponse.json(
        { success: false, error: 'discord_exists' },
        { status: 400 }
      )
    }

    const savedApplication = await saveApplication({
      // Basic Info
      teamName: formData.teamName,
      discordId: formData.discordId,
      
      // Team Info
      teamMembers: formData.teamMembers,
      teamExperience: formData.teamExperience,
      previousProjects: formData.previousProjects,
      teamExperienceDescription: formData.teamExperienceDescription,
      
      // Game Info
      gameGenre: formData.gameGenre,
      gameTitle: formData.gameTitle,
      gameConcept: formData.gameConcept,
      whyWin: formData.whyWin,
      whyPlayersLike: formData.whyPlayersLike,
      
      // Business Info
      promotionPlan: formData.promotionPlan,
      monetizationPlan: formData.monetizationPlan,
      projectedDAU: Number(formData.projectedDAU),
      dayOneRetention: Number(formData.dayOneRetention),
      
      // Development Info
      developmentTimeline: formData.developmentTimeline,
      resourcesTools: formData.resourcesTools,
      
      // Terms
      acknowledgment: Boolean(formData.acknowledgment)
    })
    
    // Send confirmation email
    await resend.emails.send({
      from: 'MML Competition <noreply@metamindinglab.com>',
      to: formData.email,
      subject: 'Application Received',
      html: `<p>Dear ${formData.teamName},</p>
             <p>We have received your game competition application.</p>
             <p>Application ID: ${savedApplication.id}</p>`
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

