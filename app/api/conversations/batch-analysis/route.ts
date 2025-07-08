import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { analyzeConversationWithAI } from '@/lib/openai'



// Solo permitir POST para batch analysis
export async function POST() {
  // (Opcional) Validar que el usuario es admin
  // ...

  // Obtener todas las conversaciones del agente de hostelería sin análisis
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_SUPPORT
  if (!agentId) {
    return NextResponse.json({ error: 'AgentId not configured' }, { status: 500 })
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      agentId,
      analysis: null
    }
  })

  let processed = 0
  const errors: string[] = []

  for (const conv of conversations) {
        try {
      const analysis = await analyzeConversationWithAI(conv.transcript)
      await prisma.conversationAnalysis.create({
        data: {
          conversationId: conv.id,
          programmaticData: JSON.parse(JSON.stringify(analysis)),
        }
      })
      processed++
    } catch {
      errors.push(conv.id)
    }
    }

  return NextResponse.json({ success: true, processed, errors })
} 