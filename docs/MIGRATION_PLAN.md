# MIGRATION_PLAN.md — Personal OS AI

Plan táctico para llevar la demo Vite (Google AI Studio) hasta el monolito modular en monorepo descrito en [`ARCHITECTURE.md`](./ARCHITECTURE.md). **No se ejecuta nada hasta acordarlo fase por fase.**

> Regla de oro: **cada fase es entregable y reversible**. Nunca dejamos el repo "a medias" entre fases.

---

## Fase 0 — Auditoría y documentación *(esta entrega)*

**Objetivo:** establecer contexto y reglas, sin tocar código.

**Cambios:**
- Crear `CLAUDE.md` (raíz).
- Crear `docs/` con 10 documentos.
- Cero modificaciones a `src/`, `package.json`, `vite.config.ts`, `tsconfig.json`.

**Done cuando:**
- Todos los docs existen y son consistentes.
- `npm install && npm run dev` sigue funcionando.

**Riesgos:** ninguno relevante.

---

## Fase 1 — Estabilizar la demo Vite

**Objetivo:** dejar la demo limpia y coherente para servir de base sólida.

**Cambios propuestos (todos sujetos a confirmación):**
1. **Limpieza de scaffolding:**
   - `package.json`: `name` → `personal-os-web` (o `personal-os` por ahora). Quitar dependencias no usadas (`express`, `dotenv`, `tsx`, `@types/express`) **si confirmas** que no se necesitan en este punto.
   - `index.html`: title → "Personal OS AI".
   - `App.tsx`: eliminar el license header duplicado.
2. **Coherencia de datos:**
   - Decidir contrato: `Transaction.account` será **siempre** el `id` de la cuenta (`'bi'`, `'bac'`, ...) y se renderiza el `name` desde el catálogo. Ajustar `mockData.ts` y los componentes que muestran el nombre.
   - Agregar `accountToId?: string` a `Transaction` para soportar transferencias.
3. **Cifras dinámicas:**
   - `Dashboard.tsx`: deducir Q5,200, Q4,300, Q5,601.96, presupuesto semanal, etc., desde `mockData` con helpers en `src/lib/finance.ts` (nuevo).
   - `AccountsView.tsx`: "Total Capital Real" calculado.
   - `TransactionsView.tsx`: "Q828.00 de Q1,000" calculado.
4. **Fecha:** un único helper `getToday()` que devuelve la fecha base actual (`2026-05-08`). El Dashboard la usa.
5. **Lint y formato:**
   - Añadir ESLint mínimo (presets típicos para React + TS).
   - Añadir Prettier con configuración alineada al estilo actual.
   - `npm run lint` ejecuta `eslint` + `tsc --noEmit`.
6. **README:** actualizar para que aclare que es demo y enlace a `docs/`.

**Done cuando:**
- `npm run lint` verde.
- Recargar la app no muestra cifras desincronizadas con `mockData`.
- `AccountDetailView` para `bi` muestra sus transacciones.
- README explica el estado actual y enlaza a `docs/`.

**Fuera de alcance:** persistencia, backend, IA real, monorepo.

---

## Fase 2 — Tipos y modelo de dominio

**Objetivo:** preparar la base de tipos para que sea reusable cuando exista monorepo.

**Cambios:**
1. Dividir `src/types.ts` en `src/types/{account,transaction,debt,card,goal,event,index}.ts`.
2. Introducir Zod schemas espejo en `src/schemas/`.
3. Agregar entidades futuras (sin uso aún): `User`, `LifeEntry`, `ParsedRecord`, `EventLog`, `Snapshot`.
4. `src/lib/finance.ts` con funciones puras y unit tests con Vitest:
   - `computeAvailable(accounts, pendingIncome, pendingExpenses)`.
   - `sumDebtQuotas(debts)`.
   - `weeklyBudgetProgress(transactions, target)`.
   - `goalSuggestion(goal, today)`.
5. Catálogos centralizados (categorías, métodos, monedas).

**Done cuando:**
- Vistas usan helpers en lugar de cálculos inline.
- Tests unitarios verdes (>= 5 helpers).
- Tipos en archivos separados, índice limpio.

