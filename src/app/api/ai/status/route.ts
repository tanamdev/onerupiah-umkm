import { NextResponse } from 'next/server'

export async function GET() {
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY)

  return NextResponse.json({
    geminiConfigured,
  })
}
