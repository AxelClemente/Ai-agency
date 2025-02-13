# Márgenes y Control de Overflow en Mobile-First

## Problema Resuelto
- Scroll horizontal no deseado en móvil
- Márgenes inconsistentes entre componentes
- Elementos que se extienden más allá del viewport

## Solución Implementada

### 1. Estructura Base en page.tsx
- Contenedor principal: `px-4 md:container md:mx-auto md:px-8`
- Padding base móvil: `px-4`
- Container desktop: `md:container`
- Padding desktop: `md:px-8`

### 2. Manejo de Elementos Full-Width en Móvil
- Usar `w-[calc(100%+32px)]` para compensar padding
- Aplicar `-mx-[16px]` para márgenes negativos
- Resetear en desktop con `sm:mx-0`

### 3. Secciones CTA y Contenedores Oscuros
- Márgenes negativos: `mx-[-16px]`
- Reset en desktop: `sm:mx-0`
- Padding interno: `px-4`
- Bordes redondeados: `rounded-3xl`

### 4. Breakpoints y Responsive Design
- Base (móvil): Sin prefijo
- Tablet/Desktop: `sm:` (≥640px)
- Desktop: `md:` (≥768px)

### 5. Patrones Comunes

#### Centrado de Texto
- Usar `text-center`
- Ajustar padding móvil: `pt-4 sm:pt-0`

#### Márgenes Negativos
- Coincidir con padding del contenedor
- Fórmula: `-mx-[padding-value]`
- Resetear en desktop con `sm:mx-0`

#### Imágenes y Fondos
- Ocultar en móvil: `hidden sm:block`
- Posicionamiento: `absolute` con z-index
- Contención: `object-contain`

## Beneficios
1. Elimina el scroll horizontal
2. Mantiene consistencia visual
3. Facilita el mantenimiento
4. Respeta el diseño mobile-first

## Consideraciones
- Usar px para márgenes negativos
- Coordinar padding y márgenes
- Mantener coherencia en breakpoints
- Evitar overflow-x-hidden global

## Solución de Problemas

### 1. Texto No Centrado
- Agregar padding superior en móvil
- Asegurar width completo del contenedor

### 2. Desbordamiento Horizontal
- Verificar coincidencia de márgenes y padding
- Usar calc() para compensaciones
- Evitar anchos absolutos excesivos

### 3. Inconsistencias Responsive
- Mantener patrón base/sm consistente
- Documentar breakpoints
- Coordinar valores de espaciado