**Fuera de alcance:** mover archivos a un package.

---

## Fase 3 — Crear monorepo

**Objetivo:** convertir el repo en monorepo pnpm + Turbo, **sin** romper la app.

**Cambios:**
1. `pnpm-workspace.yaml`:
   ```yaml
   packages:
     - "apps/*"
     - "packages/*"
   ```
2. `turbo.json` con pipelines `build`, `dev`, `lint`, `test`, `typecheck`.
3. Crear carpetas:
   ```
   apps/
     web/     # vacía por ahora, pero con package.json placeholder
     api/     # vacía
   packages/
     db/      # vacía
     shared/  # vacía
   ```
4. Mantener la app actual en raíz hasta la Fase 4.
5. Actualizar `package.json` raíz para ser solo el manifiesto del monorepo (devDeps comunes, scripts agregados con Turbo).

**Decisión a tomar:**
- ¿Movemos `src/` a `apps/web/` ya en esta fase, o lo dejamos para la Fase 4 cuando se introduce Next.js?
- Recomendación: **dejarlo en raíz** durante esta fase para no encadenar dos cambios grandes; mover en Fase 4.

**Done cuando:**
- `pnpm install` desde raíz funciona.
- `pnpm dev` levanta la app.
- Carpetas y archivos del monorepo existen.

**Fuera de alcance:** introducir Next.js, NestJS, Prisma.

---

## Fase 4 — Migrar UI a Next.js (`apps/web`)

**Objetivo:** mover el frontend a Next.js App Router preservando la UX.

**Cambios:**
1. Crear `apps/web` con `next@14/15`, TS, Tailwind 4 (configurado para Next).
2. Estructura:
   ```
   apps/web/
     app/
       layout.tsx
       page.tsx                  # Dashboard
       accounts/page.tsx
       accounts/[id]/page.tsx
       transactions/page.tsx
       debts/page.tsx
       cards/page.tsx
       goals/page.tsx
       events/page.tsx
       register/page.tsx
       settings/page.tsx
     components/                 # Header, BottomNav, MetricCard, Cards, ...
     lib/
     styles/globals.css
   ```
3. Migrar componentes uno a uno. Mantener `motion/react`, `lucide-react` y la paleta. Conservar `max-w-md` y la bottom nav.
4. Estado global mínimo (Zustand) para datos mock.
5. Eliminar Vite del repo (`vite.config.ts`, `index.html` de Vite, scripts) **solo cuando** Next.js esté funcional.
6. Verificar build estático y Lighthouse mobile.

**Done cuando:**
- Todas las pantallas de la demo existen en Next.js con paridad visual.
- `pnpm --filter web dev` funciona.
- `pnpm --filter web build` funciona.

**Fuera de alcance:** backend, IA real, persistencia.

---

## Fase 5 — Backend NestJS (`apps/api`)

**Objetivo:** API funcional con auth y CRUD básicos sobre Postgres.

**Cambios:**
1. Crear `apps/api` con NestJS.
2. Crear `packages/db` con Prisma:
   - `schema.prisma` con entidades de `ARCHITECTURE.md` §5.
   - Cliente exportado desde `packages/db/src/index.ts`.
3. Módulos NestJS: `auth`, `users`, `accounts`, `transactions`, `categories`, `debts`, `cards`, `goals`, `events`, `audit`.
4. Auth JWT (access + refresh), Argon2 para passwords.
5. `class-validator` en DTOs, transformación con `class-transformer`.
6. `Helmet`, CORS por env, `@nestjs/throttler`.
7. `EventLog` automático vía interceptor o servicio `audit`.
8. `docker-compose.yml` con Postgres y comandos `pnpm db:migrate`, `pnpm db:seed`.
9. Seed inicial con datos de Selvin (espejo de `FINANCIAL_CONTEXT.md`).
10. Tests de smoke: login, crear cuenta, crear transacción, listar deudas.

