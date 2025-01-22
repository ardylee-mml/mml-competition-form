import { NextResponse } from "next/server"
// import mysql from 'mysql2/promise'
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Mock email and Discord ID check
    if (body.email === "test@example.com") {
      return NextResponse.json({ error: "email_exists" }, { status: 400 })
    }
    if (body.discordId === "test#1234") {
      return NextResponse.json({ error: "discord_exists" }, { status: 400 })
    }

    // Mock successful submission
    // In a real application, you would save the data to the database here

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: '"MML Roblox Competition" <noreply@example.com>',
      to: body.email,
      subject: "Application Received - MML Roblox Game Development Competition",
      text: `Dear ${body.name},\n\nThank you for submitting your application to the MML Roblox Game Development Competition. We have received your submission and will review it shortly.\n\nBest regards,\nThe MML Team`,
      html: `<p>Dear ${body.name},</p><p>Thank you for submitting your application to the MML Roblox Game Development Competition. We have received your submission and will review it shortly.</p><p>Best regards,<br>The MML Team</p>`,
    })

    return NextResponse.json({ message: "Application submitted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error submitting application:", error)
    return NextResponse.json({ message: "Error submitting application" }, { status: 500 })
  }
}

