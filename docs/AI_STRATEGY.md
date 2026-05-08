# AI_STRATEGY.md — Personal OS AI

Cómo se usa la IA en el producto. **Regla maestra: la IA propone, el usuario confirma.**

---

## 1. Principios

1. **La IA nunca persiste sin confirmación.** Toda escritura pasa por la pantalla de revisión.
2. **No llamar al LLM si un parser puede resolverlo.** Tokens cuestan, latencia se nota.
3. **Bajo consumo de tokens.** Prompts cortos, ejemplos mínimos, contexto comprimido por snapshots.
4. **Determinismo donde se pueda.** Para gastos simples, el resultado debe ser idéntico cada vez.
5. **Trazabilidad.** Cada `LifeEntry` se asocia a sus `ParsedRecord` y a un `EventLog`.
6. **Humano en el loop.** Edición libre antes de confirmar. Aprender de las correcciones más tarde (dataset propio).

---

## 2. Concepto: `LifeEntry` como entrada universal

Toda entrada cruda del usuario (texto, voz, dictado futuro) se guarda como `LifeEntry`:

```ts
LifeEntry {
  id, userId, rawText, source: 'text'|'voice'|'import',
  status: 'pending'|'parsed'|'confirmed'|'discarded',
  createdAt, parsedAt?, confirmedAt?
}
```

De un `LifeEntry` nacen uno o varios `ParsedRecord` (Transaction, NutritionEntry, WorkoutSession, Receivable, Goal-update, ContextNote…).

---

## 3. Pipeline de procesamiento

```
LifeEntry (raw)
  ├─ 1. Normalización: lowercasing controlado, parse de fechas relativas, expansión de
  │     abreviaturas (BI, BAC, BAM, AMEX), detección de moneda (Q###).
  ├─ 2. Parser heurístico (regex + reglas): cubre el 80% de casos cotidianos.
  │     ├─ Si confianza ≥ umbral → propuesta directa.
  │     └─ Si baja confianza o frase compleja → pasar a LLM.
  ├─ 3. LLM (modelo barato primero, mejor solo si falla):
  │     ├─ Prompt acotado: instrucciones cortas + 3-5 ejemplos few-shot.
  │     ├─ Schema JSON estricto (Zod en cliente y `class-validator` en backend).
  │     └─ Cache por (rawText normalizado) — entradas repetidas no consumen tokens.
  ├─ 4. Post-procesado: normalizar montos, mapear cuenta a id real, sugerir
  │     categoría faltante.
  └─ 5. Devolver propuesta → frontend muestra confirmación.
```

---

## 4. Parser heurístico (Fase 7)

Un módulo TS (en `packages/shared/utils/parser` cuando exista monorepo, o `src/lib/parser` en la demo) con reglas explícitas:

- **Detectar monto:** `/Q?\s?(\d+([.,]\d{1,2})?)/i`.
- **Detectar tipo:**
  - "gasté", "compré", "pagué" → `expense`.
  - "moví", "transferí" → `transfer`.
  - "recibí", "me pagaron", "ingresó" → `income`.
  - "presté" → `Receivable` + `expense` (egreso del bolsillo).
- **Detectar cuenta:** lookup contra catálogo del usuario (`BI`, `BAC`, `BAM Oro`, `Efectivo`, `Cash`).
- **Detectar método:** "efectivo", "cash", "transferencia", "tarjeta", "POS".
- **Detectar categoría:** diccionario simple (`almuerzo→comida/almuerzo`, `internet→servicios`, etc.).
- **Detectar fecha relativa:** "hoy", "ayer", "el 15", "viernes". Convertir siempre a fecha absoluta.

Casos cubiertos por el parser (ver `PRODUCT_SPEC.md` §3):
- Caso 1 (gasto simple) → 100% parser.
- Caso 2 (transferencia) → 100% parser.
- Caso 5 (préstamo) → parser parcial; pide confirmación de persona.
- Caso 6 (meta) → parser detecta intención; LLM ayuda a estimar costo si el usuario lo permite.

Casos que **requieren LLM**:
- Caso 3 (texto multi-segmento con nutrición).
- Caso 4 (entrenamiento detallado).
- Cualquier frase larga, ambigua o con detalles cualitativos.

---

## 5. LLM (Fase 8)

### 5.1 Reglas de uso
- Modelo barato por defecto (Haiku 4.5 o equivalente). Escalar a Sonnet/Opus solo si la respuesta no es confiable.
- Prompt fijo (cacheable a nivel de proveedor) con few-shot mínimos.
- **Output siempre JSON validado por Zod.** Si no parsea, reintentar 1 vez con repair prompt; si sigue fallando, marcar `parseError` y mostrar el raw al usuario.
- Guardar `tokensIn`, `tokensOut`, `costEstimate` y `model` en `ParsedRecord` para análisis.

