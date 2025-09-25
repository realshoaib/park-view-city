import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Resend } from 'resend'

export const runtime = 'nodejs'

const resend = new Resend('re_fK9VgjXB_HECX5HA6RCgWiXsirwW6xqhT')

export async function GET(request: Request) {
  
  const { searchParams } = new URL(request.url)
  const consumerId = searchParams.get('consumerId')?.trim()
  const email = searchParams.get('email')?.trim() // passed from client

  if (!consumerId) {
    return NextResponse.json({ error: 'consumerId is required' }, { status: 400 })
  }

  const filename = '345 Executive Block.pdf'
  if (!filename) {
    return NextResponse.json({ error: 'No bill found for this Customer ID' }, { status: 404 })
  }

  const filePath = path.join(process.cwd(), 'public', filename)
  try {
    const buffer = await fs.readFile(filePath)

    // ---- EMAIL TRIGGER ----
    if (email) {
      try {
        await resend.emails.send({
          from: 'onboarding@resend.dev', // must be verified in Resend
          to: email,
          subject: `Your Bill (${consumerId})`,
          text: `Dear user, please find attached your bill for Customer ID ${consumerId}.`,
          attachments: [
            {
              filename,
              content: buffer.toString('base64'),
              contentType: 'application/pdf'
            }
          ],
        })
      } catch (err) {
        console.error('Email failed:', err)
      }
    }

    // ---- Return file as download ----
    return new Response(buffer, {
      status: 200,
      headers: new Headers({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      }),
    })
  } catch (err) {
    return NextResponse.json({ error: 'File not found on server' }, { status: 500 })
  }
}