# Fideliza - Documentación Técnica

## Descripción General
Fideliza es una plataforma de fidelización que conecta negocios con sus clientes mediante un sistema de suscripciones y ofertas especiales. La aplicación está construida con Next.js 14, TypeScript, y utiliza MySQL como base de datos.

## Arquitectura de Base de Datos

### 1. Sistema de Usuarios y Autenticación

# Fideliza - Documentación Técnica


## Tipos de Relaciones en la Base de Datos

### Explicación de Cardinalidad
En el diseño de bases de datos, las relaciones entre tablas se expresan mediante cardinalidad. Las principales son:

- **1:N (Uno a Muchos)**
  - Un registro en la tabla A puede tener múltiples registros relacionados en la tabla B
  - Pero cada registro en B solo puede pertenecer a un registro en A
  - Ejemplo: Un Restaurant puede tener muchos Places, pero cada Place pertenece a un solo Restaurant

- **N:1 (Muchos a Uno)**
  - Es lo mismo que 1:N pero visto desde la otra perspectiva
  - Ejemplo: Muchos Places pertenecen a un Restaurant

- **N:N (Muchos a Muchos)**
  - Registros en la tabla A pueden relacionarse con múltiples registros en la tabla B y viceversa
  - Requiere una tabla intermedia para establecer la relación
  - Ejemplo: Places y Subscriptions - un lugar puede tener múltiples suscripciones y una suscripción puede estar en múltiples lugares

### Ejemplo Práctico

#### Modelos Principales:
- **User**
  - Gestiona usuarios con roles: BUSINESS, CUSTOMER, STAFF, ADMIN
  - Almacena información básica: email, nombre, contraseña hasheada
  - Soporta jerarquía: usuarios business pueden tener staff
  - Relaciones clave:
    - → Restaurants (1:N)
    - → UserSubscriptions (1:N)
    - → Permissions (1:N)

- **Account**
  - Maneja proveedores de autenticación (OAuth)
  - Almacena tokens y datos de sesión
  - Vinculado directamente a User (N:1)

- **Session**
  - Gestiona sesiones activas
  - Relacionado con User para control de acceso

### 2. Sistema de Negocios

#### Modelos Principales:
- **Restaurant**
  - Entidad principal para negocios
  - Contiene información general: título, descripción, categoría
  - Relaciones clave:
    - → User (N:1): propietario
    - → Places (1:N): ubicaciones
    - → RestaurantImages (1:N): galería
    - → RestaurantView (1:N): analytics

- **Place**
  - Representa ubicaciones físicas de restaurantes
  - Gestiona información específica de localización
  - Relaciones clave:
    - → Restaurant (N:1)
    - → Offers (1:N)
    - → Subscriptions (N:N)
    - → UserSubscriptions (1:N)

### 3. Sistema de Ofertas y Suscripciones

#### Modelos Principales:
- **Offer**
  - Gestiona ofertas especiales
  - Incluye fechas de validez y detalles
  - Relaciones clave:
    - → Place (N:1)
    - → OfferImages (1:N)
    - → OfferView (1:N)

- **Subscription**
  - Define planes de suscripción
  - Incluye beneficios y precios
  - Relaciones clave:
    - → Places (N:N)
    - → UserSubscription (1:N)

- **UserSubscription**
  - Gestiona suscripciones activas
  - Controla estados y pagos
  - Relaciones clave:
    - → User (N:1)
    - → Subscription (N:1)
    - → Place (N:1)
    - → Payment (1:N)

### 4. Sistema de Pagos

#### Modelos Principales:
- **Payment**
  - Registra transacciones
  - Estados: PENDING, COMPLETED, FAILED, REFUNDED
  - Métodos: CREDIT_CARD, DEBIT_CARD, PAYPAL, BANK_TRANSFER
  - Relación directa con UserSubscription (N:1)

### 5. Sistema de Permisos y Analytics

#### Modelos Principales:
- **Permission**
  - Control granular de accesos
  - Tipos: VIEW_ONLY, ADD_EDIT_DELETE
  - Modelos controlados: ADMIN_USERS, SUBSCRIBERS, etc.

- **RestaurantView y OfferView**
  - Tracking de visualizaciones
  - Métricas para analytics
  - Timestamps para análisis temporal

## Flujos Principales

### 1. Registro y Onboarding
1. Usuario se registra (BUSINESS/CUSTOMER)
2. Si es BUSINESS:
   - Crea perfil de restaurante
   - Añade lugares
   - Configura suscripciones/ofertas
3. Si es CUSTOMER:
   - Explora restaurantes
   - Se suscribe a programas de fidelización

### 2. Gestión de Suscripciones
1. Business crea plan de suscripción
2. Customer descubre y selecciona plan
3. Proceso de pago (integración con Stripe)
4. Creación de UserSubscription
5. Tracking de pagos y renovaciones

### 3. Sistema de Ofertas
1. Business crea ofertas especiales
2. Vinculación con lugares específicos
3. Customers con suscripción acceden
4. Tracking de visualizaciones y uso

## Consideraciones Técnicas

### Seguridad
- Autenticación robusta con NextAuth.js
- Permisos granulares por modelo
- Encriptación de datos sensibles
- Validación en frontend y backend

### Escalabilidad
- Índices optimizados en tablas clave
- Relaciones eficientes
- Tracking separado para analytics
- Soporte para múltiples ubicaciones

### Mantenibilidad
- Modelos claramente separados
- Relaciones bien definidas
- Sistema de permisos flexible
- Documentación integrada