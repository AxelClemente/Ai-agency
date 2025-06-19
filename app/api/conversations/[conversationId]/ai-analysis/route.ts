import { NextRequest, NextResponse } from 'next/server'
import { analyzeConversationWithAI, validateAnalysisResponse } from '@/lib/openai'

// Real AI analysis using OpenAI GPT-4o
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { transcript, programmaticAnalysis } = await request.json()
    const { conversationId } = await params

    console.log(`🧠 Running REAL AI analysis for conversation ${conversationId}`)

    // Validate input
    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json(
        { error: 'Transcript is required and cannot be empty' },
        { status: 400 }
      )
    }

    // Call OpenAI GPT-4o for real analysis
    const startTime = Date.now()
    const aiAnalysis = await analyzeConversationWithAI(transcript, programmaticAnalysis)
    const processingTime = Date.now() - startTime

    // Validate response structure
    if (!validateAnalysisResponse(aiAnalysis)) {
      console.error('❌ Invalid AI response structure:', aiAnalysis)
      return NextResponse.json(
        { error: 'Invalid AI response structure' },
        { status: 500 }
      )
    }

    // Enhance with metadata
    const enhancedAnalysis = {
      ...aiAnalysis,
      conversationId,
      processingTime,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }

    console.log(`✅ AI Analysis completed in ${processingTime}ms, cost: $${aiAnalysis.cost}`)

    // TODO: Save analysis to database
    // await saveAnalysisToDatabase(conversationId, enhancedAnalysis)

    // TODO: Emit WebSocket event for real-time updates
    // emitConversationEvent(conversationId, 'analysis_complete', enhancedAnalysis)

    return NextResponse.json(enhancedAnalysis)

  } catch (error) {
    console.error('❌ AI Analysis error:', error)
    
    // Provide helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'OpenAI API key not configured' },
          { status: 500 }
        )
      }
      
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'OpenAI API quota exceeded' },
          { status: 429 }
        )
      }

      if (error.message.includes('JSON')) {
        return NextResponse.json(
          { error: 'AI response parsing failed' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'AI analysis failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 