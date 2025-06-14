# 📞 Twilio + ElevenLabs Integration - Estado y Debugging

## 🎯 **OBJETIVO**
Integrar llamadas telefónicas reales que conecten directamente con agentes conversacionales de ElevenLabs, específicamente el agente de Hostelería para Pizza Posta.

---

## 🚨 **CAMBIO DE ESTRATEGIA - DICIEMBRE 2024**

### **❌ TWILIO DESCARTADO**
**Motivos para abandono**:
- ❌ **Sin números españoles**: Solo ofrece números americanos (+1)
- 💸 **Costos prohibitivos**: Llamadas internacionales España → USA extremadamente caras
- 🚫 **Inviable para testing**: Cada llamada de prueba es costosa
- 🚫 **Inviable para producción**: Clientes españoles no llamarán a número +1

### **🎯 NUEVO OBJETIVO**
**Necesidad real del cliente**:
- ✅ **Número español** (fijo 9XX XXX XXX o móvil 6XX XXX XXX)
- ✅ **Llamadas locales** desde España (tarifa normal/gratis)
- ✅ **Integración ElevenLabs** (agente conversacional responde)
- ✅ **Costos razonables** para testing y producción

---

## 🇪🇸 **ALTERNATIVAS PARA NÚMEROS ESPAÑOLES**

