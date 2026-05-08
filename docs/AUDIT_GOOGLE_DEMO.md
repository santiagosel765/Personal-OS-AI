# AUDIT_GOOGLE_DEMO.md — Personal OS AI

Auditoría inicial del estado del repo a fecha **2026-05-08**. Escrita antes de cualquier modificación. Sirve como punto de partida y como referencia histórica.

---

## 1. Origen

- Proyecto generado en **Google AI Studio** (link: `https://ai.studio/apps/78663fda-f371-4d94-b368-3eef274cfd80` según `README.md`).
- Repo local: `Personal-OS-AI`.
- Branch actual: `claude/nifty-hofstadter-4c56c2` (worktree). Branch principal: `main`. Solo dos commits previos (`First Commit`, `Initial commit`).

---

## 2. Estructura actual del repo

```
.
├── .env.example
├── .gitignore
├── README.md
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── mockData.ts
    ├── types.ts
    └── components/
        ├── AccountDetailView.tsx
        ├── AccountsView.tsx
        ├── CardsView.tsx
        ├── Dashboard.tsx
        ├── DebtsView.tsx
        ├── EventsView.tsx
        ├── GoalsView.tsx
        ├── QuickRegister.tsx
        └── TransactionsView.tsx
```

No hay carpetas `tests/`, `lib/`, `hooks/`, `pages/`, `routes/`, `apps/`, `packages/`. Es un Vite SPA plano.

---

## 3. Stack y configuración

### 3.1 `package.json`
- `name`: `react-example` (placeholder, no se ha renombrado a `personal-os` o similar).
- Scripts: `dev`, `build`, `preview`, `clean`, `lint` (`tsc --noEmit`).
- **Dependencias notables:**
  - `react` 19, `react-dom` 19.
  - `vite` 6, `@vitejs/plugin-react` 5.
  - `tailwindcss` 4 + `@tailwindcss/vite` (Tailwind v4 vía plugin oficial, no PostCSS clásico).
  - `lucide-react` 0.546, `motion` 12 (importado como `motion/react`).
  - `@google/genai` 1.29 — instalado pero **no se usa en runtime**.
  - `express` 4.21, `dotenv`, `tsx` — instalados pero **no hay servidor en el repo**. Probablemente residuo del scaffolding de AI Studio.
- DevDeps: `@types/node`, `@types/express`, `autoprefixer`, `typescript` ~5.8.

### 3.2 `vite.config.ts`
- Inyecta `process.env.GEMINI_API_KEY` al cliente. **Riesgo:** la key terminaría en bundle si se usa así. Hay que mover a backend cuando exista.
- Alias `@` → raíz del proyecto.
- HMR controlado por `DISABLE_HMR` (de AI Studio).

### 3.3 `tsconfig.json`
- Target ES2022, JSX `react-jsx`, `moduleResolution: bundler`, `noEmit: true`. Permite imports `.ts`.
- `experimentalDecorators: true`, `useDefineForClassFields: false` — pensados para futura compatibilidad NestJS.

### 3.4 `index.html` y `metadata.json`
- Title genérico: "My Google AI Studio App". **Pendiente** cambiar a "Personal OS AI".
- `metadata.json` ya describe Personal OS AI con `requestFramePermissions: []` y `majorCapabilities: []`.

### 3.5 `index.css`
- Imports de fuentes Inter y JetBrains Mono.
- `@import "tailwindcss";` + `@theme` con tokens de marca (`--color-brand-blue`, `-green`, `-amber`, `-red`).
- Body usa `font-sans bg-gray-50 text-gray-900`.

### 3.6 `.env.example`
- `GEMINI_API_KEY`, `APP_URL`. Inyectados por AI Studio.

---

## 4. Componentes y pantallas existentes

