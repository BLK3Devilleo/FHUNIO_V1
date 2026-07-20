# 📓 BITÁCORA IA DE DON EMILIO (HANDOVER DOCUMENT)

Este documento contiene el historial arquitectónico, las convenciones de diseño y las reglas de integración del sistema **HUN (Build 4 Venezuela)**, escrito específicamente para mantener el contexto entre agentes de IA.

## 🏛️ ESTADO ARQUITECTÓNICO ACTUAL (V1.1)

### 1. Sistema de Integración (Next.js 16 + Docker Standalone)
- **Middleware:** Se debe mantener el nombre `middleware.ts`. Aunque Next.js 16 sugiere `proxy.ts`, el motor de Docker Standalone de Dokploy tiene un bug de compilación si se utiliza `proxy.ts`, resultando en un error 502 Bad Gateway.
- **Cookies y Sesión:** El middleware utiliza `@supabase/ssr` con `getAll()` y `setAll()`. Es seguro modificar `NextRequest.cookies` si se usa correctamente con el adaptador de Supabase.
- **Despliegue y Redes:** En el `Dockerfile`, es estrictamente obligatorio declarar `ENV HOSTNAME="0.0.0.0"`. Sin esto, Next.js se acopla solo a `localhost`, bloqueando a Traefik y generando 502.

### 2. Estándares UI/UX (El Estilo "Don Emilio")
- **Frameworks:** Tailwind CSS 4.x, Radix UI, Framer Motion.
- **Fondo General:** Fondo oscuro puro `#000000` con texturas de cuadrícula (grid) superpuestas en SVG (ej. `bg-[url('/grid.svg')]`) con opacidad al 20%.
- **Paneles (Glassmorphism):** Cajas con fondo `#111111` o translúcido, bordes `border-[#333333]`, y un sutil "glow" inferior.
- **Tipografía:** 
  - Títulos Impactantes: Fuentes potentes en uppercase (ej. ANTON).
  - Cuerpo/Lectura: Inter.
- **Micro-interacciones:** Botones con `active:scale-95`, bordes que se iluminan suavemente en hover, e iconos de estado dinámicos (Checkmarks verdes, spinners de carga minimalistas).

### 3. Flujo de Datos (Causas y Media)
1. Frontend valida Rate Limits.
2. Genera Presigned URL vía Cloudflare R2 (`/api/r2/presign`).
3. Sube archivo físicamente.
4. Inserta en Supabase (`causes` status: 'draft').
5. Dispara Webhook a n8n (`event: 'media_uploaded'`).
6. Si n8n falla o aprueba tras moderación, el estado se actualiza en DB.

## 📝 REGISTRO DE DECISIONES DE DISEÑO (ADRs)

*   **ADR-001 (Storage):** Next.js actúa como Router, pero NO procesa archivos. Archivos van directo a Cloudflare R2 vía presigned URLs.
*   **ADR-002 (Webhooks):** El webhook se dispara "fire-and-forget" después de guardar en DB para evitar bloquear la respuesta UI al usuario. Si falla, el archivo queda en draft (Pendiente).
*   **ADR-003 (Manejo de Errores Dokploy):** Cualquier modificación que toque el runtime Edge (Middleware) debe ser probada sin depender de variables locales.

---
*(Este archivo se actualizará conforme construyamos nuevas pantallas y lógicas)*
