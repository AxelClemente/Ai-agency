export interface AIAnalysis {
  summary: string
  serviceType: string
  customerIntent: string
  urgencyLevel: 'low' | 'medium' | 'high'
  sentiment: 'positive' | 'neutral' | 'negative'
  appointmentScheduled: boolean
  estimatedRevenue: number
  keyInsights: string[]
  recommendations: string[]
  nextSteps: string[]
  customerProfile: {
    name?: string | null
    phone?: string | null
    vehicle?: string | null
    isReturningCustomer: boolean
  }
  businessMetrics: {
    conversionProbability: number
    customerLifetimeValue: number
    competitiveAdvantage: string
  }
  confidenceScore: number
  cost?: number
  processingTime?: number
  model?: string
} 