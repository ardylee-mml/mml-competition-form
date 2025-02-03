import { NextResponse } from "next/server"
import { saveApplication, isEmailRegistered, isDiscordIdRegistered } from "@/lib/storage"
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const data = await request.json()

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

    const savedApplication = await saveApplication({
      name: data.name,
      email: data.email,
      discordId: data.discordId,
      teamName: data.teamName,
      teamMembers: data.teamMembers,
      teamExperience: data.teamExperience,
      previousProjects: data.previousProjects,
      teamExperienceDescription: data.teamExperienceDescription,
      gameGenre: data.gameGenre,
      gameTitle: data.gameTitle,
      gameConcept: data.gameConcept,
      whyWin: data.whyWin,
      whyPlayersLike: data.whyPlayersLike,
      promotionPlan: data.promotionPlan,
      monetizationPlan: data.monetizationPlan,
      projectedDAU: parseInt(data.projectedDAU),
      dayOneRetention: parseInt(data.dayOneRetention),
      developmentTimeline: data.developmentTimeline,
      resourcesTools: data.resourcesTools,
      acknowledgment: data.acknowledgment
    })
    
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
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}

