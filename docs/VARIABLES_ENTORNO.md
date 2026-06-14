# Variables de entorno - Raíz y Mimbre

Este documento describe las variables necesarias para operar el sitio. No contiene claves privadas reales.

## Resumen

Las variables se configuran en:

- Local: `.env.local`
- Producción: Vercel Project Settings > Environment Variables

No se deben subir valores secretos al repositorio.

## Variables públicas

### NEXT_PUBLIC_SUPABASE_URL

- Uso: URL del proyecto Supabase.
- Tipo: pública.
- Dónde se configura: `.env.local` y Vercel.
- Valor recomendado actual: URL real del proyecto Supabase.
- Con dominio propio: no cambia.
- Con Webpay producción: no cambia.

### NEXT_PUBLIC_SUPABASE_ANON_KEY

- Uso: clave pública/anon para lectura pública y sesión del cliente.
- Tipo: pública.
- Dónde se configura: `.env.local` y Vercel.
- Valor recomendado actual: publishable/anon key de Supabase.
- Con dominio propio: no cambia.
- Con Webpay producción: no cambia.

### NEXT_PUBLIC_SITE_URL

- Uso: URL base pública usada por metadata, sitemap, robots y retorno Webpay.
- Tipo: pública.
- Dónde se configura: `.env.local` y Vercel.
- Valor recomendado actual: `https://mimbre-storage.vercel.app`
- Con dominio propio: cambiar al dominio final, por ejemplo `https://raizymimbre.cl`.
- Con Webpay producción: debe apuntar a la URL productiva real aceptada para retornos.

### NEXT_PUBLIC_WHATSAPP

- Uso: número usado para links de WhatsApp.
- Tipo: pública.
- Dónde se configura: `.env.local` y Vercel.
- Valor recomendado actual: número del negocio en formato internacional, sin `+`, espacios ni guiones.
- Con dominio propio: no cambia.
- Con Webpay producción: no cambia.

## Variables privadas Supabase

### SUPABASE_SERVICE_ROLE_KEY

- Uso: cliente servidor privilegiado para APIs, Webpay, validaciones y operaciones server-only.
- Tipo: privada.
- Dónde se configura: `.env.local` y Vercel.
- Valor recomendado actual: service role/secret key real de Supabase.
- Con dominio propio: no cambia.
- Con Webpay producción: no cambia.
- Importante: nunca usar en componentes cliente ni exponer en navegador.

## Variables Webpay

### TRANSBANK_ENVIRONMENT

- Uso: define si Webpay opera en integración o producción.
- Tipo: privada/servidor.
- Dónde se configura: `.env.local` y Vercel.
- Valor recomendado actual: `integration`
- Con dominio propio: no cambia por sí solo.
- Con Webpay producción: cambiar a `production`.

### TRANSBANK_COMMERCE_CODE

- Uso: código de comercio Webpay.
- Tipo: privada/servidor.
- Dónde se configura: `.env.local` y Vercel.
- Valor recomendado actual: código de integración o el entregado por Transbank para pruebas.
- Con dominio propio: no cambia por sí solo.
- Con Webpay producción: reemplazar por el código de comercio real.

### TRANSBANK_API_KEY

- Uso: llave API de Webpay.
- Tipo: privada/servidor.
- Dónde se configura: `.env.local` y Vercel.
- Valor recomendado actual: llave de integración o la entregada por Transbank para pruebas.
- Con dominio propio: no cambia por sí solo.
- Con Webpay producción: reemplazar por la llave API real.
- Importante: nunca exponer en cliente.

## Variables Resend

### RESEND_API_KEY

- Uso: envío de correos de pedidos pagados.
- Tipo: privada.
- Dónde se configura: `.env.local` y Vercel.
- Valor recomendado actual: API key real de Resend.
- Con dominio propio: revisar dominio verificado en Resend si se usará correo propio.
- Con Webpay producción: no cambia.

### STORE_NOTIFICATION_EMAIL

- Uso: correo del dueño/tienda que recibe notificación de pedido pagado.
- Tipo: privada operativa.
- Dónde se configura: `.env.local` y Vercel.
- Valor recomendado actual: correo del negocio.
- Con dominio propio: actualizar si se crea un correo con dominio propio.
- Con Webpay producción: no cambia.

### EMAIL_FROM_NAME

- Uso: nombre visible del remitente.
- Tipo: pública operativa.
- Dónde se configura: `.env.local` y Vercel.
- Valor recomendado actual: `Raíz y Mimbre`
- Con dominio propio: mantener o ajustar según marca final.
- Con Webpay producción: no cambia.

### EMAIL_FROM_ADDRESS

- Uso: dirección desde la cual Resend envía correos.
- Tipo: privada operativa.
- Dónde se configura: `.env.local` y Vercel.
- Valor recomendado actual: dirección verificada en Resend.
- Con dominio propio: cambiar a un remitente del dominio verificado, por ejemplo `pedidos@dominio.cl`.
- Con Webpay producción: no cambia.

## Checklist de seguridad

- [ ] No escribir claves reales en documentación.
- [ ] No subir `.env.local`.
- [ ] `SUPABASE_SERVICE_ROLE_KEY`, `TRANSBANK_API_KEY` y `RESEND_API_KEY` solo en servidor/Vercel.
- [ ] `NEXT_PUBLIC_*` puede estar en cliente, pero no debe contener secretos.
- [ ] Después de cambiar variables en Vercel, redeploy.
