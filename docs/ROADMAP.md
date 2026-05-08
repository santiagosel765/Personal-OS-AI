# ROADMAP.md — Personal OS AI

Plan de evolución del producto. **No es un compromiso de fechas**, es el orden y los entregables. La división por fases es la misma que `MIGRATION_PLAN.md` para que se pueda navegar entre ambos.

---

## Visión por horizonte

| Horizonte | Foco | Estado |
|---|---|---|
| Corto plazo | MVP financiero estable, captura por IA mock, persistencia local | en progreso (demo visual) |
| Medio plazo | Backend NestJS, DB, IA real | planificado |
| Largo plazo | Salud, agente, multiusuario | aspiracional |

---

## Fase 0 — Auditoría y documentación *(esta entrega)*

**Objetivo:** alinear contexto, dejar la base documental, no romper nada.

Entregables:
- [`CLAUDE.md`](../CLAUDE.md).
- Carpeta `docs/` con: `PROJECT_CONTEXT`, `PRODUCT_SPEC`, `ARCHITECTURE`, `UI_GUIDELINES`, `AI_STRATEGY`, `FINANCIAL_CONTEXT`, `ROADMAP`, `WORKING_RULES`, `AUDIT_GOOGLE_DEMO`, `MIGRATION_PLAN`.

Criterios de éxito:
- Cualquier persona (o Claude) puede entrar al repo y entender el producto en 15 minutos.
- Cero cambios en código.

---

## Fase 1 — Estabilizar la demo Vite

**Objetivo:** que la demo actual sea base sólida sin migrar.

Entregables:
- Tipos consistentes en `src/types.ts` (revisar uniones, estados, IDs).
- `mockData.ts` alineado al `FINANCIAL_CONTEXT.md`.
- Bug fix conocido: `AccountDetailView` filtra `t.account === accountId` pero los mock transactions usan **nombres** (`"BI"`) en lugar de IDs (`"bi"`). Decidir un único contrato.
- Cifras del Dashboard derivadas de `mockData` en lugar de hardcodeadas.
- ESLint + Prettier ligeros, configurados para no pelearse con el estilo actual.
- `npm run lint` (`tsc --noEmit`) verde.
- README actualizado para aclarar que es demo y enlazar `docs/`.

Fuera de alcance: persistencia, backend, IA real.

---

## Fase 2 — Tipos y modelo de dominio

**Objetivo:** preparar la base de tipos compartibles para frontend y futuro backend.

Entregables:
- Reorganizar `src/types.ts` en archivos por entidad (`types/account.ts`, `types/transaction.ts`, etc.) **sin** moverlo todavía a un package.
- Introducir Zod schemas en `src/schemas/` espejo de los tipos.
- Catálogos: categorías, métodos, monedas (centralizados).
- Helper `lib/finance.ts` con funciones puras: `computeAvailable`, `sumDebtQuotas`, `weeklyBudgetProgress`.
- Tests con Vitest **solo** para los helpers financieros.

Fuera de alcance: persistencia.

---

## Fase 3 — Crear monorepo

**Objetivo:** preparar el terreno físico para `apps/web`, `apps/api`, `packages/db`, `packages/shared`. **Sin** mover código todavía.

Entregables:
- `pnpm-workspace.yaml`.
- `turbo.json`.
- Scripts raíz (`build`, `dev`, `lint`, `test`).
- Carpetas vacías o stubs para `apps/api`, `packages/db`, `packages/shared`.
- La app actual sigue corriendo desde la raíz mientras se planifica el corte.

Decisión a confirmar: ¿movemos el código actual a `apps/web` en esta misma fase o en la siguiente?

---

## Fase 4 — Migrar UI a Next.js

**Objetivo:** mover la demo a Next.js App Router en `apps/web`.

Entregables:
- `apps/web` con Next.js 14/15, mismo Tailwind y look.
- Páginas espejo de la demo: `/`, `/accounts`, `/accounts/[id]`, `/transactions`, `/debts`, `/cards`, `/goals`, `/events`, `/register`, `/settings`.
- Componentes compartidos en `apps/web/components/` (mantener el frame `max-w-md` y bottom nav).
- Estado global mínimo (Zustand o Context) para datos mock por ahora.
- Build estático funciona. Lighthouse mobile aceptable.

