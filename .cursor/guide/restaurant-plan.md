# 📊 Plan Analytics Restaurante/Pizzería (Actualizado Julio 2025)

## Objetivo
Reemplazar el tab "Adherence Analysis" en Analytics por un análisis real de pedidos y reservas para el agente de hostelería (pizzería), usando IA y visualización robusta.

---

## Estado Actual (Julio 2025)

### ✅ Logros Técnicos y Funcionales
- **Extracción AI de productos y reservas**: Implementada extracción automática de productos, tipo de pedido, cliente y reservas desde transcripciones usando OpenAI y backend propio.
- **Fechas 100% correctas**: Todos los análisis de pedidos y reservas respetan la fecha real de la conversación (mock o real), gracias a mejoras en el prompt y el pipeline.
- **Mocks robustos**: El sistema puede funcionar 100% con mocks, sin requerir datos reales en la base de datos. Los mocks tienen fechas en 2025 y cubren tanto pedidos como reservas.
- **Visualización avanzada**: El dashboard muestra:
  - Gráfico de productos vendidos (barras)
  - Calendario interactivo de reservas (con badges por día)
  - Métricas superiores: ventas estimadas, total de pedidos, total de reservas
- **Detalle por producto**: Al hacer click en una barra del gráfico, se muestra un modal con las conversaciones que generaron ese producto (ID, fecha, duración).
- **Tooltips de reservas**: Al hacer hover sobre los badges de reservas en el calendario, se muestran los detalles específicos de cada reserva (nombre, hora, número de personas).
- **Cache y performance**: Los análisis de mocks se cachean en memoria para evitar reprocesamiento y acelerar el desarrollo.
- **Logs detallados**: El backend imprime logs claros de cada mock procesado, la fecha usada y la respuesta de OpenAI, facilitando debugging y QA.
- **Frontend y backend desacoplados**: El frontend solo consume los endpoints `/api/analytics/products` y `/api/analytics/reservations-by-day`, sin lógica de mocks ni dependencias de datos reales.

---

## Cómo se logró la robustez y consistencia

### 1. **Problema original**
- El modelo de OpenAI devolvía fechas incorrectas (2023/2024) aunque los mocks eran de 2025.
- El frontend mostraba datos inconsistentes y el calendario aparecía vacío para 2025.

### 2. **Solución aplicada**
- **Prompt AI mejorado**: Se especificó en el prompt que la fecha de reserva debe ser la de la conversación si el cliente no la menciona explícitamente. Se agregó:
  - "CRITICAL DATE HANDLING: If the customer does not specify a reservation date, you MUST use the conversation date provided. NEVER invent dates or use random dates."
- **Pipeline de análisis actualizado**:
  - El backend extrae la fecha del primer mensaje del mock y la pasa explícitamente a la función de análisis AI.
  - Se loguea la fecha usada para cada mock: `📅 Using conversation date: 2025-07-02`.
- **Cache forzado y limpieza**: Se fuerza la limpieza del cache de análisis de mocks en cada request de analytics para asegurar que los cambios de lógica/prompt se reflejen inmediatamente.
- **Validación de logs**: Se validó que todos los logs de OpenAI RAW RESPONSE y las fechas procesadas sean de 2025.
- **Eliminación de dependencias de la base de datos**: Los endpoints de analytics solo usan mocks, garantizando que no hay interferencia de datos viejos.

### 3. **Validación visual y de logs**
- **Pantallazo de la UI**: El dashboard muestra correctamente los productos vendidos y el calendario de reservas con fechas de 2025.
- **Logs de backend**: Cada mock muestra logs como:
  - `📅 Mock mock-16 conversation date: 2025-07-02`
  - `[OpenAI RAW RESPONSE] { "type": "reservation", "date": "2025-07-02", ... }`

---

## Endpoints y Componentes Involucrados
- **Backend**:
  - `/api/analytics/products`: Agrega productos de los mocks, cachea y expone detalles de conversaciones.
  - `/api/analytics/reservations-by-day`: Agrega reservas de los mocks, cachea y expone fechas, conteos y detalles completos de cada reserva (nombre, hora, personas).
  - `lib/restaurant-agent-openai.ts`: Prompt y función de análisis AI, manejo de fechas.
  - `lib/mock-conversations.ts`: Fuente de datos de prueba.
- **Frontend**:
  - `app/[locale]/customer-dashboard/dashboard-customer-panel/analytics/page.tsx`: Página principal de analytics.
  - `components/ReservationCalendar`: Calendario interactivo.
  - `components/BarChart`: Gráfico de productos vendidos.
  - `RestaurantAnalysisModal`: Modal de detalle por producto.

---

## Troubleshooting y QA
- **Si ves fechas incorrectas**: Verifica los logs de backend y asegúrate de que el prompt y la función de análisis AI están usando la fecha de la conversación.
- **Si el calendario aparece vacío**: Asegúrate de que los mocks activos tienen fechas en el año que estás visualizando.
- **Si hay errores de compilación**: Borra la carpeta `.next` y reinicia el servidor (`rm -rf .next && npm run dev`).
- **Si OpenAI responde con datos inesperados**: Revisa el prompt y los logs de la petición.

---

## Próximos Pasos
1. **Transición a datos reales**:
   - Cuando haya suficientes análisis reales en la base de datos, eliminar el procesamiento de mocks y dejar los endpoints solo con datos reales.
   - Validar que la lógica de fechas y agregación funcione igual de robusta con datos reales.
2. **Mostrar precios y totales reales**:
   - Usar la tabla de menú para calcular el total de ventas y mostrar el precio de cada producto en el modal.
3. **Integrar reservas reales**:
   - Conectar el calendario a la base de datos de reservas reales.
   - Mostrar detalles de cada reserva al hacer click en el día.
4. **Mejoras de UX y QA**:
   - Probar casos edge (sin pedidos, sin reservas, datos incompletos).
   - Mejorar feedback visual y mensajes de error.
5. **Documentar el flujo de migración a producción**:
   - Instrucciones claras para eliminar mocks y activar solo datos reales.

---

## Ejemplo de Logs y UI

**Logs de backend:**
```
📅 Mock mock-16 conversation date: 2025-07-02
📅 Using conversation date: 2025-07-02
[OpenAI RAW RESPONSE] { "type": "reservation", "date": "2025-07-02", ... }
✅ Reservation analysis cached for mock-16
```

**Pantallazo de la UI:**
- Gráfico de productos vendidos con datos de 2025
- Calendario de reservas con badges en julio y agosto de 2025
- Tooltips interactivos mostrando detalles de reservas (ej: "Laura — 4 pers. — 21:00")

---

Cualquier desarrollador puede ahora entender el flujo, la robustez lograda y cómo migrar a producción real siguiendo esta documentación.
