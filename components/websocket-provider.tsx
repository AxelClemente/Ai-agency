'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface WebSocketContextType {
  socket: Socket | null
  isConnected: boolean
  sendMessage: (event: string, data: unknown) => void
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  sendMessage: () => {}
})

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Fix hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Only initialize WebSocket on client side after component mounts
    if (!isMounted || typeof window === 'undefined') return

    console.log('🚀 Initializing WebSocket connection...')

    // Inicializar conexión WebSocket
    const socketInstance = io(process.env.NODE_ENV === 'production' 
      ? 'wss://your-domain.com' 
      : 'ws://localhost:3000', {
      path: '/api/socket',
      transports: ['websocket', 'polling'],
      autoConnect: true
    })

    socketInstance.on('connect', () => {
      console.log('🔗 WebSocket connected')
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      console.log('❌ WebSocket disconnected')
      setIsConnected(false)
    })

    socketInstance.on('connect_error', (error) => {
      console.log('❌ WebSocket connection error:', error.message)
      setIsConnected(false)
    })

    // Eventos específicos para conversaciones
    socketInstance.on('conversation:started', (data) => {
      console.log('📞 Nueva conversación iniciada:', data)
    })

    socketInstance.on('conversation:transcript', (data) => {
      console.log('📝 Transcripción actualizada:', data)
    })

    socketInstance.on('conversation:analysis_complete', (data) => {
      console.log('🧠 Análisis IA completado:', data)
    })

    socketInstance.on('conversation:ended', (data) => {
      console.log('📞 Conversación finalizada:', data)
    })

    socketInstance.on('metrics:updated', (data) => {
      console.log('📊 Métricas actualizadas:', data)
    })

    setSocket(socketInstance)

    return () => {
      console.log('🧹 Cleaning up WebSocket connection')
      socketInstance.disconnect()
    }
  }, [isMounted])

  const sendMessage = (event: string, data: unknown) => {
    if (socket && isConnected) {
      socket.emit(event, data)
    } else {
      console.warn('⚠️ WebSocket not connected, message not sent:', event, data)
    }
  }

  // Don't render WebSocket context until mounted (prevents hydration mismatch)
  if (!isMounted) {
    return (
      <WebSocketContext.Provider value={{ socket: null, isConnected: false, sendMessage: () => {} }}>
        {children}
      </WebSocketContext.Provider>
    )
  }

  return (
    <WebSocketContext.Provider value={{ socket, isConnected, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider')
  }
  return context
}

// Hook específico para conversaciones en tiempo real
export const useConversationUpdates = (conversationId?: string) => {
  const { socket } = useWebSocket()
  const [transcript, setTranscript] = useState('')
  const [analysis, setAnalysis] = useState<unknown>(null)
  const [status, setStatus] = useState<'active' | 'ended' | 'analyzing'>('active')
  const [isMounted, setIsMounted] = useState(false)

  // Fix hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !socket || !conversationId) return

    console.log(`📞 Subscribing to conversation updates: ${conversationId}`)

    // Suscribirse a updates de esta conversación específica
    socket.emit('conversation:subscribe', conversationId)

    socket.on(`conversation:${conversationId}:transcript`, (data) => {
      console.log(`📝 Transcript update for ${conversationId}:`, data)
      setTranscript(prev => prev + ' ' + data.text)
    })

    socket.on(`conversation:${conversationId}:analysis`, (data) => {
      console.log(`🧠 Analysis update for ${conversationId}:`, data)
      setAnalysis(data.analysis)
      setStatus('analyzing')
    })

    socket.on(`conversation:${conversationId}:ended`, (data) => {
      console.log(`📞 Conversation ended for ${conversationId}:`, data)
      setStatus('ended')
    })

    return () => {
      console.log(`📞 Unsubscribing from conversation: ${conversationId}`)
      socket.emit('conversation:unsubscribe', conversationId)
      socket.off(`conversation:${conversationId}:transcript`)
      socket.off(`conversation:${conversationId}:analysis`)
      socket.off(`conversation:${conversationId}:ended`)
    }
  }, [socket, conversationId, isMounted])

  return { transcript, analysis, status }
} 