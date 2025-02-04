import { NextResponse } from "next/server"
import { saveApplication, isDiscordIdRegistered } from "@/lib/storage"
import { Resend } from 'resend'
import { Redis } from '@upstash/redis'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const formData = await request.json()
    
    const savedApplication = await saveApplication({
      teamName: formData.teamName,
      discordId: formData.discordId,
      teamMembers: formData.teamMembers,
      teamExperience: formData.teamExperience,
      previousProjects: formData.previousProjects,
      teamExperienceDescription: formData.teamExperienceDescription,
      gameGenre: formData.gameGenre,
      gameTitle: formData.gameTitle,
      gameConcept: formData.gameConcept,
      whyWin: formData.whyWin,
      whyPlayersLike: formData.whyPlayersLike,
      promotionPlan: formData.promotionPlan,
      monetizationPlan: formData.monetizationPlan,
      projectedDAU: Number(formData.projectedDAU),
      dayOneRetention: Number(formData.dayOneRetention),
      developmentTimeline: formData.developmentTimeline,
      resourcesTools: formData.resourcesTools,
      acknowledgment: Boolean(formData.acknowledgment)
    })
    
    // Send confirmation email
    await resend.emails.send({
      from: 'MML Competition <noreply@metamindinglab.com>',
      to: formData.email,
      subject: 'Application Received',
      html: `<p>Dear ${formData.name},</p>
             <p>We have received your application.</p>
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