| Componente | Líneas | Función | Notas |
|---|---|---|---|
| `App.tsx` | ~127 | Layout raíz, header, bottom nav, routing por estado (`useState<ViewType>`) | Frame `max-w-md`. 5 ítems en bottom nav (Inicio, Cuentas, Registrar FAB, Historial, Metas). Pantallas `cards`, `debts`, `events`, `account-detail`, `settings` existen pero se acceden desde otras vistas o no aparecen en la nav. |
| `Dashboard.tsx` | ~200 | Saludo, alerta de riesgo, métricas, presupuesto semanal, tarjetas críticas, accesos rápidos | Tiene cifras **hardcodeadas** (Q5,200, Q4,300, 68% de presupuesto, AMEX Q8,750). Fecha también hardcodeada ("Jueves, 7 de mayo de 2026") aunque la fecha base del proyecto es el 8. |
| `AccountsView.tsx` | ~89 | Lista de cuentas con badges por tipo, botón transferir | Total mostrado al pie está **hardcodeado** ("Q7,000.00"). Iconografía y tipo `savings` definidos. |
| `AccountDetailView.tsx` | ~149 | Detalle de cuenta con saldo grande, ingresos/egresos, transacciones recientes | **Bug:** filtra `t.account === accountId` pero `MOCK_TRANSACTIONS` usa nombres ("BI") en lugar de IDs ("bi"). Resultado: la cuenta `bi` no muestra sus transacciones. |
| `TransactionsView.tsx` | ~80 | Resumen semanal + lista por día | Cifra "Q828.00" hardcodeada (no calculada). Solo muestra un día. |
| `DebtsView.tsx` | ~88 | Card hero rojo con cuota mensual total + lista de deudas | Calcula `totalMonthlyDebt` desde `MOCK_DEBTS`. ✅ |
| `CardsView.tsx` | ~113 | Tarjetas con gradient, badge de estado, overlay "NO USAR", acción recomendada | Buen patrón visual. Sin acciones reales. |
| `GoalsView.tsx` | ~95 | Metas con barra de progreso, aporte sugerido | Lista de "Inspiraciones" con activación pendiente. |
| `EventsView.tsx` | ~107 | Eventos planificados/repentinos con presupuesto vs real | Solo 1 evento en mock. Lista de "Ideas" hardcodeada. |
| `QuickRegister.tsx` | ~217 | Caja de texto + interpretación IA + confirmación | **Mock:** `setTimeout(1500ms)` con `if (input.includes('gasté'))`. No usa `@google/genai`. Confianza falsa pero estructura del UI ya correcta. |

---

## 5. Datos mock (`src/mockData.ts`)

- 5 cuentas: BI (Q1,700), BAC (Q1,000), Reservado BAM Oro (Q4,300), Fondo Emergencia (Q0), Efectivo (Q0).
- 5 deudas: BAC Casa, BAM Tacoma, Promerica Fin., BAM Blanca Fin., Extra Fin. Promerica.
- 4 tarjetas: Promerica (bloqueada), BAM Oro (bloqueada), BAM Blanca (activa), AMEX BAC (activa).
- 4 metas: Cancelar BAM Oro, AMEX en cero, Fondo Emergencia, Garmin.
- 1 evento: Cena Restaurante (over_budget).
- 3 transacciones de ejemplo.

Coherente con `FINANCIAL_CONTEXT.md` salvo detalles menores (campo `account` como nombre vs ID).

---

## 6. Tipos (`src/types.ts`)

- `TransactionType`: `expense | income | transfer`.
- `Transaction`: incluye `isNecessary: boolean` y `relatedEventId?`. Falta `accountToId` para transferencias.
- `Account`: `type: 'available' | 'reserved' | 'savings' | 'emergency'`.
- `Debt`: `priority: 'low' | 'medium' | 'high' | 'critical'`. `interestRate` como número (asumido anual).
- `CreditCard`: `status: 'active' | 'blocked' | 'pending_cancellation' | 'cancelled'`, separa `revolvingBalance` y `principalBalance`.
- `Goal`: `status: 'active' | 'paused' | 'completed' | 'pending'`.
- `AppEvent`: `status: 'on_track' | 'over_budget' | 'under_budget'`.

Sin tipos para `User`, `LifeEntry`, `ParsedRecord`, `EventLog`, `Snapshot`. Esos llegan en fases posteriores.

---

## 7. Fortalezas de la demo

- **Look & feel pulido y consistente.** Tipografía, paleta y radios redondeados están bien resueltos. La marca se siente.
- **Mobile-first real.** El frame `max-w-md mx-auto` y la bottom nav con FAB están bien implementados.
- **Domain types decentes.** `types.ts` es buena semilla para el modelo definitivo.
- **Iconografía clara** (lucide-react) y **microinteracciones suaves** (motion/react) sin abusar.
- **Reglas de UI ya implícitas en el código:** badges por estado, color por dominio, mono para cifras.
- **Pantallas críticas del MVP financiero ya bocetadas** (Dashboard, Accounts, Debts, Cards, Goals, Events, QuickRegister, Transactions).
- **Catálogo financiero alineado** con la realidad de Selvin (BI, BAC, BAM Oro/Blanca, Promerica, AMEX). Los números coinciden con `FINANCIAL_CONTEXT.md`.

