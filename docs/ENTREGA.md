# Entrega interna - Raíz y Mimbre

## Proyecto

**Raíz y Mimbre** es una tienda web artesanal construida con Next.js App Router, React, TypeScript, Tailwind CSS, Supabase, Webpay y Resend.

URL actual de producción:

https://mimbre-storage.vercel.app

## Estado actual

El proyecto se encuentra funcional para entrega en la URL actual de Vercel. Aún no tiene dominio propio y Webpay se mantiene en ambiente de integración para pruebas.

## Funcionalidades principales

- Home pública con secciones de marca, categorías, catálogo, oficio, servicios, contacto y footer.
- Catálogo público con búsqueda, filtros por categoría y ordenamiento.
- Detalle de producto con metadata dinámica, imagen, precio, stock, WhatsApp, carrito y relacionados.
- Carrito persistente en `localStorage`.
- Checkout con Webpay.
- Resultado de pago validado desde servidor.
- Descuento de stock después de pago aprobado.
- Correos de pedido pagado con Resend para cliente y dueño.
- Admin protegido server-side.
- Gestión de productos y visualización de pedidos.
- Detalle de pedidos con acciones rápidas.
- PWA básica para acceso rápido al admin.
- Páginas legales: privacidad, términos, cambios/devoluciones y FAQ.
- Sitemap dinámico con productos disponibles.
- Robots.txt con bloqueo de rutas privadas y transaccionales.

## Cuando se compre dominio propio

- Configurar el dominio en Vercel.
- Actualizar `NEXT_PUBLIC_SITE_URL` con el dominio final.
- Revisar metadata, sitemap y robots en producción.
- Configurar DNS según Vercel.
- Revisar correos de marca si cambia el dominio de envío.
- Probar links compartidos de home y productos.

## Cuando Webpay pase a producción

- Cambiar `TRANSBANK_ENVIRONMENT` a `production`.
- Configurar credenciales reales de Transbank en Vercel.
- Revisar que `NEXT_PUBLIC_SITE_URL` apunte al dominio final o URL productiva correcta.
- Realizar compra real de bajo monto según procedimiento de Transbank/cliente.
- Verificar orden pagada, stock descontado y correos enviados.
- No dejar credenciales de integración en producción real.

## Checklist antes de entregar al cliente

- [ ] `git status --short` revisado.
- [ ] `npm run lint` sin errores.
- [ ] `npx tsc --noEmit` sin errores.
- [ ] `npm run build` sin errores.
- [ ] Home revisada en desktop.
- [ ] Home revisada en mobile.
- [ ] Catálogo, filtros y búsqueda funcionando.
- [ ] Detalle de producto funcionando.
- [ ] Carrito funcionando.
- [ ] Checkout redirige a Webpay integración.
- [ ] Pago aprobado deja orden pagada.
- [ ] Pago rechazado/cancelado no vacía carrito.
- [ ] Correos llegan tras pago aprobado.
- [ ] Admin permite entrar solo al administrador.
- [ ] Sitemap y robots revisados.
- [ ] Páginas legales accesibles desde footer.
- [ ] Manifest PWA responde.

## Comandos básicos

```bash
npm run dev
npm run lint
npx tsc --noEmit
npm run build
git status --short
git push
```

## Nota de entrega

No hacer cambios directos en producción sin probar antes el build local. Para cambios de variables, usar Vercel Project Settings y no escribir secretos en archivos del repositorio.
