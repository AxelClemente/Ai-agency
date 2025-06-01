# Guía de Integración de ElevenLabs

## 1. Configuración Inicial

### Variables de Entorno
env
ELEVENLABS_API_KEY=tu_api_key
ELEVENLABS_AGENT_ID=tu_agent_id


## 2. Estructura de Archivos
app/
├── api/
│ ├── agent/
│ │ └── route.ts # API para comunicación con el agente
│ ├── transcription/
│ │ └── route.ts # API para guardar transcripciones
│ └── users/
│ └── [userId]/
│ └── conversation-cost/
│ └── route.ts # API para costos de conversación
├── [locale]/
│ └── customer-dashboard/
│ ├── conversation/
│ │ ├── components/
│ │ │ └── conversation-widget.tsx
│ │ └── page.tsx
│ └── components/
│ └── cost-metrics.tsx
prisma/
└── schema.prisma # Modelo de datos


## 3. Modelo de Datos (schema.prisma)

prisma
model Conversation {
id String @id @default(auto()) @map("id") @db.ObjectId
userId String @db.ObjectId
agentId String
transcript String
duration Int // duración en segundos
cost Float // costo en créditos
startedAt DateTime @default(now())
endedAt DateTime @updatedAt
status String
messages Json[]
metrics Json
metadata Json?
user User @relation(fields: [userId], references: [id])
@@index([userId])
@@index([agentId])
}


## 4. APIs

### Agent API (app/api/agent/route.ts)
- Maneja la comunicación directa con ElevenLabs
- Envía mensajes al agente y recibe respuestas
- Usa la API de chat conversacional de ElevenLabs

### Transcription API (app/api/transcription/route.ts)
- Guarda las transcripciones en la base de datos
- Almacena métricas y metadata
- Maneja el estado de la conversación

## 5. Componentes React

### ConversationWidget (conversation-widget.tsx)
- Componente principal para la interacción con el agente
- Usa `useConversation` hook de ElevenLabs
- Maneja:
  - Inicio/fin de sesión
  - Grabación de audio
  - Transcripción en tiempo real
  - Guardado de conversaciones

### Funcionalidades Principales
typescript
const conversation = useConversation({
onConnect: () => { / Inicio de sesión / },
onMessage: (msg) => { / Mensajes del agente / },
onUserMessage: (msg) => { / Mensajes del usuario / },
onError: (err) => { / Manejo de errores / }
});


## 6. Métricas y Costos

### Datos Guardados
- Duración de la conversación
- Costo en créditos
- Número de mensajes
- Latencia
- Estado de la conversación

### Estructura de Métricas
typescript
interface ConversationMetrics {
totalLatency: number;
averageLatency: number;
messageCount: number;
creditsUsed: number;
costPerMinute: number;
}


## 7. Mejores Prácticas

### Seguridad
- Validación de usuarios con NextAuth
- Verificación de permisos
- Manejo seguro de API keys

### Rendimiento
- Uso de Server Components donde sea posible
- Optimización de queries de Prisma
- Manejo eficiente de estados

### Manejo de Errores
- Toast notifications para feedback
- Logging detallado
- Recuperación graciosa de errores

## 8. Limitaciones y Consideraciones

- El costo real se obtiene después de la conversación
- La latencia puede variar según la conexión
- Necesario manejar permisos de audio del navegador
- Considerar límites de la API de ElevenLabs

## 9. Próximos Pasos

- [ ] Implementar panel de administración
- [ ] Agregar análisis de sentimiento
- [ ] Mejorar visualización de métricas
- [ ] Implementar exportación de datos