**Done cuando:**
- API arranca con `pnpm --filter api dev` contra Postgres local.
- Login + creación de transacción funcionan vía Postman/curl.
- Tests de smoke verdes.

**Fuera de alcance:** IA real, salud, agente.

---

## Fase 6 — Conectar frontend con API

**Objetivo:** que `apps/web` deje de leer mock y consuma la API.

**Cambios:**
1. Cliente HTTP en `apps/web/lib/api.ts` (fetch wrapper) con manejo de tokens y refresh.
2. Mover tipos compartidos de `apps/web` y `apps/api` a `packages/shared/types/`.
3. Mover Zod schemas a `packages/shared/schemas/`.
4. Implementar pantalla de login y guard de rutas.
5. Hooks/queries para Dashboard, Accounts, Transactions, Debts, Cards, Goals, Events.
6. Loading + error states. Manejo de 401 → refresh → reintento.

**Done cuando:**
- Hacer login y ver datos reales del backend.
- Crear una transacción desde la UI persiste en DB.
- `mockData.ts` deja de usarse en producción (puede quedar como fixture de tests).

**Fuera de alcance:** IA real.

---

## Fase 7 — IA mock (parser heurístico)

**Objetivo:** sustituir el `setTimeout` mock por un parser real determinístico, integrado con backend.

**Cambios:**
1. `packages/shared/utils/parser/` con:
   - `tokenize`, `detectAmount`, `detectAccount`, `detectMethod`, `detectCategory`, `detectDate`, `classifyType`.
2. Módulo `ai` en NestJS con endpoints:
   - `POST /ai/entries` — crea `LifeEntry`, llama al parser, devuelve propuesta y `LifeEntry.id`.
   - `GET /ai/entries/:id`.
   - `POST /ai/entries/:id/confirm` — persiste registros + `EventLog`.
   - `POST /ai/entries/:id/discard`.
3. `QuickRegister.tsx` (Next) usa estos endpoints; muestra confianza, campos editables, missing fields.
4. Métricas básicas: `parserCoverageRate`, `confirmationWithoutEditRate`.

**Done cuando:**
- Casos 1, 2 y parciales 5/6 de `PRODUCT_SPEC.md` se procesan **sin** llamar a un LLM.
- `LifeEntry` y `ParsedRecord` se ven en DB con auditoría.

**Fuera de alcance:** LLM real.

---

## Fase 8 — IA real (LLM)

**Objetivo:** activar LLM solo para los casos que el parser no resuelve.

**Cambios:**
1. Decidir proveedor (Gemini / Anthropic / OpenAI) — apuntar a un modelo barato por defecto.
2. Implementar `ai/llm.service.ts` con:
   - Prompt fijo + few-shot mínimos.
   - Schema JSON validado por Zod.
   - Cache (in-memory + Redis opcional) por `rawText` normalizado.
   - Logging de tokens y costo estimado.
3. Política: parser primero. Si `confidence < 0.7` o si detecta "multi-segmento", llamar LLM.
4. Cobertura de casos 3 y 4 de `PRODUCT_SPEC.md`.
5. Mover claves a `apps/api/.env`. Eliminar exposición de keys en cliente (revisar `vite.config.ts` legacy si quedó algo).

**Done cuando:**
- Caso 3 (multi-segmento con nutrición) y caso 4 (workout detallado) se procesan con LLM.
- Métricas de tokens y costo visibles.
- API key vive solo en backend.

**Fuera de alcance:** salud completa, agente.

---

## Fase 9+ — Snapshots, salud, agente, producto

Se planifican cuando llegue el momento, siguiendo [`ROADMAP.md`](./ROADMAP.md).

---

## Reglas comunes a todas las fases

- **No saltarse fases.** Cada una asume las anteriores.
- **Cada fase tiene PR(s) propio(s).** No mezclar refactor con feature.
- **Cero cambios destructivos** sin confirmación.
- **Documentar la decisión** en el doc correspondiente al cerrar la fase.
- **Testar manualmente** la app después de cada fase grande (especialmente UI mobile).
- Si una fase descubre que la siguiente debe cambiar, **actualizar este plan** antes de continuar.
