# ElevenLabs Tools - Sistema de Reservaciones

## 🎯 Resumen

Se ha implementado un sistema completo de herramientas para el agente de ElevenLabs que permite crear y gestionar reservaciones de restaurante directamente desde las conversaciones del agente.

## 🏗️ Arquitectura Implementada

### Backend
- **Endpoints de Reservaciones**:
  - `POST /api/reservations/create` - Crear nueva reservación
  - `GET /api/reservations/list` - Listar reservaciones
  - `POST /api/elevenlabs/tools` - Proxy para herramientas del agente
  - `GET /api/elevenlabs/tools` - Lista de herramientas disponibles

### Herramientas del Agente
- **`create_reservation`**: Crear nueva reservación
- **`get_reservations`**: Consultar reservaciones existentes

### Base de Datos
- Modelo `Reservation` en Prisma (ya existía)
- Campos: id, userId, name, phone, date, people, notes, createdAt, updatedAt

## 🔧 Configuración

### Variables de Entorno Requeridas
```env
ELEVENLABS_API_KEY=your_api_key_here
NEXT_PUBLIC_ELEVENLABS_AGENT_ID_SUPPORT=agent_01jwnhydh6eggat3jcjrz1ryfs
NEXTAUTH_URL=http://localhost:3000
```

### Agente de Hostelería
- **ID**: `agent_01jwnhydh6eggat3jcjrz1ryfs`
- **Configuración**: `NEXT_PUBLIC_ELEVENLABS_AGENT_ID_SUPPORT`

## 🚀 Uso

### 1. Configurar Herramientas en ElevenLabs

```bash
# Ejecutar script de configuración
node scripts/setup-elevenlabs-tools.js
```

### 2. Probar Herramientas Localmente

```bash
# Ejecutar pruebas de herramientas
node scripts/test-agent-tools.js
```

### 3. Ejemplo de Llamada de Herramienta

```javascript
// Crear reservación
{
  "tool_name": "create_reservation",
  "arguments": {
    "name": "María González",
    "date": "2025-01-20",
    "time": "19:30",
    "people": 6,
    "contact": "+34 612 345 678",
    "notes": "Mesa cerca de la ventana, por favor"
  }
}

// Consultar reservaciones
{
  "tool_name": "get_reservations",
  "arguments": {
    "date": "2025-01-20"  // Opcional
  }
}
```

## 📊 Validaciones Implementadas

### Creación de Reservaciones
- ✅ Nombre requerido
- ✅ Fecha en formato YYYY-MM-DD
- ✅ Hora en formato HH:MM (24h)
- ✅ Número de personas (1-20)
- ✅ Fecha debe ser futura
- ✅ Prevención de reservaciones duplicadas

### Consulta de Reservaciones
- ✅ Filtrado por fecha opcional
- ✅ Paginación automática
- ✅ Ordenamiento por fecha

## 🔍 Logs de Debugging

Todos los endpoints incluyen logs detallados con prefijos:
- `🔧 [RESERVATION CREATE]` - Creación de reservaciones
- `🔍 [RESERVATION LIST]` - Listado de reservaciones
- `🔧 [ELEVENLABS TOOL]` - Herramientas del agente
- `🔧 [ELEVENLABS PROXY]` - Proxy de herramientas

## 📈 Integración con Analytics

El endpoint `/api/analytics/reservations-by-day` ha sido actualizado para incluir:
- ✅ Reservaciones reales de la base de datos
- ✅ Reservaciones de análisis de AI
- ✅ Diferenciación por origen (Real vs AI Analysis)

## 🛠️ Archivos Creados/Modificados

### Nuevos Archivos
- `lib/elevenlabs-tools.ts` - Configuración de herramientas
- `app/api/reservations/create/route.ts` - Endpoint de creación
- `app/api/reservations/list/route.ts` - Endpoint de listado
- `app/api/elevenlabs/tools/route.ts` - Proxy para ElevenLabs
- `scripts/setup-elevenlabs-tools.js` - Script de configuración
- `scripts/test-agent-tools.js` - Script de pruebas

### Archivos Modificados
- `lib/elevenlabs-config.ts` - Configuración actualizada
- `app/api/analytics/reservations-by-day/route.ts` - Integración con datos reales

## 🧪 Testing

### Pruebas Automatizadas
```bash
# Probar endpoints
curl http://localhost:3000/api/elevenlabs/tools

# Probar creación de reservación (requiere autenticación)
curl -X POST http://localhost:3000/api/reservations/create \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","date":"2025-01-20","time":"20:00","people":4}'
```

### Estado de Pruebas
- ✅ Endpoint de herramientas: FUNCIONANDO
- ✅ Proxy de herramientas: FUNCIONANDO
- ✅ Validaciones: FUNCIONANDO
- ⚠️ Autenticación: REQUERIDA (esperado)

## 🎯 Próximos Pasos

1. **Configurar en ElevenLabs**:
   ```bash
   node scripts/setup-elevenlabs-tools.js
   ```

2. **Probar con agente real** en plataforma ElevenLabs

3. **Implementar autenticación para agentes** (si es necesario)

4. **Actualizar frontend** para mostrar reservaciones reales

## 🔒 Seguridad

- ✅ Validación de entrada en todos los endpoints
- ✅ Autenticación requerida para operaciones sensibles
- ✅ Prevención de reservaciones duplicadas
- ✅ Rate limiting recomendado para producción

## 📝 Notas Técnicas

- Las herramientas usan el modelo `Reservation` existente
- La integración con analytics combina datos reales y de AI
- Los logs incluyen prefijos para fácil debugging
- El sistema está preparado para escalar con cache y optimizaciones

## 🆘 Solución de Problemas

### Error: "Unauthorized"
- Verificar que el usuario esté autenticado
- En producción, configurar autenticación para agentes

### Error: "Invalid date format"
- Usar formato YYYY-MM-DD para fechas
- Usar formato HH:MM para horas (24h)

### Error: "Tool not found"
- Verificar que la herramienta esté registrada en ElevenLabs
- Ejecutar script de configuración si es necesario 