# 📊 Plan Analytics Restaurante/Pizzería

## Objetivo
Reemplazar el tab "Adherence Analysis" en Analytics por un análisis real de pedidos y reservas para el agente de hostelería (pizzería).

## Progreso Actual
- ✅ **Extracción AI de productos y reservas**: Implementada extracción automática de productos, tipo de pedido, cliente y reservas desde transcripciones usando OpenAI y backend propio.
- ✅ **Persistencia en MongoDB/Prisma**: Los análisis AI se guardan estructurados en la base de datos, permitiendo consultas y visualización robusta.
- ✅ **UI avanzada de Pedidos y Reservas**: Modal profesional en el dashboard que muestra transcripción, análisis AI, productos, tipo de pedido, cliente y detalles adicionales.
- ✅ **Renderizado robusto de productos**: El frontend muestra productos aunque el campo sea `name` o `product`, y maneja casos edge.
- ✅ **Gráfico de productos vendidos** (mock) y métricas superiores (ventas, pedidos, reservas).
- ✅ **Calendario interactivo** profesional, con navegación de meses y badges de reservas por día.
- ✅ **Vista de día (DayView)**: al pulsar un día en el calendario, se muestra el detalle horario y permite volver.
- ✅ **Navegación fluida** entre calendario y vista de día.
- ✅ **Mejoras de UX/UI**: Manejo de estados de carga, feedback con toast, y modales sin bloqueos.

## Logros Técnicos Detallados
- **Backend**:
  - API `/api/conversations/[conversationId]/restaurant-analysis` analiza la transcripción con OpenAI, mapea la respuesta y guarda el análisis en MongoDB vía Prisma.
  - El modelo `RestaurantAnalysis` almacena productos, tipo de pedido, cliente, reservas, total, etc.
  - Se agregaron logs de debugging para verificar el flujo de datos y la persistencia.
- **Frontend**:
  - Modal `RestaurantAnalysisModal` muestra la transcripción y el análisis AI de forma clara y profesional.
  - Renderizado robusto de productos: muestra el nombre aunque venga como `name` o `product`.
  - Manejo seguro de estados y errores, evitando bloqueos de UI.
  - Acceso flexible a `orderType` y otros campos para máxima compatibilidad.
  - Botón de re-análisis AI y feedback inmediato al usuario.
- **UX/QA**:
  - El análisis AI extrae correctamente productos, tipo de pedido y cliente.
  - El modal es demo-friendly y listo para negocio.
  - El sistema es robusto ante respuestas ambiguas o incompletas del AI.

## Nueva Estructura del Primer Tab
- **Nombre del Tab:** Análisis de Pedidos y Reservas
- **Gráficos principales:**
  1. **Pedidos y Productos:**
     - Gráfico de barras mostrando el total de pedidos y los productos más pedidos.
     - Métricas superiores: Total de pedidos, producto más popular.
  2. **Calendario de Reservas:**
     - Calendario interactivo que muestra los días y horas con reservas realizadas.
     - Métricas superiores: Total de reservas, día/hora pico.
  3. **Vista de Día:**
     - Al pulsar un día, se muestra el detalle horario y se puede volver al calendario.

## Próximos Pasos
1. **Integrar datos reales para Productos Vendidos:**
   - Extraer productos pedidos de las transcripciones de conversaciones del agente de hostelería.
   - Usar la API de conversaciones (`/api/conversations`) para obtener los datos.
   - Procesar las transcripciones para identificar y contar los productos.
   - Actualizar el gráfico de productos vendidos con datos reales.
2. **Mostrar precios de productos y total en el frontend:**
   - **Enfoque 1:** Usar una tabla de menú con precios para calcular el total programáticamente.
   - **Enfoque 2:** Extraer precios directamente de la transcripción si el agente los menciona.
   - **Enfoque 3:** Mejorar el prompt del agente para que siempre diga el precio de cada producto y el total al confirmar el pedido.
   - Renderizar el precio de cada producto y el total en el modal de análisis.
3. **(Opcional) Integrar reservas reales:**
   - Conectar el calendario a la base de datos de reservas.
   - Mostrar reservas reales por día y hora.
4. **Test y QA:**
   - Probar visualización, UX y performance.
   - Validar métricas y casos edge (sin pedidos, sin reservas, etc).

## Notas
- No modificar los componentes de Automotive.
- Mantener la estructura de tabs, pero adaptar el contenido a la lógica de restaurante/pizzería.
- Priorizar datos reales y visualizaciones útiles para el negocio.
- El sistema es escalable y preparado para futuras mejoras (más campos, nuevos análisis, etc).
