# CRM GSST - Frontend

Frontend en **Next.js 14 (App Router) + TypeScript + Tailwind**, consumiendo el backend FastAPI de `crm-gsst-backend`.

## Requisitos previos

1. El backend debe estar corriendo en `http://127.0.0.1:8000` (ver README del backend).
2. **Importante:** el backend debe tener el middleware de CORS habilitado (ya incluido en la versión corregida de `main.py` de este entregable). Sin esto, el navegador bloqueará las peticiones del frontend.

## Instalación

```bash
cd crm-gsst-frontend
pnpm install     # o npm install / yarn install
cp .env.local.example .env.local
pnpm dev         # http://localhost:3000
```

Si usas otro puerto para el backend, ajusta `NEXT_PUBLIC_API_URL` en `.env.local`. Si el frontend corre en un puerto distinto a 3000, agrega ese origen a `CORS_ORIGINS` en el `.env` del backend.

## Estructura

```
app/
  login/               Pantalla de login (pública)
  (app)/               Rutas protegidas (requieren sesión)
    dashboard/
    empresas/
    usuarios/          Solo visible/accesible para rol "administrador"
    servicios/         Tabs: Catálogo / Contrataciones
    normas/
      [id]/historial/  Línea de tiempo de versiones de una norma
lib/
  api.ts               Cliente fetch con manejo de JWT y errores
  auth-context.tsx      Contexto de sesión (login/logout, persistida en localStorage)
  types.ts             Tipos que reflejan los schemas de Pydantic del backend
components/
  ui.tsx               Primitivas de formulario/tabla reutilizadas en todo el CRUD
  StatusBadge.tsx       Badge semáforo (vigente/derogada, pendiente/en_proceso/completado…)
```

## Notas de implementación

- **Autenticación:** el JWT se guarda en `localStorage`. El `empresa_id` del usuario (necesario para el rol "cliente") no viene en la respuesta de `/auth/login`, así que se decodifica del propio JWT en el cliente.
- **RBAC en el frontend:** el menú lateral y los botones de acción se ocultan según el rol, mismo esquema que ya aplica el backend. Esto es solo UX — el backend sigue siendo la única fuente de verdad para permisos.
- **Empresas:** el backend actualmente no expone `PATCH`/`DELETE` para empresas, así que el frontend solo permite crear y listar. Si agregas esos endpoints, la página está lista para extenderse.
- **Normas:** el formulario de edición usa `PUT`, que en el backend crea una nueva versión y la guarda en el historial — se le avisa al usuario en el propio modal.
