import { NextResponse } from "next/server"
import pool from '@/lib/db'
import { Resend } from 'resend'
import { v4 as uuidv4 } from 'uuid'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const applicationId = uuidv4()
    const connection = await pool.getConnection()

    try {
      // Check for duplicate email or discord ID
      const [existingApplications] = await connection.query(
        'SELECT email, discord_id FROM applications WHERE email = ? OR discord_id = ?',
        [data.email, data.discordId]
      )

      if (Array.isArray(existingApplications) && existingApplications.length > 0) {
        const duplicate = existingApplications[0] as { email: string; discord_id: string }
        if (duplicate.email === data.email) {
          return NextResponse.json({ error: "email_exists" }, { status: 400 })
        }
        if (duplicate.discord_id === data.discordId) {
          return NextResponse.json({ error: "discord_exists" }, { status: 400 })
        }
      }

      const query = `
        INSERT INTO applications (
          id, name, email, discord_id, team_name, team_members,
          team_experience, previous_projects, team_experience_description,
          game_genre, game_title, game_concept, why_win,
          why_players_like, promotion_plan, monetization_plan,
          projected_dau, day_one_retention, development_timeline,
          resources_tools
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `

      const values = [
        applicationId,
        data.name,
        data.email,
        data.discordId,
        data.teamName,
        data.teamMembers,
        data.teamExperience,
        data.previousProjects,
        data.teamExperienceDescription,
        data.gameGenre,
        data.gameTitle,
        data.gameConcept,
        data.whyWin,
        data.whyPlayersLike,
        data.promotionPlan,
        data.monetizationPlan,
        data.projectedDAU,
        data.dayOneRetention,
        data.developmentTimeline,
        data.resourcesTools
      ]

      console.log("Executing query...") // Debug log
      await connection.query(query, values)
      
      // Send confirmation email with error handling
      try {
        const emailResult = await resend.emails.send({
          from: 'MML Game Competition <info@metamindinglab.com>',
          to: [data.email],
          subject: 'MML Game Development Competition Application Confirmation',
          html: `
            <h1>Application Received</h1>
            <p>Dear ${data.name},</p>
            <p>Thank you for submitting your application to the MML Game Development Competition!</p>
            <p>Your application ID is: ${applicationId}</p>
            <p>We will review your submission and contact you through your provided email (${data.email}) or Discord ID (${data.discordId}).</p>
            <br/>
            <p>Best regards,</p>
            <p>MML Game Development Competition Team</p>
          `
        });
        console.log('Email sent:', emailResult);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Continue with the response even if email fails
      }

      return NextResponse.json({ 
        success: true, 
        applicationId 
      })
    } catch (queryError) {
      console.error("Query error:", queryError) // Detailed error log
      throw queryError
    } finally {
      connection.release()
    }
  } catch (error: any) {
    console.error("Detailed error:", {
      message: error.message,
      code: error.code,
      stack: error.stack
    })
    return NextResponse.json(
      { 
        error: "Failed to submit application", 
        details: error.message 
      }, 
      { status: 500 }
    )
  }
}

