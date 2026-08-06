# Conduit

Proyecto personal de **aprendizaje fullstack** (Node/NestJS, React/Next.js), construido partiendo de una base sólida como fullstack Senior en .NET. Es una implementación de [RealWorld](https://github.com/gothinkster/realworld) — un clon simplificado de Medium (artículos, perfiles, favoritos, comentarios, seguir usuarios) con spec de API fija y diseño de referencia ya resuelto.

- Spec oficial: https://github.com/gothinkster/realworld
- Demo de referencia (diseño replicado): https://demo.realworld.io

## Stack

| Capa | Tecnología |
|---|---|
| Backend | NestJS + TypeScript |
| Frontend | Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui |
| Base de datos | PostgreSQL |
| ORM | Prisma |
| Gestor de paquetes | pnpm (workspaces) |
| Infraestructura local | Docker + Docker Compose |
| Auth | JWT (access + refresh) con Passport.js |
| Testing | Jest + Supertest (backend), React Testing Library (frontend) |

## Estructura del repo

```
conduit/
├── apps/
│   ├── api/              # Backend NestJS
│   │   ├── prisma/       # Schema y migraciones
│   │   └── src/
│   └── web/               # Frontend Next.js
├── docker-compose.yml     # Postgres local
├── pnpm-workspace.yaml
└── package.json
```

## Requisitos previos

- Node.js 20+
- [pnpm](https://pnpm.io/) (versión fijada en `packageManager` dentro de `package.json`)
- Docker + Docker Compose

## Cómo levantar el proyecto en local

1. Clonar el repo e instalar dependencias desde la raíz:

   ```
   pnpm install
   ```

2. Levantar Postgres:

   ```
   docker compose up -d
   ```

3. Configurar las variables de entorno del backend: copiar `apps/api/.env.example` a `apps/api/.env`, completar `DATABASE_URL` con las credenciales del `docker-compose.yml`, y generar un valor random para `JWT_SECRET` (por ejemplo con `openssl rand -base64 48`).

4. Aplicar las migraciones de Prisma:

   ```
   pnpm --filter api exec prisma migrate dev
   ```

5. Levantar el backend (puerto `3000`):

   ```
   pnpm --filter api run start:dev
   ```

6. Levantar el frontend (puerto `3001`):

   ```
   pnpm --filter web run dev
   ```

## Estado del proyecto

En desarrollo activo, fase por fase.

- [x] Fase 0 — Setup y arquitectura
- [x] Fase 1 — Autenticación y modelo de Usuario
- [x] Fase 2 — Artículos (CRUD) + Tags
- [ ] Fase 3 — Relaciones sociales: Follow + Favoritos + Feed
- [ ] Fase 4 — Comentarios
- [ ] Fase 5 — Testing
- [ ] Fase 6 — Frontend completo
- [ ] Fase 7 — Roles y moderación (RBAC)
- [ ] Fase 8 — Concurrencia optimista
- [ ] Fase 9 — Tiempo real (WebSockets)
- [ ] Fase 10 — Pagos (Stripe test mode)
- [ ] Fase 11 — CI/CD y Deploy
