# 🧺 Mimbre Store - E-Commerce Profesional

Tienda online de artesanía en mimbre construida con **Next.js 16**, **TypeScript**, **Tailwind CSS**, **Supabase** y **Transbank Webpay Plus**.

## 📋 Tabla de Contenidos

- [Instalación Local](#instalación-local)
- [Configuración de Supabase](#configuración-de-supabase)
- [Configuración de Transbank](#configuración-de-transbank)
- [Guía de Uso](#guía-de-uso)
- [Deploy en Vercel](#deploy-en-vercel)
- [Pruebas](#pruebas)
- [Estructura del Proyecto](#estructura-del-proyecto)

---

## 🚀 Instalación Local

### 1. Clonar o descargar el proyecto

```bash
cd mimbre-store
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Copia el archivo `.env.local.example` a `.env.local`:

```bash
cp .env.local.example .env.local
```

Edita `.env.local` y reemplaza los valores:

```env
NEXT_PUBLIC_SUPABASE_URL=https://nydvvouuqpmuovqzceak.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_zQCtnVYlGdz5wgpV0BiPyw_4F2QwXrE
SUPABASE_SERVICE_ROLE_KEY=sb_publishable_zQCtnVYlGdz5wgpV0BiPyw_4F2QwXrE

TRANSBANK_COMMERCE_CODE=597020000540
TRANSBANK_API_KEY=22333EDF332D...
TRANSBANK_ENVIRONMENT=integration

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP=56912345678
```

### 4. Ejecutar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## ⚙️ Configuración de Supabase

### 1. Crear un Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva organización y proyecto
3. Copia la URL y la ANON KEY

### 2. Crear las Tablas

En el editor SQL de Supabase, ejecuta el contenido de `supabase.sql`:

```bash
# Copiar contenido de supabase.sql
# Pegar en SQL Editor de Supabase y ejecutar
```

Esto crea:
- `products` - Catálogo de productos
- `orders` - Órdenes de compra
- `order_items` - Items de cada orden
- `payments` - Registro de pagos
- RLS (Row Level Security) automático

### 3. Configurar Authentication

1. En Supabase, ve a **Authentication > Providers**
2. Habilita **Email** (con confirmación por email si deseas)
3. En **Settings**, configura:
   - **Site URL**: `http://localhost:3000` (desarrollo) o tu dominio (producción)
   - **Redirect URLs**: 
     - `http://localhost:3000/admin/login` (desarrollo)
     - `https://tudominio.com/admin/login` (producción)

### 4. Obtener Service Role Key

⚠️ **IMPORTANTE**: La Service Role Key es la clave privada del servidor. NUNCA la expongas.

1. Ve a **Settings > API**
2. Copia **service_role** key (es diferente de anon key)
3. Guárdala en `.env.local` como `SUPABASE_SERVICE_ROLE_KEY`

---

## 💳 Configuración de Transbank

### 1. Ambiente de Integración (Pruebas)

Para probar pagos SIN dinero real:

```env
TRANSBANK_COMMERCE_CODE=597020000540
TRANSBANK_API_KEY=22333EDF332D19B9CC711ECE140D7B1F8EA4144385D1D91169920536FFB92DA9
TRANSBANK_ENVIRONMENT=integration
```

Estos son datos de prueba de Transbank.

### 2. Tarjetas de Prueba

Usa estas tarjetas en el ambiente de integración:

| Situación | Tarjeta | CVC | Vencimiento |
|-----------|---------|-----|------------|
| Compra Aprobada | 4051885600446623 | 123 | 12/25 |
| Compra Rechazada | 4051885600446631 | 123 | 12/25 |

Contraseña: **123456**

### 3. Montos Especiales de Prueba

En integración, ciertos montos disparan respuestas automáticas:
- **$1000**: Transacción aprobada
- **$5000**: Transacción rechazada
- Usa montos entre $500 y $9.999.999

### 4. Cambiar a Producción

Cuando estés listo para aceptar pagos reales:

1. Obtén credenciales de Transbank
2. Actualiza `.env`:
   ```env
   TRANSBANK_COMMERCE_CODE=tu_codigo_comercio
   TRANSBANK_API_KEY=tu_api_key
   TRANSBANK_ENVIRONMENT=production
   ```
3. Deploya en Vercel

---

## 📖 Guía de Uso

### Como Cliente

1. **Navegar Productos**: Ve a la sección de productos, filtra por categoría, busca
2. **Agregar al Carrito**: Haz clic en "Agregar" o usa WhatsApp
3. **Ver Carrito**: Haz clic en el icono del carrito en el header
4. **Checkout**: Completa datos personales
5. **Pago**: Serás redirigido a Transbank
6. **Confirmación**: Recibirás email de confirmación

### Como Administrador

#### Login

1. Ve a `http://localhost:3000/admin/login`
2. Usa credenciales creadas en Supabase Authentication
3. Serás redirigido a `/admin`

#### Gestionar Productos

1. En la pestaña "Productos"
2. Click "+ Nuevo Producto"
3. Completa el formulario:
   - Nombre, descripción, precio, stock
   - Categoría (Canastas, Decoración, Accesorios, etc.)
   - URL de imagen
   - Marca como "Destacado" si es popular
   - Marca como "Disponible" si está en venta

#### Ver Órdenes

1. En la pestaña "Órdenes"
2. Ver estado: Pendiente, Pagado, Rechazado
3. Ver datos del cliente y total

---

## 🧪 Pruebas Localmente

### Probar Carrito

1. Abre [http://localhost:3000](http://localhost:3000)
2. Agrega productos al carrito
3. Verifica que se guarden en localStorage (abre DevTools > Application > localStorage)
4. Recarga la página - el carrito debe permanecer

### Probar Checkout

1. Ve a `/carrito`
2. Click "Proceder al Pago"
3. Completa formulario con datos válidos
4. Se envía a crear transacción

### Probar Pago Transbank

1. En checkout, verifica que se muestre el total correcto
2. El backend calcula el total de nuevo (seguridad)
3. Se crea orden en Supabase con status "pendiente"
4. Se redirige a Transbank

**Importante**: En integración, usa tarjetas de prueba (ver arriba).

### Probar Admin

1. Ve a `/admin/login`
2. Crea usuario en Supabase: **Authentication > Users > Add User**
3. Usa email + contraseña temporal
4. Login y crea/edita productos

---

## 🚀 Deploy en Vercel

### 1. Preparar Repositorio (Git)

```bash
git init
git add .
git commit -m "Initial commit: Mimbre Store"
git branch -M main
```

### 2. Subir a GitHub

```bash
git remote add origin https://github.com/tuusuario/mimbre-store.git
git push -u origin main
```

### 3. Crear Proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Login con GitHub
3. Click "New Project"
4. Selecciona tu repositorio "mimbre-store"
5. Click "Import"

### 4. Variables de Entorno en Vercel

En Vercel, ve a **Settings > Environment Variables** y agrega:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
TRANSBANK_COMMERCE_CODE=597020000540
TRANSBANK_API_KEY=22333EDF332D...
TRANSBANK_ENVIRONMENT=integration
NEXT_PUBLIC_SITE_URL=https://tudominio.com
NEXT_PUBLIC_WHATSAPP=56912345678
```

⚠️ **IMPORTANTE**: 
- `NEXT_PUBLIC_*` está permitido ver
- `SUPABASE_SERVICE_ROLE_KEY` es privada (no verla en el output)
- Vercel automáticamente no expone variables privadas

### 5. Deploy

1. Vercel automáticamente detecta Next.js
2. Configura construcción y deployment automático
3. Cada push a `main` redeploya

### 6. Actualizar Supabase

En Supabase, actualiza:
- **Authentication > Settings > Site URL**: `https://tudominio.com`
- **Authentication > Settings > Redirect URLs**:
  - `https://tudominio.com/admin/login`

---

## 📁 Estructura del Proyecto

```
mimbre-store/
├── app/
│   ├── layout.tsx              # Layout global
│   ├── page.tsx                # Home
│   ├── globals.css             # Estilos globales
│   ├── carrito/
│   │   └── page.tsx            # Página del carrito
│   ├── productos/
│   │   └── [id]/
│   │       └── page.tsx        # Detalle de producto
│   ├── pago/
│   │   ├── checkout/
│   │   │   └── page.tsx        # Formulario checkout
│   │   ├── retorno/
│   │   │   └── page.tsx        # Retorno de Transbank
│   │   └── resultado/
│   │       └── page.tsx        # Resultado del pago
│   ├── admin/
│   │   ├── page.tsx            # Panel admin
│   │   └── login/
│   │       └── page.tsx        # Login admin
│   └── api/
│       └── webpay/
│           ├── crear/
│           │   └── route.ts    # Crear transacción
│           └── confirmar/
│               └── route.ts    # Confirmar pago
│
├── components/
│   ├── Header.tsx              # Header sticky
│   ├── Hero.tsx                # Sección hero
│   ├── ProductCard.tsx         # Card de producto
│   ├── ProductsGrid.tsx        # Grid con filtros
│   ├── CartDrawer.tsx          # Drawer del carrito
│   ├── Footer.tsx              # Footer
│   ├── SectionTitle.tsx        # Título de sección
│   └── AdminProductForm.tsx    # Formulario de admin
│
├── lib/
│   ├── supabase.ts             # Cliente Supabase
│   ├── cart.ts                 # Lógica del carrito (localStorage)
│   ├── format.ts               # Funciones de formato
│   └── webpay.ts               # Integración Transbank (SERVIDOR)
│
├── types/
│   ├── product.ts              # Tipos de productos
│   ├── cart.ts                 # Tipos del carrito
│   └── order.ts                # Tipos de órdenes y pagos
│
├── public/
│   └── images/                 # Imágenes estáticas
│
├── .env.local.example          # Variables de entorno (ejemplo)
├── tailwind.config.ts          # Configuración Tailwind
├── tsconfig.json               # Configuración TypeScript
├── next.config.ts              # Configuración Next.js
├── package.json                # Dependencias
└── supabase.sql                # SQL para crear tablas
```

---

## 🔒 Seguridad

### No expongas estas claves:

❌ **NUNCA en el código**:
- `SUPABASE_SERVICE_ROLE_KEY`
- `TRANSBANK_API_KEY`

✅ **SOLO en .env.local** (local) o **Vercel Environment Variables** (producción)

### Backend Security:

1. Pagos creados y confirmados **solo en API routes**
2. Total recalculado en servidor (no confiar en frontend)
3. Service Role Key solo usada en rutas privadas
4. RLS en Supabase protege datos

### Cliente Security:

1. localStorage para carrito (datos públicos)
2. No hay datos sensibles expuestos
3. Validaciones tanto en cliente como servidor

---

## 📊 Guía de Pruebas Completa

### Checklist Antes del Deploy

- [ ] Instalar dependencias: `npm install`
- [ ] Configurar `.env.local` con credenciales
- [ ] Ejecutar `npm run dev`
- [ ] Navegar home (debe cargarse sin errores)
- [ ] Ver productos en grid (debe traer datos de Supabase)
- [ ] Agregar producto al carrito (verificar localStorage)
- [ ] Recargar página (carrito persiste)
- [ ] Ir a `/carrito` (mostrar items)
- [ ] Proceder a checkout (formulario válido)
- [ ] Usar tarjeta de prueba (4051885600446623)
- [ ] Completar pago (debe ir a resultado)
- [ ] Verificar orden en Supabase (status = pagado)
- [ ] Login en `/admin/login`
- [ ] Ver/crear/editar/eliminar productos
- [ ] Ver órdenes en panel

### Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| "Missing Supabase env" | `.env.local` incompleto | Completa todas las variables |
| "Carrito no persiste" | localStorage no configurado | Verifica navegador permite storage |
| "Error en Transbank" | Credenciales inválidas | Usa datos de prueba |
| "401 Unauthorized" | Service Role Key inválida | Copia de Supabase > Settings > API |
| "Admin no permite entrar" | No autenticado | Crea usuario en Supabase Auth |

---

## 📱 Características

✅ Catálogo de productos con filtros  
✅ Carrito persistente en localStorage  
✅ Checkout con validación  
✅ Integración Transbank Webpay Plus  
✅ Admin panel (crear/editar/eliminar)  
✅ Base de datos Supabase con RLS  
✅ Responsive (móvil, tablet, desktop)  
✅ Paleta cálida y artesanal  
✅ TypeScript + ESLint  
✅ Pronto para Vercel  

---

## 🎨 Personalización

### Cambiar Paleta de Colores

Edita `tailwind.config.ts`:

```ts
colors: {
  cream: '#FAF6F0',
  coffee: '#8B5E3C',
  'coffee-dark': '#6F472C',
  'text-dark': '#1F2A24',
  'text-secondary': '#5B655F',
}
```

### Agregar Más Categorías

En `components/AdminProductForm.tsx`:

```tsx
<option value="Nueva Categoría">Nueva Categoría</option>
```

### Modificar Regiones Enviadas

En `app/pago/checkout/page.tsx`, edita el select de región.

---

## 📞 Soporte

Para problemas:

1. Verifica `.env.local` está correcto
2. Revisa logs en terminal
3. Abre DevTools (F12) para ver errores
4. Verifica Supabase > Logs > API Logs

---

## 📄 Licencia

Proyecto personal para Mimbre Store. Todos los derechos reservados.

---

**¡A disfrutar de tu tienda online!** 🧺✨
