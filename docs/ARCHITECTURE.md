# ARCHITECTURE.md — Personal OS AI

> Esta arquitectura describe el **destino**. La demo actual en Vite no la implementa todavía. Ver [`MIGRATION_PLAN.md`](./MIGRATION_PLAN.md) para la transición fase por fase.

---

## 1. Forma del sistema: monolito modular en monorepo

**Decisión:** **monolito modular**, no microservicios.

### ¿Por qué no microservicios ahora?
- Producto en construcción para **un usuario** (Selvin) con miras a generalizarse.
- Los costos operativos de microservicios (orquestación, observabilidad, networking, despliegues coordinados) son altos y no aportan valor en este punto.
- El dominio aún se está descubriendo. Microservicios congelan los límites antes de tiempo y suelen producir el "monolito distribuido".
- Un monolito modular bien estructurado **se puede partir después** si un módulo lo justifica (escala, equipo, aislamiento de fallos).

### ¿Por qué modular y no monolito plano?
- Aislamiento de dominios (finanzas, salud, IA, agente) facilita testear y razonar.
- Mantiene una vía clara para extraer un módulo a su propio servicio si algún día hace falta.

---

## 2. Estructura objetivo del repo

```
personal-os/
├── apps/
│   ├── web/                  # Next.js App Router (frontend)
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── ...
│   └── api/                  # NestJS (backend)
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── users/
│       │   │   ├── accounts/
│       │   │   ├── transactions/
│       │   │   ├── debts/
│       │   │   ├── cards/
│       │   │   ├── goals/
│       │   │   ├── events/
│       │   │   ├── ai/        # parser + LLM
│       │   │   ├── audit/     # EventLog, snapshots
│       │   │   └── health/    # nutrition, workouts (fase posterior)
│       │   ├── common/        # filters, guards, pipes
│       │   ├── config/
│       │   └── main.ts
│       └── test/
├── packages/
│   ├── db/                   # Prisma schema + client
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── src/index.ts
│   └── shared/               # tipos, schemas Zod, utilidades
│       ├── types/
│       ├── schemas/
│       └── utils/
├── docs/
├── docker-compose.yml        # postgres local
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
└── README.md
```

---

## 3. Stack

| Capa | Tecnología | Notas |
|---|---|---|
| Frontend | Next.js 14/15 App Router + React 19 + TS + Tailwind 4 | Mantener look mobile-first de la demo. |
| UI utils | `motion/react`, `lucide-react` | Ya en uso, conservar. |
| Backend | NestJS + TS | Modular por dominio. |
| ORM | Prisma | Migrations, type-safe. |
| DB | PostgreSQL | Local con docker-compose. |
| Validación BE | `class-validator` + `class-transformer` | DTOs en cada módulo. |
| Validación shared | Zod | Schemas en `packages/shared/schemas`. |
| Auth | JWT (access + refresh) | Argon2/bcrypt para passwords. |
| Seguridad | Helmet, CORS por env, rate limit (`@nestjs/throttler`) | Configurable por entorno. |
| Monorepo | pnpm + Turborepo | Workspaces, cache de build. |
| Logs | pino + request id | Trazabilidad por request. |
| Tests | Vitest (web) + Jest (api) | TDD donde el dominio lo amerite. |
| IA | parser propio → `@google/genai` u otro proveedor | Ver `AI_STRATEGY.md`. |

---

## 4. Módulos de dominio (`apps/api/src/modules/`)

Cada módulo NestJS expone:
- Controller(s) con DTOs.
- Service con lógica.
- Repository (Prisma) inyectable.
- Eventos (in-process por ahora; un `EventBus` simple).

| Módulo | Responsabilidad |
|---|---|
| `auth` | Login, refresh, hash de password, guards. |
| `users` | Perfil del usuario, settings (moneda, zona horaria, idioma). |
| `accounts` | Cuentas, saldos, transferencias internas. |
| `transactions` | Gastos, ingresos. Validación de cuenta y categoría. |
| `categories` | Catálogo de categorías y subcategorías. |
| `debts` | Deudas fijas, cuotas, abonos a capital. |
| `cards` | Tarjetas, estado, saldo revolvente y financiamientos. |
| `goals` | Metas y aportes. |
| `events` | Eventos con presupuesto propio. |
| `ai` | LifeEntry, parser heurístico, llamadas LLM, prompts, caché. |
| `audit` | EventLog, snapshots semanales/mensuales. |
| `notifications` (futuro) | Alertas, briefings. |
| `health` (futuro) | Nutrición, entrenamientos. |
| `agent` (futuro) | Sugerencias proactivas. |

