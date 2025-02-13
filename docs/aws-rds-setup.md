# Configuración de AWS RDS para Fideliza

## Índice
1. [Creación de Base de Datos en AWS](#1-creación-de-base-de-datos-en-aws)
2. [Configuración de Seguridad](#2-configuración-de-seguridad)
3. [Configuración de Conexión](#3-configuración-de-conexión)
4. [Migración de la Base de Datos](#4-migración-de-la-base-de-datos)
5. [Acceso y Gestión de Datos](#5-acceso-y-gestión-de-datos)

## 1. Creación de Base de Datos en AWS
- **Nombre**: fideliza-db
- **Tipo**: MySQL 8.0
- **Tier**: Free tier
- **Credenciales**:
  - Usuario: admin
  - Contraseña: Fideliza#2024!

## 2. Configuración de Seguridad
- **Security Group**: fideliza-db-security-group
- **Inbound Rules**:
  - Tipo: MySQL/Aurora (3306)
  - Protocolo: TCP
  - Puerto: 3306
  - Source: 0.0.0.0/0
  - Descripción: "Allow MySQL access from anywhere"

## 3. Configuración de Conexión
### URL de Conexión para Vercel
```bash
DATABASE_URL="mysql://admin:Fideliza%232024!@fideliza-db.cb6ce4uswa4l.eu-west-1.rds.amazonaws.com:3306/fideliza_db"
```

### Configuración en Vercel
1. Ir a Settings > Environment Variables
2. Añadir la variable DATABASE_URL con la URL de conexión
3. Hacer redeploy de la aplicación

## 4. Migración de la Base de Datos
### Comando para migrar schema
```powershell
$env:DATABASE_URL="mysql://admin:Fideliza%232024!@fideliza-db.cb6ce4uswa4l.eu-west-1.rds.amazonaws.com:3306/fideliza_db"; npx prisma db push
```

### Verificación
- Confirmar que todas las tablas se han creado
- Verificar que las relaciones están correctamente configuradas
- Comprobar que los índices están creados

## 5. Acceso y Gestión de Datos
### Prisma Studio
- **Para base de datos local**:
```bash
npx prisma studio
```

- **Para base de datos de producción**:
```powershell
$env:DATABASE_URL="mysql://admin:Fideliza%232024!@fideliza-db.cb6ce4uswa4l.eu-west-1.rds.amazonaws.com:3306/fideliza_db"; npx prisma studio
```

- Acceso: http://localhost:5555

### Notas Importantes
- La base de datos local y de producción son independientes
- Cualquier cambio en Prisma Studio afecta directamente a los datos
- Mantener las credenciales seguras y no compartirlas
- Hacer backups regulares de la base de datos

## Mantenimiento
- Revisar regularmente el uso de recursos
- Monitorear las conexiones activas
- Verificar los logs de error
- Mantener actualizada la versión de MySQL
```

¿Quieres que añada o modifique algo en esta documentación?