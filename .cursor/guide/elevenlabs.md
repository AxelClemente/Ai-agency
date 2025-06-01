# Guía de Integración de ElevenLabs

## 1. Configuración Inicial

### Variables de Entorno
env
ELEVENLABS_API_KEY=tu_api_key
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=agent_default # Agente de Hostelería (default)
NEXT_PUBLIC_ELEVENLABS_AGENT_ID_SUPPORT=agent_support # Agente de Soporte
NEXT_PUBLIC_ELEVENLABS_AGENT_ID_CLINICA=agent_clinica # Agente de Clínica
NEXT_PUBLIC_ELEVENLABS_AGENT_ID_REALSTATE=agent_realstate # Agente Inmobiliario

## 2. Estructura de Archivos
app/
├── api/
│ ├── agent/
│ │ └── route.ts # API para comunicación con múltiples agentes
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
│ │ │ ├── conversation-widget.tsx
│ │ │ └── transcript-summary-panel.tsx # Panel de resumen inteligente
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
agentId String // ID del agente específico
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
- Maneja la comunicación con múltiples agentes de ElevenLabs
- Recibe y procesa el agentId específico para cada conversación
- Envía mensajes al agente correspondiente
- Usa la API de chat conversacional de ElevenLabs

### Transcription API (app/api/transcription/route.ts)
- Guarda las transcripciones en la base de datos
- Almacena métricas y metadata incluyendo el agentId
- Maneja el estado de la conversación

## 5. Componentes React

### ConversationWidget (conversation-widget.tsx)
- Componente principal para la interacción con los agentes
- Recibe y utiliza el agentId específico
- Usa `useConversation` hook de ElevenLabs
- **NUEVO**: Control de duración precisa con finalDuration state
- **NUEVO**: Cálculo correcto de tiempo real vs tiempo final
- **NUEVO**: Integración automática con panel de resumen al finalizar

### TranscriptSummaryPanel (transcript-summary-panel.tsx) ⭐ NUEVO
- Panel lateral inteligente que se abre automáticamente al finalizar conversaciones
- Análisis específico por tipo de agente:
  - 🍕 Hostelería: Productos, modificaciones, estado del pedido
  - 🎧 Soporte: Tipo de issue, estado de resolución, prioridad
  - 🏥 Clínica: Citas agendadas, especialidad, urgencia
  - 🏠 Inmobiliario: Tipo de propiedad, transacción, nivel de interés
- Deshabilita scroll del body cuando está abierto
- Animaciones suaves de entrada/salida
- Análisis programático de transcripciones

## 6. Análisis Inteligente de Conversaciones ⭐ NUEVO

### Sistema de Análisis Programático (Actual)
- analyzeRestaurantOrder(): Detecta productos, modificaciones, completitud
- analyzeSupportTicket(): Clasifica issues, estado de resolución
- analyzeMedicalAppointment(): Citas, especialidades, urgencia
- analyzeRealEstateInquiry(): Propiedades, transacciones, interés

### Limitaciones del Análisis Actual
- Solo detecta palabras clave específicas
- No entiende contexto ni sinónimos
- Basado en reglas hardcodeadas

## 7. Métricas y Costos

### Datos Guardados
- Duración precisa de la conversación (corregido)
- Costo en créditos
- Análisis específico por tipo de negocio
- Estado de la conversación
- ID del agente utilizado
- Insights automáticos extraídos

## 8. Mejores Prácticas

### Seguridad
- Validación de usuarios con NextAuth
- Verificación de permisos
- Manejo seguro de API keys
- Validación de agentId

### Rendimiento
- Uso de Server Components donde sea posible
- Optimización de queries de Prisma
- Manejo eficiente de estados
- Carga dinámica de agentes
- Control de scroll para mejor UX en modales

### UX/UI
- Animaciones suaves en panel lateral
- Análisis contextual por tipo de agente
- Feedback visual inmediato
- Diseño responsive optimizado

## 9. Limitaciones y Consideraciones

- El costo real se obtiene después de la conversación
- La latencia puede variar según la conexión
- Necesario manejar permisos de audio del navegador
- Considerar límites de la API de ElevenLabs
- Análisis programático limitado (solo palabras clave)

## 10. Próximos Pasos

### Fase 1: Mejoras Inmediatas ✅ COMPLETADO
- [x] Panel de resumen inteligente
- [x] Análisis específico por agente
- [x] Control de duración preciso
- [x] UX mejorada con animaciones

### Fase 2: Integración con IA 🚀 PRÓXIMO
- [ ] Integrar OpenAI/Claude para análisis semántico
- [ ] Resúmenes automáticos más naturales
- [ ] Detección de sentimientos en conversaciones
- [ ] Extracción de entidades avanzada

### Fase 3: Analytics Avanzados
- [ ] Dashboard de métricas por agente
- [ ] Reportes automáticos de rendimiento
- [ ] A/B testing de diferentes agentes
- [ ] Predicción de satisfacción del cliente

### Fase 4: Escalabilidad
- [ ] Modelo ML personalizado por industria
- [ ] Integración con CRM existente
- [ ] API pública para terceros
- [ ] Multi-idioma automático

## 11. Arquitectura de Análisis IA (Futuro)

### Pipeline Propuesto
Transcripción → Preprocesamiento → Análisis IA → Insights → Dashboard

### Beneficios Esperados
- 95% precisión vs 60% actual
- Análisis multiidioma automático
- Detección de emociones en tiempo real
- Recomendaciones de mejora automáticas

---

**Última actualización**: Diciembre 2024
**Estado**: Panel inteligente implementado, listo para integración IA
**Próximo milestone**: Integración OpenAI para análisis semántico