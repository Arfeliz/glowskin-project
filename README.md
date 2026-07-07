# GlowSkin — Tienda Digital de Skincare

Aplicación web de comercio digital para la marca **GlowSkin**, especializada en skincare, bienestar y cuidado personal. Interfaz mobile-first con panel de administración integrado.

---

## Tabla de contenidos

- [Descripción](#descripción)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Instalación y puesta en marcha](#instalación-y-puesta-en-marcha)
- [Variables de entorno](#variables-de-entorno)
- [Páginas y funcionalidades](#páginas-y-funcionalidades)
- [Panel de administración](#panel-de-administración)
- [Redes sociales](#redes-sociales)
- [Notas de seguridad](#notas-de-seguridad)

---

## Descripción

GlowSkin es una tienda digital diseñada para dispositivos móviles con soporte responsivo para escritorio. Permite a los clientes explorar productos por categoría o búsqueda, ver detalles completos de cada artículo y armar un pedido que se envía directamente por WhatsApp. El administrador puede gestionar el catálogo completo desde un panel protegido con login.

---

## Stack tecnológico

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| React | ^19 | UI |
| TypeScript | — | Tipado estático |
| Vite | ^6 | Bundler / dev server |
| Tailwind CSS v4 | ^4.3 | Estilos utility-first |
| Material Symbols | Google Fonts | Iconografía |
| Libre Caslon Text / Plus Jakarta Sans | Google Fonts | Tipografía |

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| Node.js + Express | ^5 | API REST |
| TypeScript | — | Tipado estático |
| Supabase JS | ^2 | Base de datos / Auth |
| CORS | ^2.8 | Configuración de orígenes |
| dotenv | ^17 | Variables de entorno |

---

## Estructura del proyecto

```
glowskin-project/
├── glowskin-frontend/          # Aplicación React
│   └── src/
│       ├── components/
│       │   ├── AdminPage.tsx           # Panel de control (login + dashboard)
│       │   ├── AdminProductEditPage.tsx# Editor completo de producto
│       │   ├── BottomNav.tsx           # Navegación inferior móvil
│       │   ├── CartSidebar.tsx         # Sidebar de carrito
│       │   ├── CategoriesPage.tsx      # Vista de categorías
│       │   ├── Filters.tsx             # Filtros por categoría
│       │   ├── HeroBanner.tsx          # Banner principal
│       │   ├── ProductCard.tsx         # Tarjeta de producto
│       │   ├── ProductDetailPage.tsx   # Detalle de producto
│       │   ├── WhatsAppButton.tsx      # FAB de WhatsApp
│       │   └── WishlistPage.tsx        # Mi Lista / carrito completo
│       ├── context/
│       │   └── CartContext.tsx         # Estado global del carrito
│       ├── services/
│       │   └── products.ts             # Tipos + llamadas a la API
│       ├── App.tsx                     # Enrutamiento por estado de página
│       ├── main.tsx                    # Entry point
│       └── index.css                   # Estilos globales
│
└── glowskin-backend/           # API Express
    └── src/
        ├── config/             # Configuración (Supabase, etc.)
        ├── controllers/        # Lógica de negocio
        └── routes/             # Definición de rutas
```

---

## Instalación y puesta en marcha

### Requisitos previos
- Node.js >= 18
- npm >= 9

### Frontend

```bash
cd glowskin-frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

### Backend

```bash
cd glowskin-backend
npm install
# Crear archivo .env con las variables necesarias (ver sección Variables de entorno)
npm run dev
```

La API estará disponible en `http://localhost:3001`.

### Build de producción (frontend)

```bash
cd glowskin-frontend
npm run build
npm run preview
```

---

## Variables de entorno

### Frontend — `glowskin-frontend/.env`

```env
VITE_API_URL=http://localhost:3001/api
```

### Backend — `glowskin-backend/.env`

```env
PORT=3001
SUPABASE_URL=https://<tu-proyecto>.supabase.co
SUPABASE_ANON_KEY=<tu-anon-key>
```

---

## Páginas y funcionalidades

### 🏠 Home (`/`)
- Hero banner con llamada a la acción
- **Buscador** por nombre o código de producto (barra siempre visible + overlay desde la lupa en el header)
- **Filtros** por categoría (se ocultan durante búsqueda activa)
- Grid responsivo de productos: `2 col` móvil → `3 col` tablet → `4 col` desktop
- Botón `+` en cada tarjeta agrega al carrito; clic en la tarjeta abre el detalle

### 📁 Categorías
- Grid de tarjetas visuales con imagen de fondo y overlay
- Responsivo: `1 col` → `2 col` → `3 col`
- Al seleccionar una categoría navega al home con ese filtro activo

### 🛍️ Detalle de producto
- Hero con imagen de pantalla completa + botón de retroceso
- Badge de categoría, valoración, nombre y precio
- **Acordeones** editables desde el admin:
  - Beneficios (descripción + puntos destacados)
  - Ingredientes Clave (tarjetas con nombre y descripción)
  - Modo de Uso (pasos numerados)
- Carrusel de productos relacionados
- Barra inferior fija: selector de cantidad + "Añadir a mi lista"

### ❤️ Mi Lista
- Vista completa del carrito con imagen, nombre, precio unitario y total
- Control de cantidad por producto (+ / −) y eliminar
- Resumen del pedido: subtotal, envío gratis, total
- Botón **"Generar Pedido por WhatsApp"** que abre una conversación pre-cargada con el detalle del pedido

### 🔍 Búsqueda
- Barra persistente en el home
- Overlay de búsqueda desde el ícono de lupa en el header (cierra al hacer clic fuera o presionar Escape/Enter)
- Busca por nombre o ID del producto
- Muestra contador de resultados en tiempo real
- Estado vacío con opción de limpiar búsqueda

---

## Panel de administración

### Acceso
El panel **no aparece en la navegación pública**. Se accede de dos formas:

1. **Atajo de teclado**: escribir `/admin` en cualquier pantalla (sin estar en un campo de texto)
2. **Enlace en el footer** (desktop): enlace discreto "Admin" junto al copyright

### Login
- Usuario: `admin@glowskin.com`
- Contraseña: `gloowskin2025`
- Toggle de visibilidad en el campo de contraseña
- El dashboard queda borroso e inactivo hasta autenticarse

> ⚠️ **IMPORTANTE**: Estas son credenciales de demostración en el frontend. Antes de poner en producción, implementar autenticación real con el backend (JWT, Supabase Auth, etc.).

### Dashboard — Pestaña Resumen
- Ventas totales del mes
- Conteo de pedidos y productos activos
- Alerta automática de stock crítico (≤ 3 unidades) con enlace al inventario
- Carrusel de productos populares (clic abre el editor)

### Inventario — Pestaña Inventario
- Lista completa con imagen, nombre, categoría, precio y badge de stock (verde/amarillo/rojo)
- **Botón Editar (✏️)**: abre la página de edición completa del producto
- **Botón Eliminar (🗑️)**: requiere confirmación en dos pasos
- **Botón "+ Nuevo"**: abre el editor para crear un producto
- Chips de recuento por categoría

### Editor de producto (página completa)
Accesible al pulsar ✏️ en el inventario. Permite editar **todos los datos** que el cliente ve en la página de detalle:

| Campo | Descripción |
|---|---|
| Nombre | Texto libre |
| Precio | Número decimal |
| Stock | Unidades disponibles |
| Categoría | Selector: Skincare, Cuidado Corporal, Aromas y Velas, Suplementos, Cuidado Masculino |
| URL de imagen | Preview en tiempo real |
| Alt | Texto alternativo (accesibilidad) |
| Descripción de beneficios | Textarea libre |
| Puntos destacados | Lista editable con añadir/eliminar |
| Ingredientes Clave | Pares nombre + descripción, añadir/eliminar |
| Pasos de uso | Lista ordenada, añadir/eliminar |

Los cambios se sincronizan inmediatamente en toda la tienda al guardar.

### Configuración — Pestaña Config
- **WhatsApp**: editar el enlace de contacto (campo editable con toggle)
- **Redes sociales**: Instagram y TikTok
- Botón de cerrar sesión

---

## Redes sociales

| Red | Handle | URL |
|---|---|---|
| WhatsApp | — | https://wa.me/message/P7BWJKUAM2AEP1 |
| Instagram | @gloowskin1 | https://www.instagram.com/gloowskin1/ |
| TikTok | @gloowskin2 | https://www.tiktok.com/@gloowskin2 |

---

## Notas de seguridad

- Las credenciales de admin están hardcodeadas en el frontend **solo para prototipado**. En producción deben gestionarse mediante el backend con autenticación segura (tokens JWT, Supabase Auth, etc.).
- Los datos del catálogo viven en el estado de React (en memoria). Para persistencia real, conectar los endpoints del backend con Supabase.
- El backend incluye configuración de CORS; ajustar los orígenes permitidos antes de desplegar.

---

*© 2025 GlowSkin · Tienda digital · Todos los derechos reservados.*
