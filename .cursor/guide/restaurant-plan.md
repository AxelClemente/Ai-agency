# 📊 Plan Analytics Restaurante/Pizzería

## Objetivo
Reemplazar el tab "Adherence Analysis" en Analytics por un análisis real de pedidos y reservas para el agente de hostelería (pizzería).

## Progreso Actual
- ✅ **UI avanzada de Pedidos y Reservas** implementada en el dashboard.
- ✅ **Gráfico de productos vendidos** (mock) y métricas superiores (ventas, pedidos, reservas).
- ✅ **Calendario interactivo** profesional, con navegación de meses y badges de reservas por día.
- ✅ **Vista de día (DayView)**: al pulsar un día en el calendario, se muestra el detalle horario y permite volver.
- ✅ **Navegación fluida** entre calendario y vista de día.

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
2. **(Opcional) Integrar reservas reales:**
   - Conectar el calendario a la base de datos de reservas.
   - Mostrar reservas reales por día y hora.
3. **Test y QA:**
   - Probar visualización, UX y performance.
   - Validar métricas y casos edge (sin pedidos, sin reservas, etc).

## Notas
- No modificar los componentes de Automotive.
- Mantener la estructura de tabs, pero adaptar el contenido a la lógica de restaurante/pizzería.
- Priorizar datos reales y visualizaciones útiles para el negocio.