### 5.2 Bajo consumo de tokens
- **Prompt caching** del system + few-shot (estables por sesión/semana).
- **Compresión de contexto:** no mandar todas las cuentas, deudas, etc. Mandar **catálogos resumidos**:
  ```
  accounts: BI, BAC, BAM_Oro(blocked), Cash
  cards:    AMEX_BAC, BAM_Blanca, Promerica(blocked), BAM_Oro(blocked)
  ```
- **Snapshots semanales/mensuales** (ver §7) en lugar de todo el historial.
- **No mandar al LLM** información sensible que no se usa para parsear (saldos exactos, deudas pendientes, etc.). El LLM clasifica; los cálculos los hace el backend.
- **Stop early:** si el parser heurístico ya tiene `confidence ≥ 0.85`, no llamar al LLM.
- **Batch** de varios `LifeEntry` cortos en una sola llamada cuando lleguen seguidos.

### 5.3 Esquema de respuesta esperado (resumen)
```json
{
  "records": [
    {
      "kind": "transaction",
      "confidence": 0.92,
      "payload": {
        "type": "expense",
        "amount": 28,
        "currency": "GTQ",
        "category": "comida",
        "subCategory": "almuerzo",
        "account": "BI",
        "method": "efectivo",
        "date": "2026-05-08"
      },
      "missingFields": []
    }
  ],
  "notes": "Si el usuario quiso decir BAC en lugar de BI, esto cambiaría la cuenta."
}
```

---

## 6. Confirmación del usuario

La pantalla `QuickRegister` muestra:
- Tipo (Gasto / Ingreso / Transferencia / Multi).
- Monto principal grande.
- Confianza (badge).
- Campos editables: cuenta, categoría, método, ¿necesario?, fecha.
- **Campos faltantes** detectados (ej. en workouts: series/reps/RPE).
- Botón **Confirmar** (gris-900) y **Editar** / **Descartar**.

Al confirmar:
- Se persisten los registros.
- El `LifeEntry` queda en `confirmed` con referencia a los `Transaction`/`NutritionEntry`/etc creados.
- Se emite `EventLog` por cada entidad creada.

---

## 7. Snapshots (sustituyen al "historial completo")

Para que el agente y los reports no necesiten leer toda la base:

- **Weekly snapshot:** resumen de la semana — totales por categoría, cuentas, top 5 gastos, eventos, progreso de metas.
- **Monthly snapshot:** mismo, agregado.
- Generados por job (cron mensual/semanal) y guardados en tabla `Snapshot`.
- El LLM, cuando necesita "contexto reciente", lee snapshots, **no** transacciones crudas.

Resultado: contexto al LLM acotado y barato.

---

## 8. Estrategia por fase

| Fase | IA |
|---|---|
| 0–6 | Sin IA real. La demo usa el `setTimeout` mock que ya existe. |
| 7 (IA mock) | Parser heurístico real (regex + diccionarios). Cubre casos 1, 2, parcial 5/6. |
| 8 (IA real) | Integrar LLM real solo para los casos que el parser no resuelve, con cache, schema y observabilidad de tokens. |
| 9+ (Agente) | Briefings semanales (lee snapshots, no la base). Sugerencias proactivas (alertas de gasto, recordatorios). |

---

## 9. Privacidad

- El texto crudo del usuario puede contener PII (nombres, direcciones, salud). Reglas:
  - Nunca enviar `rawText` a un LLM externo si no es necesario.
  - Cuando se envía, redactar nombres/teléfonos sensibles si se detectan.
  - El `GEMINI_API_KEY` (u otra) **vive solo en el backend**.
  - Logs no guardan rawText sensible más allá de lo necesario para debugging y se rotan.

---

## 10. Métricas que importan

- Tasa de aciertos del parser sin LLM.
- Tasa de confirmación sin edición vs con edición.
- Tokens promedio por confirmación.
- Costo USD por mes.
- Casos donde el LLM falla → ir a backlog del parser para cubrirlos sin LLM.

---

## 11. Lo que NO se hace con IA (al menos en MVP)

- No se "agendan" pagos automáticamente.
- No se "actualizan" saldos de banco automáticamente.
- No se llama a APIs externas (bancos, Garmin, calendarios) por iniciativa de la IA.
- No se entrena modelo propio.
- No se generan reports auto-enviados al usuario sin que él los pida (eso entra en agente, fase posterior).