---

## 8. Debilidades

### 8.1 Coherencia de datos
- `t.account` es **nombre** ("BI") mientras que `account.id` es **slug** ("bi"). El filtro de `AccountDetailView` no funciona para la cuenta `bi`.
- `Transaction.account` está tipado como `string`, no como `Account['id']`. Sin foreign keys lógicas.
- Sin `accountToId` para transferencias.

### 8.2 Cifras hardcodeadas
- `Dashboard`: Q5,200 disponible, Q4,300 reservado, 68%, Q680, "Jueves, 7 de mayo de 2026", AMEX Q8,750, BAM Oro Q4,300.
- `AccountsView`: "Total Capital Real: Q7,000.00".
- `TransactionsView`: "Q828.00 de Q1,000".
- `EventsView`: "Cena Restaurante Q300.00" duplicada en JSX.

Cuando los mock cambian, estas cifras quedan desincronizadas.

### 8.3 Falta IA real
- `@google/genai` está instalado pero no se usa.
- El "parser" actual es `setTimeout` + 3 ramas `if`.
- No hay `LifeEntry`, no hay confianza real, no hay multi-record.

### 8.4 Sin persistencia
- Todo es estado en memoria. Recargar borra cualquier "registro" hecho desde QuickRegister.
- No hay historial real.

### 8.5 Sin auth ni separación cliente/servidor
- `vite.config.ts` inyecta `GEMINI_API_KEY` al cliente. Si se usara, terminaría en el bundle.
- No hay backend. `express`, `dotenv` y `tsx` están instalados pero no hay archivos de servidor.

### 8.6 Scaffolding sucio
- `name: "react-example"` en `package.json`.
- Title `"My Google AI Studio App"` en `index.html`.
- `License header /** SPDX-License-Identifier: Apache-2.0 */` duplicado en `App.tsx`.

### 8.7 Falta accesibilidad
- Botones con solo icono (Settings, Search, Filter, Plus) sin `aria-label`.
- Textos `text-[10px] text-gray-400` sobre `bg-gray-50` rozan el límite de contraste AA.

### 8.8 Sin tests, sin lint distinto a `tsc --noEmit`
- No hay ESLint config, ni Prettier, ni Vitest, ni script de tests.

### 8.9 Inconsistencia menor de fecha
- La fecha base que me diste es **2026-05-08**, pero `Dashboard` saluda con "Jueves, 7 de mayo de 2026".

---

## 9. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Migrar todo a Next.js antes de estabilizar el dominio | media | alto | Roadmap por fases (Fase 1 antes de Fase 4). |
| Conectar LLM real al cliente y filtrar la API key | media | alto | Reglas en `CLAUDE.md` y `WORKING_RULES.md`. Mover IA al backend en Fase 7/8. |
| El parser heurístico se subestima y todo termina en LLM | alta | medio | `AI_STRATEGY.md` define el orden y métricas. |
| Dejar las cifras hardcodeadas y romper coherencia con datos reales | alta | medio | Fase 1 incluye "derivar cifras del Dashboard". |
| Perder el look mobile-first al introducir Next.js | media | alto | `UI_GUIDELINES.md` como contrato. |
| Crear microservicios "preventivamente" | baja | alto | Regla dura en `CLAUDE.md`. |
| Reescribir `mockData` o `types` sin acuerdo | media | medio | Cambios destructivos requieren confirmación (regla en `CLAUDE.md`). |
| `Transaction.account` ambiguo (nombre vs id) crece y se vuelve costoso de migrar | media | medio | Resolver en Fase 1 antes de añadir más vistas. |

---

## 10. Conclusión de la auditoría

La demo es un buen **punto de partida visual y conceptual**. El producto se ve, se siente y se entiende. **Pero** detrás del UI no hay nada todavía: ni IA, ni persistencia, ni backend, ni auth, ni tests. El plan documentado en `MIGRATION_PLAN.md` y `ROADMAP.md` toma esto como base y avanza por fases sin tirar nada de lo que ya funciona.

**Recomendación inmediata:** Fase 1 (estabilizar la demo) antes de cualquier migración. Específicamente: derivar cifras del Dashboard desde mock, resolver el contrato `Transaction.account` (id vs nombre), y limpiar `package.json`/`index.html`.
