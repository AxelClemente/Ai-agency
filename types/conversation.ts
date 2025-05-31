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