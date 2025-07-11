export type Role = 'ai' | 'user';

export type ConversationStatus = 'completed' | 'interrupted' | 'failed';

export interface Message {
  role: Role;
  message: string;
  timestamp: Date;
  latency?: number;
}

export interface ConversationMetrics {
  totalLatency: number;
  averageLatency: number;
  messageCount: number;
  creditsUsed: number;
  costPerMinute: number;
  totalTokens?: number;
  sentiment?: string;
}

export interface ConversationMetadata {
  startedAt: Date;
  endedAt: Date;
  isSpeaking: boolean;
  systemInfo: {
    version: string;
    timestamp: Date;
  };
  userIntent?: string;
  topics?: string[];
}

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