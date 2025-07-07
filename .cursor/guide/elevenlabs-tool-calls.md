# ElevenLabs Tool Calls - Plan de Implementación

## Objetivo
Crear una herramienta (server tool) para el agente de ElevenLabs que permita crear reservaciones directamente en el calendario del restaurante.

## Agente de Hostelería
- **Agent ID**: `agent_01jwnhydh6eggat3jcjrz1ryfs`
- **Configuración**: `NEXT_PUBLIC_ELEVENLABS_AGENT_ID_SUPPORT`

## Plan Paso a Paso

### Fase 1: Análisis y Diseño
1. **Analizar la estructura actual de reservaciones**
   - Revisar el modelo de datos en Prisma
   - Examinar los endpoints existentes de analytics
   - Entender el formato de datos de reservaciones

2. **Diseñar la herramienta de reservaciones**
   - Definir parámetros de entrada (nombre, fecha, hora, personas, contacto, notas)
   - Definir respuesta de éxito/error
   - Planificar validaciones necesarias

### Fase 2: Backend - Base de Datos
3. **Crear modelo de reservaciones en Prisma**
   - Agregar modelo `Reservation` al schema
   - Incluir campos: id, name, date, time, people, contact, notes, createdAt, updatedAt
   - Ejecutar migración de base de datos

4. **Crear endpoint para crear reservaciones**
   - Ruta: `/api/reservations/create`
   - Método: POST
   - Validaciones: fecha futura, hora válida, número de personas
   - Respuesta: confirmación con detalles de la reserva

5. **Crear endpoint para listar reservaciones**
   - Ruta: `/api/reservations/list`
   - Método: GET
   - Filtros: por fecha, estado
   - Respuesta: lista de reservaciones

### Fase 3: Backend - Herramienta del Agente
6. **Crear archivo de configuración de herramientas**
   - Archivo: `lib/elevenlabs-tools.ts`
   - Definir estructura de herramientas
   - Configurar validaciones y tipos

7. **Implementar herramienta de creación de reservaciones**
   - Función: `createReservation`
   - Parámetros: name, date, time, people, contact?, notes?
   - Validaciones: formato de fecha, hora válida, disponibilidad
   - Respuesta: confirmación con ID de reserva

8. **Implementar herramienta de consulta de reservaciones**
   - Función: `getReservations`
   - Parámetros: date (opcional)
   - Respuesta: lista de reservaciones del día o todas

### Fase 4: Integración con ElevenLabs
9. **Configurar herramientas en el agente**
   - Registrar herramientas en ElevenLabs
   - Configurar permisos y acceso
   - Probar conexión básica

10. **Crear endpoint de proxy para ElevenLabs**
    - Ruta: `/api/elevenlabs/tools`
    - Método: POST
    - Autenticación con API key de ElevenLabs
    - Routing a herramientas específicas

### Fase 5: Testing y Debugging
11. **Implementar logs de debugging**
    - Console.log en cada paso crítico
    - Logs de entrada/salida de herramientas
    - Logs de errores y validaciones

12. **Testing de herramientas**
    - Probar creación de reservaciones válidas
    - Probar validaciones de datos inválidos
    - Probar consulta de reservaciones
    - Verificar integración con agente

### Fase 6: Frontend - Integración
13. **Actualizar analytics para incluir reservaciones reales**
    - Modificar endpoint `/api/analytics/reservations-by-day`
    - Combinar datos de AI analysis con reservaciones reales
    - Actualizar frontend para mostrar origen de datos

14. **Crear interfaz de gestión de reservaciones**
    - Página de administración de reservaciones
    - Lista de reservaciones con filtros
    - Formulario de edición/cancelación

### Fase 7: Optimización y Producción
15. **Implementar cache y optimizaciones**
    - Cache de consultas frecuentes
    - Optimización de consultas de base de datos
    - Rate limiting para herramientas

16. **Documentación y deployment**
    - Documentar uso de herramientas
    - Configurar variables de entorno
    - Testing en producción

## Estructura de Archivos a Crear/Modificar

### Nuevos Archivos
- `lib/elevenlabs-tools.ts` - Configuración de herramientas
- `app/api/reservations/create/route.ts` - Endpoint de creación
- `app/api/reservations/list/route.ts` - Endpoint de listado
- `app/api/elevenlabs/tools/route.ts` - Proxy para ElevenLabs

### Archivos a Modificar
- `prisma/schema.prisma` - Agregar modelo Reservation
- `app/api/analytics/reservations-by-day/route.ts` - Integrar datos reales
- `lib/elevenlabs-config.ts` - Configuración de herramientas

## Consideraciones Técnicas

### Seguridad
- Validación de entrada en todos los endpoints
- Autenticación para herramientas del agente
- Rate limiting para prevenir spam

### Performance
- Cache de consultas frecuentes
- Índices en base de datos para fechas
- Paginación en listados grandes

### UX/UI
- Mensajes de confirmación claros
- Manejo de errores amigable
- Feedback inmediato al usuario

## Progreso Actual ✅

### Completado
- ✅ **Fase 1**: Análisis y Diseño
- ✅ **Fase 2**: Backend - Base de Datos
  - ✅ Modelo Reservation ya existe en Prisma
  - ✅ Endpoint `/api/reservations/create` creado
  - ✅ Endpoint `/api/reservations/list` creado
- ✅ **Fase 3**: Backend - Herramienta del Agente
  - ✅ Archivo `lib/elevenlabs-tools.ts` creado
  - ✅ Herramienta `createReservation` implementada
  - ✅ Herramienta `getReservations` implementada
- ✅ **Fase 4**: Integración con ElevenLabs
  - ✅ Endpoint `/api/elevenlabs/tools` creado
  - ✅ Configuración de herramientas en `lib/elevenlabs-config.ts`
  - ✅ Scripts de prueba creados
- ✅ **Fase 5**: Testing y Debugging
  - ✅ Logs de debugging implementados
  - ✅ Testing de herramientas completado
  - ✅ Validaciones funcionando correctamente

### En Progreso
- 🔄 **Fase 6**: Frontend - Integración
  - 🔄 Actualizar analytics para incluir reservaciones reales
  - ⏳ Crear interfaz de gestión de reservaciones

### Pendiente
- ⏳ **Fase 7**: Optimización y Producción
  - ⏳ Implementar cache y optimizaciones
  - ⏳ Documentación y deployment

## Próximos Pasos Inmediatos

1. **Configurar herramientas en ElevenLabs** (Ejecutar script de setup)
2. **Probar con agente real** en plataforma ElevenLabs
3. **Implementar autenticación para agentes** (si es necesario)
4. **Actualizar frontend** para mostrar reservaciones reales

## Scripts Disponibles

- `scripts/setup-elevenlabs-tools.js` - Configurar herramientas en ElevenLabs
- `scripts/test-agent-tools.js` - Probar funcionalidad de herramientas

## Métricas de Éxito
- Herramienta responde en < 2 segundos
- 100% de reservaciones válidas se crean correctamente
- 0% de reservaciones duplicadas o conflictivas
- Integración fluida con agente de ElevenLabs