### **Opción 1: Vonage (recomendada)**
- ✅ **Números españoles disponibles** (+34)
- ✅ **API similar a Twilio** (fácil migración)
- ✅ **Integración ElevenLabs** posible via webhooks
- ✅ **Precios competitivos** en Europa
- 🔗 Website: [vonage.es](https://vonage.es)

### **Opción 2: Plivo**  
- ✅ **Números España** disponibles
- ✅ **API REST** similar a Twilio
- ✅ **Webhook support** para ElevenLabs
- 🔗 Website: [plivo.com](https://plivo.com)

### **Opción 3: Operadores españoles + SIP**
- ✅ **Movistar/Vodafone/Orange** números reales españoles
- ✅ **SIP trunking** para conectar a APIs
- ⚠️ **Más complejo** de configurar
- ✅ **100% local** sin intermediarios

### **Opción 4: Servicios VoIP especializados**
- **Asterisk + FreePBX** (self-hosted)
- **3CX** (hybrid cloud)
- **RingCentral** (si tiene números ES)

---

## 🚀 **RECOMENDACIÓN INMEDIATA**

### **VONAGE como primera opción**:
1. **Registro en Vonage España**
2. **Comprar número español** (+34 9XX XXX XXX)
3. **Configurar webhook** a ElevenLabs (mismo código que tenemos)
4. **Migrar configuración** (solo cambiar provider)

### **Ventajas Vonage vs Twilio**:
- ✅ Números españoles nativos
- ✅ Llamadas locales baratas
- ✅ API prácticamente idéntica
- ✅ Documentación en español
- ✅ Soporte europeo

---

## ✅ **ESTADO ACTUAL - Diciembre 2024**

### **Configuración Twilio**
- ✅ Número virtual: `+15715208541` 
- ✅ Webhook configurado: `https://api.elevenlabs.io/v1/convai/twilio/inbound-call`
- ✅ Variables de entorno: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- ✅ SDK instalado: `twilio: ^4.23.0`

### **Configuración ElevenLabs**
- ✅ 4 Agentes configurados: Support, Clinic, Hospitality, Real Estate
- ✅ API Key: `ELEVENLABS_API_KEY` 
- ✅ Agente Hostelería ID: `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` = `agent_01jwkfxcw5fq9bzh6hk33dh48c`
- ⚠️ **PROBLEMA**: Webhook configurado pero ngrok bloquea las peticiones

### **Infraestructura Actual**
- ✅ Next.js corriendo en `localhost:3000`
- ⚠️ **PROBLEMA**: ngrok tunnel: `https://6295-95-19-36-141.ngrok-free.app` - Muestra página de advertencia
- ✅ Endpoint local funciona correctamente

---

## ❌ **ERRORES IDENTIFICADOS**

### **✅ ERROR #1 SOLUCIONADO: "Sorry an application error occurred, goodbye"**
**Status**: ✅ CORREGIDO - Formato JSON correcto implementado

### **✅ ERROR #2 SOLUCIONADO: Formato de respuesta incorrecto**
**Status**: ✅ CORREGIDO - Endpoint devuelve `{"assignedAgentId":"agent_01jwkfxcw5fq9bzh6hk33dh48c"}`

### **❌ ERROR #3 NUEVO: ngrok Browser Warning Page**
**Síntoma**: 
- Llamada sigue fallando con el mismo error de ElevenLabs
- **NO aparecen console.logs** en Next.js (señal clave de que no llegan las peticiones)
- ngrok responde con página HTML de advertencia en lugar de reenviar a la aplicación

**Causa Raíz**:
- ngrok free tier muestra página de advertencia/verificación para peticiones HTTP
- ElevenLabs recibe HTML en lugar del JSON esperado
- Las peticiones nunca llegan a nuestro endpoint Next.js

**Evidencia**:
```bash
GET https://6295-95-19-36-141.ngrok-free.app/api/elevenlabs/client-data
Status: 200 OK
Content: <!DOCTYPE html> <!-- PÁGINA DE ADVERTENCIA NGROK -->
```

**Impacto**:
- ElevenLabs no puede obtener el `assignedAgentId`
- La llamada falla porque no hay configuración válida
- Nuestro endpoint nunca se ejecuta (por eso no hay logs)

### **✅ ERROR #4 SOLUCIONADO: Formato de respuesta corregido según documentación oficial**
**Status**: ✅ **FUNCIONANDO**

**Solución implementada**:
- ✅ Formato `conversation_initiation_client_data` implementado
- ✅ Endpoint responde Status 200 OK
- ✅ JSON completo con dynamic_variables y conversation_config_override
- ✅ Tamaño respuesta: 1270 bytes (respuesta completa)

**Headers configurados en ElevenLabs**:
- ✅ `ngrok-skip-browser-warning: true` configurado

**Respuesta actual**:
```json
{
  "type": "conversation_initiation_client_data",
  "dynamic_variables": {
    "customer_phone": "+34640182728",
    "call_id": "test123",
    "restaurant_name": "Pizza Posta",
    "business_type": "Italian Restaurant",
    "services_available": "delivery, takeaway, reservations",
    "current_time": "fecha/hora actual"
  },
  "conversation_config_override": {
    "agent": {
      "prompt": { "prompt": "Contexto específico Pizza Posta..." },
      "first_message": "¡Hola! Gracias por llamar a Pizza Posta...",
      "language": "es"
    }
  }
}
```

### **❌ ERROR #5 CRÍTICO: Configuración incompleta en ElevenLabs Dashboard**
**Síntoma**: Webhook funciona pero ElevenLabs no procesa los datos correctamente

**PASOS FALTANTES según video YouTube**:

#### **1. Configuración en el AGENTE ESPECÍFICO (no solo settings generales)**
**Ubicación**: `Conversational AI → [Tu Agente de Hostelería] → Security Tab`

**Acciones requeridas**:
- ✅ Habilitar "**Enable fetching of conversation initiation data**" 
- ✅ Especificar campos que se pueden sobrescribir:
  - `first_message` ✅
  - `system_prompt` ✅

#### **2. Configuración de Phone Numbers**
**Ubicación**: `Conversational AI Dashboard → Phone Numbers`

**Verificar**:
- ✅ Número Twilio importado: `+15715208541`
- ✅ Asignado al agente de Hostelería
- ✅ Configurado para "inbound calls"

#### **3. Webhook Configuration** 
**Ubicación**: `Settings → Webhooks`

**Configuración actual**:
- ✅ URL: `https://6295-95-19-36-141.ngrok-free.app/api/elevenlabs/client-data`
- ✅ Method: POST
- ✅ Header: `ngrok-skip-browser-warning: true`
- ✅ Tipo: "conversation initiation client data webhook"

### **❌ ERROR #6 NUEVO: agent_id viene undefined**
**Síntoma**: 
- ✅ Webhook es llamado por ElevenLabs
- ✅ Datos de llamada son correctos (caller_id, call_sid, called_number)
- ❌ `agent_id: undefined` en los logs
- ❌ Llamada sigue fallando

**Logs observados**:
```
📞 ElevenLabs phone call initiated: {
  caller_id: '+34640182728',
  agent_id: undefined,    ← PROBLEMA AQUÍ
  called_number: '+15715208541',
  call_sid: 'test123'
}
```

**Posibles causas**:
1. **Phone Number no asignado correctamente** al agente en ElevenLabs
2. **Agente no configurado** para recibir llamadas telefónicas
3. **Configuración incorrecta** en "Phone Numbers" section

**Verificaciones necesarias**:
- [ ] Phone Number `+15715208541` debe estar asignado al agente de Hostelería
- [ ] Agente debe estar habilitado para "inbound calls"
- [ ] Verificar que el agente específico está seleccionado en Phone Numbers config

---

## 🔧 **SOLUCIONES INTENTADAS**

### **✅ Solución #1: Configuración Nativa Twilio → ElevenLabs**
- ✅ Status: FUNCIONANDO
- ✅ Twilio envía llamadas a ElevenLabs correctamente

### **✅ Solución #2: Endpoint Client Data Simplificado**  
- ✅ Status: CÓDIGO CORRECTO
- ✅ Formato JSON válido cuando funciona localmente
- ❌ **BLOQUEADO POR**: ngrok browser warning

### **✅ Solución #3: Bypass ngrok warning (RESUELTO)**
**Solución**: Header `ngrok-skip-browser-warning: true`
**Resultado**: ✅ **FUNCIONANDO**
**Comando que funciona**:
```powershell
Invoke-WebRequest -Uri "https://6295-95-19-36-141.ngrok-free.app/api/elevenlabs/client-data" -Method POST -Headers @{"Content-Type"="application/json"; "ngrok-skip-browser-warning"="true"} -Body '{"test":"data"}'
```
**Status**: ✅ Endpoint accesible, devuelve JSON correcto

---

## 🚨 **PROBLEMA ACTUAL: INFRAESTRUCTURA**

**✅ PROBLEMA RESUELTO**: ngrok funciona correctamente con header bypass

**Configuración webhook ElevenLabs**:
- URL: `https://6295-95-19-36-141.ngrok-free.app/api/elevenlabs/client-data`
- Method: POST
- **IMPORTANTE**: ElevenLabs debe enviar header `ngrok-skip-browser-warning: true`

**⚠️ NOTA**: Si ElevenLabs no puede enviar este header automáticamente, necesitaremos una solución alternativa.

---

## 📁 **ARCHIVOS RELACIONADOS**

### **APIs Activas**:
1. `app/api/elevenlabs/client-data/route.ts` - ✅ CÓDIGO CORRECTO (bloqueado por ngrok)
2. `scripts/configure-twilio-webhook.js` - ✅ FUNCIONANDO

### **APIs Obsoletas**:
3-8. `app/api/twilio/*` - ❌ NO SE USAN

---

## 🎯 **PRÓXIMOS PASOS**

1. ✅ **COMPLETADO**: Endpoint con formato JSON correcto
2. 🚨 **BLOQUEADO**: Resolver problema de ngrok browser warning
3. 🧪 **PENDIENTE**: Probar llamada real después de resolver infraestructura
4. 📝 **PENDIENTE**: Documentar resultado final

---

## 🧪 **TESTING CHECKLIST**

- [x] Endpoint devuelve `{ "assignedAgentId": "..." }`
- [x] Status Code 200 OK localmente
- [x] Content-Type: application/json localmente
- [ ] **BLOQUEADO**: ElevenLabs puede acceder al webhook
- [ ] **PENDIENTE**: Llamada conecta con agente de Hostelería
- [ ] **PENDIENTE**: Se escucha voz de ElevenLabs
- [ ] **PENDIENTE**: Conversación funcional

---

## 🚨 **ESTADO ACTUAL**

**Configuración completada**:
- ✅ Twilio → ElevenLabs native integration
- ✅ Endpoint Next.js con formato correcto
- ❌ **BLOQUEADO**: ngrok impide que ElevenLabs acceda al webhook

**🔧 ACCIÓN REQUERIDA**: Resolver problema de túnel/infraestructura antes de continuar testing

---

**Última actualización**: Diciembre 2024  
**Estado**: 🚨 **BLOQUEADO** - Problema de infraestructura ngrok
