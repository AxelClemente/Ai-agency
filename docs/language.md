# Guía de Internacionalización - Fideliza

## Descripción General
El sistema de internacionalización de Fideliza permite mostrar el contenido de la aplicación en múltiples idiomas (Español, Inglés y Francés). Este documento explica cómo funciona el sistema y cómo mantenerlo.

## Estructura del Sistema

### 1. Idiomas Soportados
Actualmente, la aplicación soporta tres idiomas:
- Español (es)
- Inglés (en) - Idioma por defecto
- Francés (fr)

### 2. Archivos de Traducción
Las traducciones se encuentran en archivos JSON en el directorio `/messages/`:
- `/messages/es.json` - Español
- `/messages/en.json` - Inglés
- `/messages/fr.json` - Francés

### 3. Detección Automática de Idioma
La aplicación detecta automáticamente el idioma preferido del navegador del usuario. Si el idioma detectado no está soportado, se utilizará el inglés como idioma por defecto.

### 4. Flujo de Cambio de Idioma
Cuando un usuario cambia el idioma:
1. Se detecta la seleccion del nuevo idioma
2. Se mantiene la ruta actual del usuario
3. Se actualiza la URL con el nuevo locale
4. Se recargan los textos sin refrescar la pagina completa
5. Se mantiene el estado de la aplicacion

### 5. Componentes de Idioma
La aplicacion incluye dos selectores de idioma:
- Selector en header desktop (`main-header.tsx`)
- Selector en header movil (`mobile-main-header.tsx`)

## Mantenimiento de Traducciones

### 1. Estructura de los Archivos JSON
Cada archivo de traducción sigue una estructura jerárquica por secciones. Por ejemplo:

```json
{
  "Header": {
    "about": "Sobre el servicio",
    "help": "Ayuda",
    "languages": {
      "es": "Espanol",
      "en": "English",
      "fr": "Francais"
    }
  }
}
```

### 2. Agregar Nuevas Traducciones
Para agregar nuevo contenido traducible:
1. Anadir la nueva clave y texto en todos los archivos de idioma (`es.json`, `en.json`, `fr.json`)
2. Mantener la misma estructura de claves en todos los archivos
3. Asegurarse de que todas las claves tienen su correspondiente traduccion en cada idioma

### 3. Modificar Traducciones Existentes
Para modificar traducciones:
1. Localizar la clave en el archivo del idioma correspondiente
2. Modificar el texto manteniendo el formato y las variables si existen
3. Asegurarse de que los cambios son consistentes con el significado en otros idiomas

### 4. Variables en Traducciones
Algunas traducciones pueden incluir variables dinamicas. Por ejemplo:
```json
{
  "MySubscriptions": {
    "visitsRemaining": "{remaining} / {total} visitas restantes"
  }
}
```
Al usar variables:
1. Mantener los nombres de variables consistentes en todos los idiomas
2. No traducir los nombres de las variables
3. Respetar el formato {nombreVariable}

### 5. Organizacion de Archivos
La estructura de archivos del sistema:
```
fideliza/
├── messages/
│   ├── es.json
│   ├── en.json
│   └── fr.json
├── middleware.ts
├── messages.ts
└── app/
    └── [locale]/
        ├── layout.tsx
        ├── page.tsx
        └── components/
            └── layout/
                ├── main-header.tsx
                └── mobile-main-header.tsx
```

## Agregar un Nuevo Idioma

Para anadir soporte para un nuevo idioma:

1. Crear un nuevo archivo de traduccion:
   ```
   /messages/[codigo-idioma].json
   ```

2. Modificar el middleware (`middleware.ts`):
   ```typescript
   export default createMiddleware({
     locales: ['es', 'en', 'fr', 'nuevo-idioma'],
     defaultLocale: 'en'
   });
   ```

3. Actualizar la funcion `generateStaticParams`:
   ```typescript
   export function generateStaticParams() {
     return [
       { locale: 'en' }, 
       { locale: 'es' },
       { locale: 'fr' },
       { locale: 'nuevo-idioma' }
     ];
   }
   ```

4. Agregar el nuevo idioma al selector de idiomas en los componentes de header.

## Consideraciones Importantes

1. **Consistencia**: Mantener la misma estructura de claves en todos los archivos de idioma.

2. **Valores por Defecto**: El ingles (en) se usa como idioma por defecto si ocurre algun error.

3. **URLs**: El sistema no muestra el idioma en las URLs para mantenerlas limpias.

4. **Pre-renderizado**: La aplicacion pre-renderiza las paginas en todos los idiomas soportados durante el build para mejor rendimiento.

5. **Rendimiento**: Las traducciones se cargan bajo demanda para optimizar el tiempo de carga inicial.

6. **SEO**: La aplicacion esta optimizada para motores de busqueda en todos los idiomas soportados.

7. **Fallbacks**: Si una traduccion falta en un idioma, se usa la version en ingles como respaldo.

## Solucion de Problemas

Si una traduccion no aparece correctamente:
1. Verificar que la clave existe en el archivo del idioma correspondiente
2. Comprobar que la estructura de la clave es identica en todos los archivos
3. Asegurarse de que no hay errores de sintaxis en los archivos JSON
4. Verificar que el idioma esta correctamente configurado en el middleware

## Contacto

Para preguntas tecnicas sobre el sistema de internacionalizacion, contactar al equipo de desarrollo en [correo@ejemplo.com]