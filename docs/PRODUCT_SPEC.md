# PRODUCT_SPEC.md — Personal OS AI

Especificación funcional del producto. Foco: **MVP financiero**. Las verticales posteriores se describen de forma breve.

---

## 1. Concepto central: `LifeEntry`

Toda interacción del usuario entra como un **LifeEntry** crudo:

- `rawText`: lo que escribió el usuario.
- `source`: `text` | `voice` | `import` | `manual`.
- `createdAt`, `createdBy`.

El sistema lo procesa así:

```
LifeEntry (raw)
   │
   ▼
Parser heurístico  ── puede resolver?  ── sí ──▶ propuesta estructurada
   │ no
   ▼
LLM (con prompt acotado, caché, ejemplos)
   │
   ▼
Propuesta estructurada (1 o varios records)
   │
   ▼
Pantalla de confirmación (mostrar campos, confianza, lo faltante)
   │  usuario confirma
   ▼
Registros persistidos + EventLog + LifeEntry marcado como procesado
```

Un `LifeEntry` puede generar **múltiples registros** (ej. un mismo texto produce un gasto + una entrada nutricional + un beneficio familiar).

---

## 2. Módulos del MVP financiero

### 2.1 Cuentas (`Account`)
Cuentas bancarias o de efectivo del usuario.

**Tipos:** `available` | `reserved` | `savings` | `emergency`.
Reglas:
- `reserved` **no** suma al "Disponible Real".
- `emergency` se separa visualmente y se trata como meta protegida.
- Cada cuenta tiene saldo derivado de transacciones (en producción) o saldo manual (hoy en demo).

**Vistas relacionadas:** `AccountsView`, `AccountDetailView`.

### 2.2 Transacciones (`Transaction`)
Movimiento de dinero. Tipos:
- `expense` — sale de una cuenta.
- `income` — entra a una cuenta.
- `transfer` — entre cuentas internas (no impacta el patrimonio total).

Campos clave: `amount`, `category`, `subCategory`, `account`, `method` (efectivo, transferencia, tarjeta…), `isNecessary`, `relatedEventId?`.

**Vistas:** `TransactionsView`, agregada en `Dashboard` y `AccountDetailView`.

### 2.3 Deudas fijas (`Debt`)
Préstamos / financiamientos con cuota mensual conocida.

Campos: `totalBalance`, `monthlyQuota`, `interestRate`, `priority`, `nextPaymentDate`.
Reglas:
- Se calcula la **cuota mensual total** (suma).
- Se permite **abono a capital** cuando la deuda lo soporta (ej. Promerica desde la 4ta cuota).

**Vistas:** `DebtsView`, métrica en `Dashboard`.

### 2.4 Tarjetas (`CreditCard`)
Tarjetas de crédito con estado y saldos.

Estados: `active` | `blocked` | `pending_cancellation` | `cancelled`.
Campos: `revolvingBalance`, `principalBalance`, `limit`, `actionRequired`.

Reglas:
- Bloqueada → UI lo refleja claramente (overlay "NO USAR").
- `actionRequired` se muestra como recomendación.

**Vistas:** `CardsView`, resumen "Tarjetas Críticas" en `Dashboard`.

### 2.5 Metas (`Goal`)
Objetivos financieros y de vida.

Estados: `active` | `paused` | `completed` | `pending`.
Campos: `targetAmount`, `currentAmount`, `deadline`, `suggestedContribution`.

Reglas:
- Mostrar progreso `currentAmount / targetAmount`.
- Sugerir aporte mensual (heurística simple inicial: `(target - current) / mesesRestantes`).

**Vistas:** `GoalsView`.

### 2.6 Eventos (`AppEvent`)
Eventos puntuales con presupuesto propio (cena, viaje, reparación).

Tipos: `planned` | `sudden`.
Estados de presupuesto: `on_track` | `over_budget` | `under_budget`.
Reglas:
- Un evento agrupa varias transacciones (`expenses: string[]`).
- Comparar `actualSpent` vs `budgetedAmount`.

**Vistas:** `EventsView`.

