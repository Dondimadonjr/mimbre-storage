# Pruebas manuales - Raíz y Mimbre

Usar este checklist antes de entregar cambios o antes de una entrega al cliente.

## Preparación

- [ ] Ejecutar `npm run lint`.
- [ ] Ejecutar `npx tsc --noEmit`.
- [ ] Ejecutar `npm run build`.
- [ ] Revisar `git status --short`.
- [ ] Confirmar que las variables de entorno están configuradas.

## Home pública

- [ ] Abrir la home en desktop.
- [ ] Abrir la home en mobile.
- [ ] Revisar header normal.
- [ ] Revisar header con scroll/shrink.
- [ ] Abrir y cerrar menú mobile.
- [ ] Probar ancla Inicio.
- [ ] Probar ancla Productos.
- [ ] Probar ancla Servicios.
- [ ] Probar ancla Nosotros.
- [ ] Probar ancla Contacto.
- [ ] Revisar Hero.
- [ ] Revisar Categorías.
- [ ] Revisar Nuestro oficio.
- [ ] Revisar Servicios.
- [ ] Revisar Contacto.
- [ ] Revisar Footer.

## Catálogo

- [ ] Revisar carga de productos.
- [ ] Buscar por nombre.
- [ ] Buscar por texto de descripción.
- [ ] Cambiar orden.
- [ ] Filtrar por categoría.
- [ ] Quitar filtro de categoría.
- [ ] Revisar empty state con búsqueda sin resultados.
- [ ] Revisar ProductCard en desktop.
- [ ] Revisar ProductCard en mobile.
- [ ] Agregar producto al carrito.
- [ ] Abrir WhatsApp desde una card.
- [ ] Confirmar stock visual.

## Detalle de producto

- [ ] Abrir un producto desde catálogo.
- [ ] Revisar title/metadata en DevTools.
- [ ] Revisar imagen.
- [ ] Revisar precio.
- [ ] Revisar descripción.
- [ ] Revisar stock/disponibilidad.
- [ ] Aumentar cantidad sin superar stock.
- [ ] Agregar al carrito.
- [ ] Abrir WhatsApp y confirmar que el link no contiene `undefined`.
- [ ] Revisar productos relacionados.
- [ ] Probar una URL inexistente y confirmar que no rompe la app.

## Carrito

- [ ] Agregar producto desde catálogo.
- [ ] Confirmar badge del header.
- [ ] Abrir drawer del carrito.
- [ ] Cambiar cantidad con `+`.
- [ ] Cambiar cantidad con `-`.
- [ ] Eliminar producto.
- [ ] Confirmar que el badge se actualiza.
- [ ] Ir a `/carrito`.
- [ ] Vaciar carrito.
- [ ] Recargar página y confirmar persistencia correcta.
- [ ] Confirmar total correcto.
- [ ] Probar botón checkout.

## Checkout y Webpay integración

- [ ] Agregar producto con stock.
- [ ] Ir a checkout.
- [ ] Completar nombre.
- [ ] Completar email.
- [ ] Completar teléfono.
- [ ] Completar dirección.
- [ ] Completar comuna/región si corresponde.
- [ ] Presionar `Ir a pagar con Webpay`.
- [ ] Confirmar redirección a Webpay integración.
- [ ] Volver con flecha atrás y confirmar que el carrito no se pierde.
- [ ] Anular compra desde Webpay y confirmar `Pago No Procesado`.
- [ ] Confirmar que el carrito se conserva si el pago no fue aprobado.

## Tarjetas Webpay integración

Estas tarjetas están documentadas para ambiente de integración. No usarlas en producción real.

| Caso | Tarjeta | CVV | Expiración |
| --- | --- | --- | --- |
| Compra aprobada | `4051885600446623` | `123` | `12/25` |
| Compra rechazada | `4051885600446631` | `123` | `12/25` |

## Pago aprobado

- [ ] Hacer compra aprobada con tarjeta de integración.
- [ ] Confirmar que aparece `Compra Exitosa`.
- [ ] Confirmar que el carrito se vacía solo después del pago aprobado.
- [ ] Confirmar que la orden queda `pagado`.
- [ ] Confirmar que el stock baja una sola vez.
- [ ] Recargar resultado y confirmar que no descuenta stock de nuevo.
- [ ] Confirmar que el pedido aparece en admin.

## Correos

- [ ] Confirmar correo al dueño después de pago aprobado.
- [ ] Confirmar correo al cliente después de pago aprobado.
- [ ] Confirmar que no se envían correos si el pago falla.
- [ ] Confirmar que no se duplican correos al recargar resultado.

## Admin

- [ ] Abrir `/panel-rm` sin sesión y confirmar redirect a `/panel-rm/login`.
- [ ] Abrir `/admin` y `/admin/login` y confirmar que no muestran el login real.
- [ ] Iniciar sesión con usuario administrador.
- [ ] Revisar dashboard desktop.
- [ ] Revisar dashboard mobile.
- [ ] Revisar métricas.
- [ ] Revisar listado de productos.
- [ ] Crear producto de prueba si corresponde.
- [ ] Editar producto si corresponde.
- [ ] Revisar pedidos.
- [ ] Filtrar pedidos por estado.
- [ ] Abrir detalle de pedido pagado.
- [ ] Abrir detalle de pedido pendiente/rechazado.
- [ ] Copiar resumen de pedido.
- [ ] Abrir WhatsApp desde pedido con teléfono.
- [ ] Abrir email desde pedido con correo.

## SEO y legales

- [ ] Abrir `/sitemap.xml`.
- [ ] Confirmar que incluye home, productos, FAQ y legales.
- [ ] Confirmar que incluye productos dinámicos disponibles.
- [ ] Abrir `/robots.txt`.
- [ ] Confirmar que bloquea `/admin`, `/panel-rm`, `/api`, `/carrito` y rutas de pago.
- [ ] Abrir `/politica-privacidad`.
- [ ] Abrir `/terminos`.
- [ ] Abrir `/cambios-devoluciones`.
- [ ] Abrir `/faq`.

## PWA básica

- [ ] Abrir `/manifest.webmanifest`.
- [ ] Confirmar name `Raíz y Mimbre`.
- [ ] Confirmar start_url `/`.
- [ ] Confirmar iconos 192 y 512.
- [ ] Probar opción de agregar a pantalla de inicio en mobile si está disponible.

## Cierre

- [ ] Confirmar que no hay errores en consola del navegador durante flujos principales.
- [ ] Confirmar que no se muestran datos de prueba en la tienda pública.
- [ ] Confirmar que Webpay sigue en integración mientras no haya producción real.
- [ ] Confirmar que no se hizo commit sin revisión.
