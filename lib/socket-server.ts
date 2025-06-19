import { Server as SocketIOServer } from 'socket.io'
import { Server as NetServer } from 'http'

// Global socket server instance
let io: SocketIOServer | undefined

// Initialize Socket.io server (this would typically be in server.js)
export function initializeSocketServer(server: NetServer) {
  io = new SocketIOServer(server, {
    path: '/api/socket',
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? 'https://your-domain.com' 
        : 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', (socket) => {
    console.log('🔗 Client connected:', socket.id)

    // Handle conversation subscriptions
    socket.on('conversation:subscribe', (conversationId) => {
      socket.join(`conversation:${conversationId}`)
      console.log(`📞 Client ${socket.id} subscribed to conversation ${conversationId}`)
    })

    socket.on('conversation:unsubscribe', (conversationId) => {
      socket.leave(`conversation:${conversationId}`)
      console.log(`📞 Client ${socket.id} unsubscribed from conversation ${conversationId}`)
    })

    // Handle dashboard metrics subscriptions
    socket.on('metrics:subscribe', () => {
      socket.join('metrics')
      console.log(`📊 Client ${socket.id} subscribed to metrics updates`)
    })

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id)
    })
  })

  return io
}

// Utility functions to emit events
export function emitConversationEvent(conversationId: string, event: string, data: unknown) {
  if (io) {
    io.to(`conversation:${conversationId}`).emit(`conversation:${conversationId}:${event}`, data)
  }
}

export function emitMetricsUpdate(data: unknown) {
  if (io) {
    io.to('metrics').emit('metrics:updated', data)
  }
}

export function emitGlobalEvent(event: string, data: unknown) {
  if (io) {
    io.emit(event, data)
  }
} 