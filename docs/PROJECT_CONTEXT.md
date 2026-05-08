# PROJECT_CONTEXT.md — Personal OS AI

## 1. Quién es el usuario

- **Nombre:** Selvin Santiago.
- **País:** Guatemala. Moneda **GTQ** (`Q`).
- **Rol:** dueño del producto y primer usuario.
- Tono de UI: español, cercano, breve.

## 2. Qué es Personal OS AI

Un **sistema operativo personal con IA** que captura información de la vida diaria en lenguaje natural y la segmenta en **registros estructurados, auditables y consultables**.

Tres ejes:

1. **Capturar fácil** — escribir como uno habla.
2. **Confirmar claro** — la IA propone, el usuario confirma.
3. **Analizar después** — los registros alimentan vistas, reportes y al agente.

Verticales (en orden):
- **Finanzas** (MVP).
- Salud / nutrición / entrenamiento.
- Hábitos.
- Metas / planes de vida.
- Agente proactivo.
- Wearables (Garmin más adelante).

## 3. Qué NO es (todavía)

- No es un agente autónomo que actúa solo. Toda escritura pasa por confirmación.
- No es una app multiusuario / SaaS hoy. Primero funciona para Selvin, luego se generaliza.
- No es un reemplazo del banco. No conecta cuentas reales por API en el MVP.
- No reemplaza a un nutricionista, médico, ni asesor financiero.

## 4. Estado actual del repo

- Demo visual generada en **Google AI Studio**.
- Stack: **React 19 + Vite 6 + TypeScript + Tailwind 4 + motion/react + lucide-react**.
- Dependencia `@google/genai` instalada pero **no usada en runtime**: el parser actual es un `setTimeout` con `if (input.includes('gasté'))`.
- Sin backend, sin DB, sin auth, sin persistencia.
- Datos en `src/mockData.ts`.
- Layout mobile-first en `max-w-md mx-auto`.
- Pantallas: Dashboard, Accounts, AccountDetail, Transactions, Debts, Cards, Goals, Events, QuickRegister.

Detalle completo en [`AUDIT_GOOGLE_DEMO.md`](./AUDIT_GOOGLE_DEMO.md).

## 5. Por qué empezamos por finanzas

- Es el dolor inmediato: hay deudas, plan de recuperación, cuentas reservadas.
- Es **medible** y **estructurable**: amount, account, category, date.
- Permite probar el patrón "captura → IA → confirmación → registro" antes de aplicarlo a salud o hábitos (que son menos numéricos y más subjetivos).
- Es el caso donde **menos errores tolera** la IA: si la IA inventa un número en finanzas, hace daño.

## 6. Principios de producto

1. **Capturar fácil.** Una caja de texto. La IA segmenta. No formularios largos.
2. **Confirmar claro.** Antes de persistir, mostrar lo que la IA entendió, con confianza.
3. **Analizar después.** Los registros alimentan dashboards, no al revés.
4. **Todo es auditable.** Cada registro tiene `createdAt/By`, `updatedAt/By` y un `EventLog`.
5. **Reservado ≠ disponible.** El dinero apartado no se cuenta como liquidez.
6. **La IA nunca guarda sin confirmación.**
7. **No usar LLM** para lo que un parser heurístico resuelve.
8. **Bajo consumo de tokens.**
9. **Finanzas → salud → agente.**
10. **No sobreconstruir.**

## 7. Fecha base

- Hoy: **2026-05-08** (viernes).
- Las cifras y plazos en `FINANCIAL_CONTEXT.md` son a esta fecha.

## 8. Vínculos rápidos

- [`CLAUDE.md`](../CLAUDE.md) — instrucciones permanentes para Claude.
- [`PRODUCT_SPEC.md`](./PRODUCT_SPEC.md) — qué hace cada módulo.
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — cómo está/estará construido.
- [`UI_GUIDELINES.md`](./UI_GUIDELINES.md) — diseño visual.
- [`AI_STRATEGY.md`](./AI_STRATEGY.md) — cómo se usa la IA.
- [`FINANCIAL_CONTEXT.md`](./FINANCIAL_CONTEXT.md) — datos reales actuales.
- [`ROADMAP.md`](./ROADMAP.md) — fases.
- [`WORKING_RULES.md`](./WORKING_RULES.md) — reglas del producto.
- [`AUDIT_GOOGLE_DEMO.md`](./AUDIT_GOOGLE_DEMO.md) — auditoría de la demo.
- [`MIGRATION_PLAN.md`](./MIGRATION_PLAN.md) — plan de evolución.