---

## 5. Entidades principales (resumen)

> Definitivas en Prisma cuando lleguemos a Fase 5. Esto es el bosquejo.

```ts
User { id, email, name, currency, locale, timezone, createdAt, updatedAt }

Account { id, userId, name, type: 'available'|'reserved'|'savings'|'emergency',
          color, openingBalance, createdAt, updatedAt }

Transaction { id, userId, date, type: 'expense'|'income'|'transfer',
              amount, currency, accountId, accountToId?,
              categoryId, subCategoryId?, method, description,
              isNecessary, eventId?, sourceEntryId?,
              createdAt, createdBy, updatedAt, updatedBy }

Category { id, userId?, name, parentId?, kind: 'expense'|'income'|'both' }

Debt { id, userId, name, totalBalance, originalBalance?, monthlyQuota,
       interestRate, priority, nextPaymentDate, allowsCapitalPayment,
       createdAt, updatedAt }

CreditCard { id, userId, name, status, revolvingBalance, principalBalance,
             limit, actionRequired, blocked, createdAt, updatedAt }

Goal { id, userId, name, targetAmount, currentAmount, deadline,
       status, suggestedContribution, createdAt, updatedAt }

AppEvent { id, userId, name, type, budgetedAmount, actualSpent, date,
           status, createdAt, updatedAt }

LifeEntry { id, userId, rawText, source, status: 'pending'|'parsed'|'confirmed'|'discarded',
            parsedAt?, confirmedAt?, createdAt }

ParsedRecord { id, lifeEntryId, kind: 'transaction'|'nutrition'|'workout'|...,
               payload: jsonb, confidence: float, status }

EventLog { id, userId, entity, entityId, action, payload, actor, at }

Snapshot { id, userId, period: 'weekly'|'monthly', from, to, payload, createdAt }
```

Todas las entidades persistibles llevan auditoría: `createdAt/By`, `updatedAt/By` y emisión a `EventLog`.

---

## 6. Flujo `LifeEntry → registros`

```
POST /ai/entries  { rawText, source }
  → crea LifeEntry (status: pending)
  → ai.service.parse(entry):
       1) parser heurístico
       2) si baja confianza → LLM con prompt acotado y caché
  → genera ParsedRecord[] con confidence
  → responde al frontend para confirmación
GET  /ai/entries/:id  ← frontend muestra propuesta
POST /ai/entries/:id/confirm  { edits } → persiste registros + EventLog
POST /ai/entries/:id/discard
```

---

## 7. Seguridad

- HTTPS en producción (proxy / hosting).
- Helmet en NestJS.
- CORS con allowlist por entorno (`API_CORS_ORIGINS`).
- Rate limiting en endpoints sensibles.
- Passwords: Argon2id (preferido) o bcrypt.
- JWT firmado, secrets por env, refresh tokens rotables.
- Validación estricta en DTOs (`class-validator`); rechazar campos extra.
- Logs sin datos sensibles (ni PII innecesario).
- API key del LLM **nunca** en el cliente.

---

## 8. Observabilidad mínima

- Logs estructurados (pino).
- Request ID por traza.
- Métrica simple de uso de tokens y costo estimado del LLM (para `AI_STRATEGY.md`).
- EventLog ya cumple parte del rol de auditoría.

---

## 9. Por qué cada decisión

| Decisión | Por qué |
|---|---|
| Monolito modular | Dominio joven, un solo usuario, evita complejidad operacional. |
| Monorepo (pnpm + Turbo) | Compartir tipos y Prisma client entre `web` y `api`. |
| Next.js App Router | SSR/streaming, file-based routing, server actions opcionales. |
| NestJS | Estructura modular fuerte, DI, decoradores, comunidad. |
| Prisma | Migraciones limpias, types autogenerados, productividad. |
| PostgreSQL | Relacional + jsonb (perfecto para `payload` de ParsedRecord/EventLog). |
| Zod en shared | Misma validación en cliente y server. |
| Parser heurístico antes que LLM | Costo de tokens, latencia y determinismo. |
| Confirmación humana | La IA propone, no decide. Requisito del producto. |

---

## 10. Lo que NO está en el alcance ahora

- Microservicios.
- Mensajería externa (Kafka, RabbitMQ).
- Multi-tenancy real.
- Sincronización con bancos por API.
- Integración Garmin / wearables.
- Mobile app nativa (la PWA con Next.js cubre el caso por ahora).
