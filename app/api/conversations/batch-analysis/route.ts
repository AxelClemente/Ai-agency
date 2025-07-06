import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
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

// Solo permitir POST para batch analysis
export async function POST(request: NextRequest) {
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
  let errors: string[] = []

  for (const conv of conversations) {
    try {
      const analysis = await analyzeConversationWithAI(conv.transcript)
      await prisma.conversationAnalysis.create({
        data: {
          conversationId: conv.id,
          programmaticData: analysis as any,
        }
      })
      processed++
    } catch (e) {
      errors.push(conv.id)
    }
  }

  return NextResponse.json({ success: true, processed, errors })
}

function generateAggregatedMetrics(results: BatchAnalysisResult[]): AggregatedMetrics {
  const analyses = results
    .map(r => r.analysis)
    .filter((analysis): analysis is AIAnalysis => analysis !== undefined)
  
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