### 2.7 Registro rápido por IA (`QuickRegister`)
Pantalla central. Caja de texto → IA propone → usuario confirma.

Comportamiento esperado:
- Mostrar **confianza** (`confidence`).
- Permitir editar campos antes de confirmar.
- Permitir descartar.
- Soportar **registros multi-record** (ej. gasto + nutrición + beneficio familiar).

**Vista:** `QuickRegister.tsx` (hoy mock).

---

## 3. Casos de uso (ejemplos canónicos)

> Estos ejemplos son la prueba de aceptación funcional del módulo de IA.

### Caso 1 — Gasto simple
**Input:** "Gasté Q28 en almuerzo efectivo BI."
**Output:** 1 `Transaction`
- `type: expense`, `amount: 28`, `category: comida`, `subCategory: almuerzo`, `account: BI`, `method: efectivo`.

### Caso 2 — Transferencia
**Input:** "Moví Q500 de BI a BAC."
**Output:** 1 `Transaction` `transfer`
- `amount: 500`, `accountFrom: BI`, `accountTo: BAC`.

### Caso 3 — Texto multi-segmento
**Input:** "Hoy gasté Q27 en almuerzo, comí bistec con arroz, 8 tortillas y una Coca-Cola. La Coca-Cola la tomé de la tienda de mi mamá."
**Output:** múltiples records
- `Transaction` (gasto Q27, comida/almuerzo).
- `NutritionEntry` (proteína, carbos, calorías estimadas).
- `FamilyBenefit` (Coca-Cola tomada de la tienda — apoyo familiar).
- `ContextNote` (texto original como referencia).

### Caso 4 — Entrenamiento
**Input:** "Hoy fui al gym, entrené pecho plano en barra con 45 lb por lado, pecho alto con mancuernas de 45, hombro y tríceps."
**Output:**
- `WorkoutSession` con `muscleGroups: [pecho, hombro, tríceps]`.
- `Exercise[]` con pesos detectados.
- Marcar **campos faltantes**: `series`, `reps`, `descanso`, `RPE` → preguntar al usuario.

### Caso 5 — Préstamo a un amigo
**Input:** "Le presté Q600 a un amigo y me lo paga el 15."
**Output:**
- `Receivable` (cuenta por cobrar): persona, `amount: 600`, `expectedDate: 15`.
- Opcional: `Transaction` egreso de la cuenta de origen.

### Caso 6 — Meta de vida
**Input:** "Quiero irme a vivir solo en enero."
**Output:**
- `Goal` (crear o actualizar): `name: vivir solo`, `deadline: enero`.
- Pedir `targetAmount` estimado y `suggestedContribution` mensual.

---

## 4. Reglas de cálculo financiero

- **Disponible Real** = `Σ(accounts where type = 'available') + ingresos confirmados próximos − egresos comprometidos − reservados`.
- **Reservado** = `Σ(accounts where type = 'reserved')`. Nunca se suma a disponible.
- **Cuota mensual total** = `Σ(debts.monthlyQuota)`.
- **Patrimonio neto (futuro)** = `Σ activos − Σ deudas`.
- Las cifras del Dashboard hoy están **hardcodeadas** y deben pasar a derivarse de los datos.

---

## 5. Auditabilidad

Todo registro persistible debe llevar:
- `id` (uuid).
- `createdAt`, `createdBy` (userId).
- `updatedAt`, `updatedBy`.
- `deletedAt?`, `deletedBy?` (soft delete).
- Emitir `EventLog` con `entity`, `entityId`, `action`, `payload`, `actor`, `timestamp`.

---

## 6. Verticales posteriores (resumen)

- **Salud:** `NutritionEntry`, `WorkoutSession`, `Exercise`, `Sleep`, `Mood`.
- **Hábitos:** `Habit`, `HabitLog`.
- **Familia / red:** `Person`, `Receivable`, `Loan`, `FamilyBenefit`.
- **Notas / contexto:** `ContextNote` (texto libre que la IA ancla a registros).
- **Agente:** sugerencias proactivas, alertas, briefings semanales.

Cada uno se especificará en su propio doc cuando llegue su fase.
