export const dynamic = 'force-dynamic'

import { v4 as uuidv4 } from 'uuid';
import { Resend } from 'resend';
import sql from '../../lib/db';

const resend = new Resend(process.env.RESEND_API_KEY);

async function handleSubmit(formData: FormData) {
  const applicationId = uuidv4();
  
  try {
    const connection = await sql.getConnection();
    try {
      await connection.query(
        'INSERT INTO applications (id, name, email) VALUES (?, ?, ?)',
        [applicationId, formData.get('name'), formData.get('email')]
      );
    } finally {
      connection.release();
    }

    // Send confirmation email
    await resend.emails.send({
      from: 'info@metamindinglab.com',
      to: formData.get('email') as string,
      subject: 'MML Roblox Game and Development Competition Application Confirmation',
      html: `
        <h1>Application Received</h1>
        <p>Thank you for your application!</p>
        <p>Your application ID is: ${applicationId}</p>
        <p>We will review your application and get back to you soon.</p>
      `
    });

    return { success: true, applicationId };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: 'Failed to submit application' };
  }
} 