Fuera de alcance: backend.

---

## Fase 5 — Crear backend NestJS

**Objetivo:** levantar `apps/api` con módulos base y DB.

Entregables:
- NestJS con módulos: `auth`, `users`, `accounts`, `transactions`, `debts`, `cards`, `goals`, `events`, `audit`.
- Prisma schema en `packages/db` con las entidades de `ARCHITECTURE.md` §5.
- Auth JWT (login + refresh).
- Helmet, CORS, rate limit, validación con `class-validator`.
- Migrations + seed con datos de Selvin.
- `docker-compose.yml` con Postgres.
- Tests de smoke (login, crear cuenta, crear transacción).

Fuera de alcance: IA, salud, agente.

---

## Fase 6 — Conectar frontend con API

**Objetivo:** que `apps/web` deje de leer `mockData` y empiece a leer la API real.

Entregables:
- Cliente HTTP (axios o fetch wrapper) con manejo de tokens y refresh.
- `packages/shared` con tipos y schemas Zod consumidos por web y api.
- Pantallas críticas conectadas: Dashboard, Accounts, Transactions, Debts, Cards, Goals, Events.
- Loading states, error states, optimistic updates donde tenga sentido.
- Auth flow completo en frontend.

Fuera de alcance: IA real.

---

## Fase 7 — IA mock (parser heurístico)

**Objetivo:** sustituir el `setTimeout` mock de `QuickRegister` por un parser real determinístico.

Entregables:
- Módulo `ai` en `apps/api` con endpoints `POST /ai/entries`, `GET /ai/entries/:id`, `POST /ai/entries/:id/confirm`, `POST /ai/entries/:id/discard`.
- Parser heurístico (regex + diccionarios) en `packages/shared/utils/parser`.
- `LifeEntry` y `ParsedRecord` persistidos en DB.
- Frontend usa el endpoint y muestra confianza, campos editables y faltantes.
- Métricas básicas: % cubierto por parser sin LLM.

Casos cubiertos: 1, 2, parciales 5 y 6 del `PRODUCT_SPEC.md`.

---

## Fase 8 — IA real (LLM)

**Objetivo:** activar LLM solo para los casos que el parser no resuelve.

Entregables:
- Integración con proveedor (Gemini / Anthropic / OpenAI — decidir en su momento).
- `GEMINI_API_KEY`/equivalente solo en backend.
- Prompt + few-shot estables, prompt caching, schema JSON validado por Zod.
- Cache por `rawText` normalizado.
- Observabilidad de tokens y costo.
- Cobertura de casos 3 y 4 del `PRODUCT_SPEC.md`.

---

## Fase 9 — Snapshots y reportes

**Objetivo:** que el agente y los reports trabajen sobre datos comprimidos.

Entregables:
- Job que genera `Snapshot` semanal y mensual.
- Endpoint para consultar snapshots.
- Vista "Resumen" en frontend (semanal/mensual).

---

## Fase 10 — Salud, hábitos y agente

**Objetivo:** abrir las verticales no financieras una vez que la base aguanta.

Entregables (en este orden, una por release):
- Nutrición (registrar comidas, calorías estimadas).
- Entrenamientos (workouts, ejercicios, pesos, RPE).
- Hábitos (tracking simple).
- Agente: briefings semanales, alertas proactivas, sugerencias de aporte a metas.

---

## Fase 11 — Producto

**Objetivo:** dejar de ser solo "para Selvin".

Entregables:
- Multiusuario real (multi-tenant por `userId` ya en cada tabla; sumar onboarding y facturación más adelante).
- Wearables (Garmin primero).
- Mobile app dedicada o PWA mejorada.
- Pricing y plan de lanzamiento.

---

## Riesgos transversales

- **Sobre-construcción.** Riesgo principal. Cada fase debe entregar valor y ser cortable.
- **Bloat de tokens.** Mitigado por parser primero + snapshots + caching.
- **Pérdida del look mobile-first.** Mitigado por `UI_GUIDELINES.md`.
- **Datos sensibles.** Mitigado por separación cliente/server, no enviar PII al LLM si no es necesario.
- **Dependencia de un solo proveedor de IA.** Diseñar el módulo `ai` con interfaz para poder cambiarlo.
