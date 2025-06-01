// app/api/agent/route.ts

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { message, agentId } = await req.json()

  const response = await fetch('https://api.elevenlabs.io/v1/conversational/agents/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': process.env.ELEVENLABS_API_KEY || ''
    },
    body: JSON.stringify({
      agent_id: agentId,
      text: message
    })
  })

  const data = await response.json()

  return NextResponse.json({ reply: data.text })
}
