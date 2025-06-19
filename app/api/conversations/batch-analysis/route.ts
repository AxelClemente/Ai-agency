import { NextRequest, NextResponse } from 'next/server'
import { analyzeConversationWithAI } from '@/lib/openai'
import { DIVERSE_CONVERSATIONS } from '@/lib/mock-conversations'
import type { AIAnalysis } from '../../../../types/conversation'

interface BatchAnalysisResult {
  conversationId: string
  success: boolean
  analysis?: AIAnalysis
  error?: string
  cost?: number
  processingTime?: number
}

interface AggregatedMetrics {
  totalConversations: number
  totalRevenue: number
  averageConversionRate: number
  serviceDistribution: Record<string, number>
  urgencyDistribution: Record<string, number>
  sentimentDistribution: Record<string, number>
  topInsights: string[]
  competitiveAdvantages: string[]
  lostOpportunities: unknown[]
  totalCost: number
  averageProcessingTime: number
  successRate: number
}

export async function POST(request: NextRequest) {
  try {
    const { conversationIds, includeAggregation = true } = await request.json()
    
    console.log(`🚀 Starting batch AI analysis for ${conversationIds?.length || 'all'} conversations`)
    
    // If no specific IDs provided, analyze all diverse conversations
    const targetIds = conversationIds || DIVERSE_CONVERSATIONS.map(c => c.id)
    const conversations = DIVERSE_CONVERSATIONS.filter(c => targetIds.includes(c.id))
    
    if (conversations.length === 0) {
      return NextResponse.json(
        { error: 'No valid conversations found' },
        { status: 400 }
      )
    }

    console.log(`📊 Processing ${conversations.length} conversations with GPT-4o`)
    
    // Run AI analysis on all conversations (with error handling)
    const batchStartTime = Date.now()
    const results: BatchAnalysisResult[] = await Promise.allSettled(
      conversations.map(async (conversation) => {
        const startTime = Date.now()
        try {
          const analysis = await analyzeConversationWithAI(conversation.transcript)
          const processingTime = Date.now() - startTime
          
          return {
            conversationId: conversation.id,
            success: true,
            analysis,
            cost: analysis.cost || 0,
            processingTime
          }
        } catch (error) {
          console.error(`❌ Analysis failed for ${conversation.id}:`, error)
          return {
            conversationId: conversation.id,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            processingTime: Date.now() - startTime
          }
        }
      })
    ).then(results => 
      results.map(result => 
        result.status === 'fulfilled' ? result.value : {
          conversationId: 'unknown',
          success: false,
          error: 'Promise rejected',
          processingTime: 0
        }
      )
    )

    const batchProcessingTime = Date.now() - batchStartTime
    const successfulResults = results.filter(r => r.success)
    const successRate = successfulResults.length / results.length

    console.log(`✅ Batch analysis completed: ${successfulResults.length}/${results.length} successful`)

    // Generate aggregated metrics if requested
    let aggregatedMetrics: AggregatedMetrics | null = null
    
    if (includeAggregation && successfulResults.length > 0) {
      aggregatedMetrics = generateAggregatedMetrics(successfulResults)
    }

    const response = {
      batchId: `batch-${Date.now()}`,
      timestamp: new Date().toISOString(),
      totalConversations: conversations.length,
      successfulAnalyses: successfulResults.length,
      failedAnalyses: results.length - successfulResults.length,
      successRate: Math.round(successRate * 100),
      totalProcessingTime: batchProcessingTime,
      averageProcessingTime: Math.round(batchProcessingTime / conversations.length),
      totalCost: successfulResults.reduce((sum, r) => sum + (r.cost || 0), 0),
      results,
      aggregatedMetrics
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ Batch analysis error:', error)
    return NextResponse.json(
      { 
        error: 'Batch analysis failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

function generateAggregatedMetrics(results: BatchAnalysisResult[]): AggregatedMetrics {
  const analyses = results.map(r => r.analysis).filter(Boolean)
  
  // Calculate service distribution
  const serviceDistribution: Record<string, number> = {}
  analyses.forEach(analysis => {
    const service = analysis.serviceType || 'Unknown'
    serviceDistribution[service] = (serviceDistribution[service] || 0) + 1
  })

  // Calculate urgency distribution
  const urgencyDistribution: Record<string, number> = {}
  analyses.forEach(analysis => {
    const urgency = analysis.urgencyLevel || 'unknown'
    urgencyDistribution[urgency] = (urgencyDistribution[urgency] || 0) + 1
  })

  // Calculate sentiment distribution
  const sentimentDistribution: Record<string, number> = {}
  analyses.forEach(analysis => {
    const sentiment = analysis.sentiment || 'unknown'
    sentimentDistribution[sentiment] = (sentimentDistribution[sentiment] || 0) + 1
  })

  // Extract top insights (most frequent)
  const allInsights: string[] = []
  analyses.forEach(analysis => {
    if (analysis.keyInsights) {
      allInsights.push(...analysis.keyInsights)
    }
  })
  
  const insightFrequency: Record<string, number> = {}
  allInsights.forEach(insight => {
    insightFrequency[insight] = (insightFrequency[insight] || 0) + 1
  })
  
  const topInsights = Object.entries(insightFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([insight]) => insight)

  // Extract competitive advantages
  const competitiveAdvantages = analyses
    .map(analysis => analysis.businessMetrics?.competitiveAdvantage)
    .filter(Boolean)
    .filter((advantage, index, arr) => arr.indexOf(advantage) === index) // Remove duplicates
    .slice(0, 5)

  // Find lost opportunities (low conversion probability)
  const lostOpportunities = analyses
    .filter(analysis => {
      const conversionProb = analysis.businessMetrics?.conversionProbability || 0
      return conversionProb < 0.3 && analysis.estimatedRevenue > 0
    })
    .map(analysis => ({
      summary: analysis.summary,
      estimatedRevenue: analysis.estimatedRevenue,
      conversionProbability: analysis.businessMetrics?.conversionProbability || 0,
      recommendations: analysis.recommendations || []
    }))
    .slice(0, 5)

  // Calculate totals and averages
  const totalRevenue = analyses.reduce((sum, analysis) => sum + (analysis.estimatedRevenue || 0), 0)
  const averageConversionRate = analyses.reduce((sum, analysis) => {
    return sum + (analysis.businessMetrics?.conversionProbability || 0)
  }, 0) / analyses.length

  const totalCost = results.reduce((sum, r) => sum + (r.cost || 0), 0)
  const averageProcessingTime = results.reduce((sum, r) => sum + (r.processingTime || 0), 0) / results.length

  return {
    totalConversations: analyses.length,
    totalRevenue: Math.round(totalRevenue),
    averageConversionRate: Math.round(averageConversionRate * 100) / 100,
    serviceDistribution,
    urgencyDistribution,
    sentimentDistribution,
    topInsights,
    competitiveAdvantages,
    lostOpportunities,
    totalCost: Math.round(totalCost * 10000) / 10000, // Round to 4 decimal places
    averageProcessingTime: Math.round(averageProcessingTime),
    successRate: Math.round((results.filter(r => r.success).length / results.length) * 100)
  }
} 