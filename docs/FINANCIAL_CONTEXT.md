# FINANCIAL_CONTEXT.md — Personal OS AI

> Datos reales de Selvin Santiago a la fecha base **2026-05-08**. Fuente única de verdad para validar cálculos del MVP. Si los números cambian, **actualizar este archivo**, y luego ajustar `src/mockData.ts` si aplica.

---

## 1. Usuario

- **Nombre:** Selvin Santiago.
- **Moneda:** **GTQ** (`Q`).
- **Zona horaria:** America/Guatemala.

---

## 2. Ingresos

| Concepto | Monto | Frecuencia / Fecha |
|---|---|---|
| Salario (parte 1) | Q2,400 | día 15 de cada mes |
| Salario (parte 2) | Q16,400 | fin de mes |
| **Ingreso mensual neto** | **Q18,800** | mensual |
| Bono 14 | ~Q15,500 | julio |
| Aguinaldo | ~Q18,000 | diciembre |

---

## 3. Estado actual (a 2026-05-08)

### 3.1 Liquidez disponible

| Origen | Monto |
|---|---|
| BI | Q1,700 |
| BAC | Q1,000 |
| Por cobrar (préstamo a un amigo, paga el 15) | Q600 |
| Próximo ingreso (15 mayo) | Q2,400 |
| − Internet pendiente | (Q500) |
| **Disponible real hasta 29 mayo** | **Q5,200** |

> No incluye los **Q4,300 reservados** (ver §3.2).

### 3.2 Reservado (no tocar)

| Concepto | Monto |
|---|---|
| Apartado para 2 financiamientos BAM Oro + cancelación de plástico | Q4,300 |

> El **dinero reservado nunca se cuenta como disponible**. Es la regla #5 de [`WORKING_RULES.md`](./WORKING_RULES.md).

### 3.3 Eventos clave del mes

- Toma de **extra financiamiento Promerica**: Q19,600 a 24 meses, cuota Q1,347.08 mensual. Permite abonos a capital **desde la 4ta cuota**.
- Tarjeta Promerica quedó en **Q0**. **Bloqueada / no usar**.
- BAM Oro principal en **Q0**. **Bloqueada**. Pendiente: pagar Q4,300 de financiamientos y dar de baja el plástico.
- **Meta semanal de gasto:** Q1,000.
- **No usar tarjetas** hasta al menos agosto 2026.

---

## 4. Deudas fijas

| Deuda | Saldo | Cuota mensual | Tasa | Prioridad | Próximo pago |
|---|---|---|---|---|---|
| BAC Casa | Q21,845.88 | Q863.50 | 16% | media | 2026-05-30 |
| BAM Tacoma | Q38,906.63 | Q2,600.00 | 24% | alta | 2026-05-15 |
| Financiamiento Promerica (actual) | Q18,269.78 | Q652.49 | 0% | baja | 2026-05-25 |
| Financiamiento BAM Blanca | Q4,027.77 | Q138.89 | 0% | baja | 2026-05-25 |
| Extra Financiamiento Promerica | Q19,600.00 | Q1,347.08 | 0% | media | 2026-05-28 |
| **Total cuota mensual** | — | **Q5,601.96** | — | — | — |

---

## 5. Tarjetas

| Tarjeta | Saldo revolvente | Saldo principal | Límite | Estado | Acción |
|---|---|---|---|---|---|
| Promerica | Q0 | Q0 | Q15,000 | bloqueada | No usar |
| BAM Oro | Q0 | Q4,300 (financiamientos) | Q20,000 | bloqueada | Pagar financiamientos y dar de baja |
| BAM Blanca | Q1,720.74 | Q0 | Q10,000 | activa | Limpiar saldo revolvente |
| AMEX BAC | Q8,750.00 | Q0 | Q30,000 | activa | Pagar fuerte en junio, dejar en cero |

---

## 6. Metas

| Meta | Objetivo | Actual | Plazo | Aporte sugerido | Notas |
|---|---|---|---|---|---|
| Cancelar BAM Oro | Q4,300 | Q0 | 2026-07-01 | Q500/mes | Usar reservado cuando sea momento. |
| AMEX en cero | Q8,750 | Q0 | 2026-07-31 | Q2,000/mes | Pago fuerte en junio. |
| Fondo de Emergencia | Q25,000 | Q0 | 2027-05-01 | Q1,000/mes | Crece después de bajar deuda. |
| Garmin Forerunner 265 | Q4,500 | Q400 | 2026-12-01 | Q300/mes | Pendiente activar. |
| **Aspiraciones** (sin monto definido aún) | | | | | |
| Irme a vivir solo | — | — | enero (objetivo) | — | A definir costos. |
| Salud Contigo (clínica/seguro) | — | — | — | — | A evaluar. |
| Formalizar empresa con amigos | — | — | — | — | A planificar. |
| Evaluar Toyota Tacoma (sostener / cambiar) | — | — | — | — | Decisión a 12 meses. |

---

## 7. Cuentas en uso (espejo de `mockData.ts`)

| ID interno | Nombre | Tipo | Saldo |
|---|---|---|---|
| `bi` | BI (Banco Industrial) | available | Q1,700 |
| `bac` | BAC Credomatic | available | Q1,000 |
| `bam_oro_res` | Reservado BAM Oro | reserved | Q4,300 |
| `emergency` | Fondo Emergencia | emergency | Q0 |
| `cash` | Efectivo | available | Q0 |

---

## 8. Reglas de cálculo derivadas (validar siempre)

- **Disponible Real (29 mayo):** `Q1,700 (BI) + Q1,000 (BAC) + Q600 (cuenta por cobrar) + Q2,400 (ingreso 15) − Q500 (internet) = Q5,200`.
- **Reservado:** `Q4,300` — **fuera del disponible**.
- **Cuota mensual total deudas:** `Q5,601.96`.
- **Patrimonio bruto líquido (sin reservado):** Q5,200.
- **Deuda total:** `Q21,845.88 + Q38,906.63 + Q18,269.78 + Q4,027.77 + Q19,600.00 + Q8,750.00 (AMEX) + Q1,720.74 (BAM Blanca) + Q4,300 (financiamientos BAM Oro) = Q117,420.80` aprox.

> Los redondeos son al 2do decimal cuando aplica. El total de deuda se incluye solo como referencia panorámica; no se muestra como métrica destacada hoy en la UI.

---

## 9. Calendario crítico próximos 30 días

| Fecha | Evento | Monto |
|---|---|---|
| 2026-05-15 | Cuota BAM Tacoma | Q2,600 |
| 2026-05-15 | Ingreso parcial salario | +Q2,400 |
| 2026-05-15 | Pago esperado del préstamo Q600 | +Q600 |
| 2026-05-25 | Cuota Promerica financiamiento | Q652.49 |
| 2026-05-25 | Cuota BAM Blanca financiamiento | Q138.89 |
| 2026-05-28 | Cuota extra financiamiento Promerica | Q1,347.08 |
| 2026-05-29 | Última fecha del "disponible real" actual | — |
| 2026-05-30 | Cuota BAC Casa | Q863.50 |
| 2026-05-30/31 | Ingreso fin de mes | +Q16,400 |

---

## 10. Cómo se usa este doc

- **Antes de cambiar cifras** en `mockData.ts`, revisarlo aquí.
- **Antes de proponer una recomendación** financiera (UI, alertas, agente), validar contra estos números.
- Si la realidad cambia (nueva deuda, ingreso extra, pago hecho), **actualizar este doc primero**, luego el código y los snapshots.
