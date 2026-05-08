# Personal OS AI

Sistema operativo personal con IA: finanzas → salud → agente proactivo. Monorepo con frontend Next.js, backend NestJS, PostgreSQL via Prisma.

> Estado actual: **Fase 2** — base real del proyecto (monorepo + backend + frontend conectado a API). Ver [`docs/ROADMAP.md`](./docs/ROADMAP.md) y [`CLAUDE.md`](./CLAUDE.md).

## Estructura

```
personal-os/
  apps/
    web/                # Next.js 15 (App Router) — frontend mobile-first
    api/                # NestJS 10 — backend REST
  packages/
    db/                 # Prisma schema + cliente + seed
    shared/             # tipos/enums/helpers compartidos
  legacy/
    vite-demo/          # demo visual original (Vite+React 19) — referencia
  docs/                 # docs vivos del producto
  docker-compose.yml    # Postgres 16 (opcional, también funciona con instalación local)
  pnpm-workspace.yaml
  turbo.json
  package.json
  .env.example
```

## Prerrequisitos

- Node.js ≥ 20
- pnpm ≥ 9 (`npm i -g pnpm`)
- PostgreSQL 16+ (local o vía `docker compose up -d`)

## Setup desde cero

```bash
# 1. Instalar dependencias del monorepo
pnpm install

# 2. Configurar variables (copiar y editar)
cp .env.example .env
cp .env.example packages/db/.env       # Prisma lee DATABASE_URL desde aquí
cp .env.example apps/api/.env
echo 'NEXT_PUBLIC_API_URL="http://localhost:3001"' > apps/web/.env.local

# 3a. Postgres con Docker (recomendado)
docker compose up -d

# 3b. O usa tu Postgres local (asegúrate que la BD personal_os_dev exista)

# 4. Generar cliente Prisma + migrar + seed
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# 5. Levantar API + Web (paralelo)
pnpm dev
```

- API: http://localhost:3001
- Web: http://localhost:3000/dashboard
- Demo legacy (referencia visual): `pnpm demo:dev` → http://localhost:3100

## Endpoints disponibles (Fase 2)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | health check |
| GET | `/dashboard` | métricas + listas para el dashboard |
| GET | `/accounts` | cuentas |
| GET | `/debts` | deudas |
| GET | `/cards` | tarjetas |
| GET | `/goals` | metas |
| GET | `/transactions` | transacciones |

## Scripts root

```bash
pnpm dev          # web + api en paralelo
pnpm build        # build de todos los packages
pnpm lint         # tsc --noEmit en todos
pnpm db:generate  # prisma generate
pnpm db:migrate   # prisma migrate dev
pnpm db:seed      # seed con datos reales de Selvin
pnpm db:studio    # prisma studio
pnpm demo:dev     # demo Vite legacy (puerto 3100)
```

## Reglas duras

Ver [`CLAUDE.md`](./CLAUDE.md). Resumen: mobile-first, español/GTQ, dinero reservado nunca cuenta como disponible, IA confirma antes de guardar, no exponer keys de IA en frontend, no microservicios.
