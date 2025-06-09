# 🚗 Plan Híbrido: Análisis de Conversaciones AutoBox Manacor

## 📋 Resumen Ejecutivo

**Plan Híbrido** que combina **valor inmediato** (análisis individual) con **infraestructura escalable** (pipeline automático), incluyendo integración **Twilio Voice** para pruebas telefónicas reales y **WebSockets** para updates en tiempo real.

---

## 🎯 Objetivos Unificados del Proyecto

### Objetivos Inmediatos (Semanas 1-2)
- **MVP funcional** con análisis de conversaciones individuales
- **Pruebas telefónicas reales** con Twilio Voice 
- **Dashboard individual** por conversación
- **Análisis IA bajo demanda** (costo controlado)
- **Validación con AutoBox Manacor**

### Objetivos Escalables (Semanas 3-12)
- **Pipeline automático** de análisis masivo
- **Dashboard agregado** con métricas globales
- **WebSockets** para updates en tiempo real
- **Webhook automation** desde ElevenLabs
- **Sistema de monitoreo** y alertas

### Objetivos Estratégicos
- **Escalabilidad** para múltiples clientes/industrias
- **ROI measurement** preciso del agente de voz
- **Análisis predictivo** de patrones de abandono
- **Template reusable** para otros sectores

---

## 🏗️ Arquitectura Híbrida del Sistema

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Twilio Voice  │───▶│   ElevenLabs     │───▶│   Dashboard     │
│   (Phone Test)  │    │   Agent          │    │   Individual    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                       │                        │
        ▼                       ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Call Storage  │    │   Manual IA      │───▶│   WebSocket     │
│   & Analytics   │    │   Analysis       │    │   Real-time     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                       │                        │
        ▼                       ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Webhook       │───▶│   Auto Pipeline  │───▶│   Aggregated    │
│   Automation    │    │   (Future)       │    │   Dashboard     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

---

## 📅 Plan de Implementación Híbrido

### **FASE 0: MVP Telefónico** (Semana 1) 🚀

#### **0.1 Integración Twilio Voice** (Día 1-2)
```typescript
// Setup básico Twilio para redirección telefónica
POST /api/twilio/voice-webhook
- Recibe llamada → ElevenLabs Agent
- Captura transcript automáticamente
- Redirecciona a móvil para pruebas
```

**📋 Tareas Específicas:**
1. Setup cuenta Twilio + número de prueba
2. Configurar webhook que conecte Twilio → ElevenLabs
3. Implementar redirección a móvil personal
4. Setup TwiML básico para manejo de llamadas
5. Captura automática de transcripciones
6. Tests de calidad de audio

**✅ Criterios de Aceptación:**
- [ ] Llamadas telefónicas funcionando
- [ ] Audio claro bidireccional  
- [ ] Transcripciones capturadas automáticamente
- [ ] Redirección a móvil operativa
- [ ] Latencia < 2 segundos
- [ ] 99% uptime en pruebas

#### **0.2 Dashboard Individual + IA** (Día 3-4)
```typescript
// Implementación del plan elevenlabs.md mejorado
/analysis/[conversationId] 
- Info básica: duración, agente, fecha
- Análisis programático inmediato  
- Botón "Analizar con IA" bajo demanda
- WebSocket para updates en tiempo real
```

**📋 Tareas Específicas:**
1. Crear página dashboard individual
2. Migrar análisis programático existente
3. Implementar API análisis IA (/api/conversation/[id]/ai-analysis)
4. Setup WebSocket básico para real-time updates
5. Sistema de persistencia de análisis IA
6. UX optimizada con loading states

**✅ Criterios de Aceptación:**
- [ ] Dashboard individual funcionando
- [ ] Análisis programático inmediato
- [ ] Análisis IA bajo demanda operativo
- [ ] WebSocket updates en tiempo real
- [ ] Persistencia de análisis guardados
- [ ] UX fluida y responsive

### **FASE 1: Fundación Escalable** (Semana 2-3)

#### **1.1 Base de Datos Unificada** (Día 5-7)
```sql
-- Esquema híbrido que soporte ambos enfoques
conversations (
  id, userId, agentId, twilioCallSid,
  transcript, duration, cost, status,
  phoneNumber, callDirection
)

conversation_analysis (
  id, conversationId, analysisType,
  programmaticResults, aiInsights,
  confidence, cost, createdAt
)

real_time_events (
  id, conversationId, eventType,
  data, timestamp, delivered
)
```

