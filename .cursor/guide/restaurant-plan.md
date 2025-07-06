# 📊 Plan Analytics Restaurante/Pizzería

## Objetivo
Reemplazar el tab "Adherence Analysis" en Analytics por un análisis real de pedidos y reservas para el agente de hostelería (pizzería).

## Progreso Actual
- ✅ **Extracción AI de productos y reservas**: Implementada extracción automática de productos, tipo de pedido, cliente y reservas desde transcripciones usando OpenAI y backend propio.
- ✅ **Persistencia en MongoDB/Prisma**: Los análisis AI se guardan estructurados en la base de datos, permitiendo consultas y visualización robusta.
- ✅ **UI avanzada de Pedidos y Reservas**: Modal profesional en el dashboard que muestra transcripción, análisis AI, productos, tipo de pedido, cliente y detalles adicionales.
- ✅ **Renderizado robusto de productos**: El frontend muestra productos aunque el campo sea `name` o `product`, y maneja casos edge.
- ✅ **Gráfico de productos vendidos** conectado a datos reales y mocks, usando el endpoint `/api/analytics/products`.
- ✅ **Procesamiento y cacheo de mocks**: Los mocks se procesan en memoria y se cachean para acelerar el desarrollo y evitar múltiples llamadas a OpenAI.
- ✅ **Calendario interactivo** profesional, con navegación de meses y badges de reservas por día.
- ✅ **Vista de día (DayView)**: al pulsar un día en el calendario, se muestra el detalle horario y permite volver.
- ✅ **Navegación fluida** entre calendario y vista de día.
- ✅ **Mejoras de UX/UI**: Manejo de estados de carga, feedback con toast, y modales sin bloqueos.

## Logros Técnicos Detallados
- **Backend**:
  - API `/api/conversations/[conversationId]/restaurant-analysis` analiza la transcripción con OpenAI, mapea la respuesta y guarda el análisis en MongoDB vía Prisma.
  - El modelo `RestaurantAnalysis` almacena productos, tipo de pedido, cliente, reservas, total, etc.
  - Endpoint `/api/analytics/products` suma productos vendidos de análisis reales y de mocks procesados en memoria.
  - **Mocks:** Si el ID es `mock-*`, el endpoint genera el análisis AI en memoria (sin guardar en DB) y lo cachea para acelerar el desarrollo.
  - Se agregaron logs de debugging para verificar el flujo de datos y la persistencia.
- **Frontend**:
  - Modal `RestaurantAnalysisModal` muestra la transcripción y el análisis AI de forma clara y profesional.
  - Renderizado robusto de productos: muestra el nombre aunque venga como `name` o `product`.
  - Manejo seguro de estados y errores, evitando bloqueos de UI.
  - Acceso flexible a `orderType` y otros campos para máxima compatibilidad.
  - Botón de re-análisis AI y feedback inmediato al usuario.
  - El gráfico de productos vendidos hace fetch a `/api/analytics/products` y muestra datos reales + mocks.
- **UX/QA**:
  - El análisis AI extrae correctamente productos, tipo de pedido y cliente.
  - El modal es demo-friendly y listo para negocio.
  - El sistema es robusto ante respuestas ambiguas o incompletas del AI.
  - El gráfico de productos vendidos refleja tanto datos reales como de prueba.

## Uso de Mocks
- Los mocks permiten probar el flujo completo de análisis AI y visualización sin depender de datos reales.
- Se procesan en memoria y se cachean para evitar múltiples llamadas a OpenAI y acelerar el desarrollo.
- No se guardan en la base de datos, por lo que no "ensucian" el entorno de producción.
- El endpoint de analytics suma los productos de los mocks y los reales para alimentar el gráfico.
- En producción, se eliminarán los mocks y el sistema solo usará datos reales de la base de datos.

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
1. **(Futuro) Eliminar mocks y usar solo datos reales:**
   - Cuando haya suficientes análisis reales, eliminar el procesamiento de mocks y dejar el endpoint solo con datos de la base de datos.
   - El gráfico será instantáneo y reflejará solo la operación real del negocio.
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