**📋 Tareas Específicas:**
1. Migrar schema existente a esquema híbrido
2. Agregar campos específicos para Twilio integration
3. Crear tablas para análisis dual (programático + IA)
4. Setup índices optimizados
5. Implementar migrations seguras
6. Tests de integridad de datos

#### **1.2 WebSocket Infrastructure** (Día 8-9)
```typescript
// Sistema WebSocket para updates en tiempo real
class ConversationWebSocket {
  onCallStart(conversationId: string)
  onTranscriptUpdate(conversationId: string, text: string)
  onAnalysisComplete(conversationId: string, results: Analysis)
  onCallEnd(conversationId: string, summary: CallSummary)
}
```

**📋 Tareas Específicas:**
1. Setup WebSocket server (Socket.io/native)
2. Implementar eventos de conversación en tiempo real
3. Client-side hooks para auto-updates
4. Sistema de rooms por conversación
5. Reconnection automática
6. Tests de concurrencia

#### **1.3 Twilio-ElevenLabs Bridge** (Día 10-11)
```typescript
// Puente robusto entre Twilio y ElevenLabs
class TwilioElevenLabsBridge {
  async handleIncomingCall(twilioPayload)
  async streamAudioToElevenLabs(audioStream)
  async captureElevenLabsResponse(response)
  async forwardToMobile(callSid, mobileNumber)
}
```

**📋 Tareas Específicas:**
1. Implementar streaming de audio bidireccional
2. Manejo robusto de latencia y calidad
3. Sistema de fallback si ElevenLabs falla
4. Logging detallado de llamadas
5. Cost tracking automático
6. Tests de carga con llamadas simultáneas

### **FASE 2: Pipeline de Análisis Dual** (Semana 4-5)

#### **2.1 Análisis Programático Mejorado** (Día 12-13)
```typescript
// Mejoras al sistema existente de elevenlabs.md
class EnhancedProgrammaticAnalyzer {
  analyzeAutomotiveConversation(transcript: string)
  extractServiceRequests(text: string)
  detectCustomerIntent(text: string)
  calculateUrgencyLevel(context: any)
}
```

#### **2.2 Análisis IA Batch + Individual** (Día 14-15)
```typescript
// Sistema dual: individual bajo demanda + batch automático
class HybridAIAnalyzer {
  // Individual (elevenlabs.md approach)
  async analyzeOnDemand(conversationId: string)
  
  // Batch para pipeline futuro
  async analyzeBatch(conversationIds: string[])
  
  // Prompts específicos AutoBox
  generateAutomotivePrompt(transcript: string, context: any)
}
```

### **FASE 3: Dashboard Agregado + WebSockets** (Semana 6-7)

#### **3.1 Migración Dashboard Hardcoded → Real Data** (Día 16-18)
```typescript
// Conectar dashboard automotive existente con datos reales
const useAutomotiveMetrics = (dateRange: DateRange) => {
  const { data, subscribe } = useWebSocket('/ws/metrics')
  // Real-time updates automáticos
}

const useConversationAnalytics = () => {
  // Combina análisis programático + IA guardados
}
```

#### **3.2 Real-time Dashboard Updates** (Día 19-21)
```typescript
// WebSocket integration en dashboard
- Nuevas conversaciones → auto-refresh métricas
- Análisis completados → update individual dashboards  
- Llamadas activas → indicadores en tiempo real
- Alertas automáticas → notificaciones push
```

### **FASE 4: Automation Pipeline** (Semana 8-10)

#### **4.1 Webhook Automation** (Día 22-24)
```typescript
// Automatización completa del pipeline
POST /api/webhooks/elevenlabs → Queue → Analysis → Aggregation
- Captura automática de todas las conversaciones
- Análisis programático inmediato
- Queue de análisis IA opcional (costo controlado)
- Métricas agregadas en tiempo real
```

#### **4.2 Sistema de Alertas + Monitoreo** (Día 25-27)
```typescript
// Monitoreo proactivo del sistema
- Health checks Twilio ↔ ElevenLabs
- Alerts de calidad de llamadas
- Cost monitoring automático  
- Performance metrics dashboard
```

---

## 🔧 Stack Tecnológico Híbrido

### **Telefonía & Voice**
- **Twilio Voice**: Llamadas telefónicas + redirección
- **ElevenLabs**: Agente de voz conversacional
- **WebRTC**: Streaming de audio (si necesario)

### **Real-time Communication**
- **Socket.io** o **WebSockets nativos**: Updates en tiempo real
- **Redis Pub/Sub**: Scalable messaging

### **Backend**
- **Next.js API Routes**: APIs híbridas
- **PostgreSQL + Prisma**: Datos estructurados
- **Redis + Bull Queue**: Análisis asíncrono
- **OpenAI GPT-4**: Análisis IA bajo demanda

### **Frontend**
- **Next.js 14 + TypeScript**: App completa
- **Shadcn/ui + Tailwind**: UI consistente
- **Recharts**: Dashboard automotive existente
- **Socket.io-client**: Real-time updates

---

## 🚀 Beneficios del Plan Híbrido

### **Valor Inmediato (Semana 1)**
- ✅ Pruebas telefónicas reales con AutoBox
- ✅ Dashboard individual funcionando
- ✅ Análisis IA bajo demanda operativo
- ✅ WebSocket updates en tiempo real

### **Escalabilidad (Semanas 2-10)**  
- ✅ Pipeline automático para volumen
- ✅ Dashboard agregado con métricas globales
- ✅ Sistema de monitoreo profesional
- ✅ Template reusable para otros clientes

### **ROI Comprobable**
- **Semana 1**: Demos funcionando con AutoBox
- **Semana 4**: Métricas reales de conversión
- **Semana 8**: Sistema escalable para 10+ clientes
- **Semana 10**: ROI medible y optimización continua

---

## 📞 Configuración Twilio para MVP

### **Setup Inmediato**
```javascript
// TwiML básico para conectar con ElevenLabs
app.post('/api/twilio/voice', (req, res) => {
  const twiml = new VoiceResponse()
  
  // Conectar con ElevenLabs Agent
  twiml.connect().stream({
    url: 'wss://your-app.com/ws/elevenlabs-bridge'
  })
  
  // Fallback: redirección a móvil
  twiml.dial(process.env.MOBILE_NUMBER)
  
  res.type('text/xml')
  res.send(twiml.toString())
})
```

### **Testing Strategy**
1. **Número Twilio** → **ElevenLabs AutoBox Agent**
2. **Transcripción automática** → **Dashboard individual**
3. **Análisis IA bajo demanda** → **Insights inmediatos**
4. **WebSocket updates** → **Real-time feedback**

---

## 🎯 Próximos Pasos Inmediatos

### **Esta Semana**
1. ✅ **Revisar plan híbrido** (este documento)
2. 🚀 **Setup Twilio account** + número de prueba
3. 🔧 **Implementar bridge Twilio ↔ ElevenLabs**
4. 📱 **Configurar redirección a móvil**
5. 🧪 **Primera llamada de prueba**

### **Validaciones Críticas**
- [ ] **Twilio account** setup y número asignado
- [ ] **ElevenLabs agent** configurado para AutoBox
- [ ] **Audio quality** aceptable (< 300ms latency)
- [ ] **WebSocket infrastructure** básica funcionando
- [ ] **Mobile forwarding** operativo para pruebas

---

## 💡 ¿Por qué WebSockets?

### **Casos de Uso Críticos**
- **Llamadas en progreso**: Transcripción en tiempo real
- **Dashboard updates**: Métricas actualizándose automáticamente  
- **Análisis completados**: Notificaciones instantáneas
- **Alertas de sistema**: Problemas de calidad/conexión
- **Multi-user**: Varios usuarios viendo mismas conversaciones

### **Valor Inmediato**
- **UX superior**: No refresh manual
- **Monitoring real-time**: Llamadas activas visibles
- **Alertas instantáneas**: Problemas detectados inmediatamente
- **Escalabilidad**: Preparado para múltiples clientes concurrentes

---

*Documento vivo - Plan híbrido que maximiza valor inmediato + escalabilidad futura*
