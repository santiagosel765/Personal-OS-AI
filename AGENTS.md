# AGENTS.md — Personal OS AI

Este archivo contiene las **instrucciones permanentes** para Codex en este repositorio. Léelo antes de cualquier cambio. Si una instrucción aquí entra en conflicto con un prompt puntual, **pregúntame antes** de actuar.

---

## 0. Contexto rápido del producto

- **Nombre:** Personal OS AI
- **Dueño / usuario inicial:** Selvin Santiago.
- **Visión:** sistema operativo personal con IA para finanzas, hábitos, metas y vida diaria.
- **Vertical inicial (MVP):** **Finanzas**. Salud, hábitos y agente avanzado vienen después.
- **Estado actual del repo:** demo visual generada en Google AI Studio (React 19 + Vite 6 + TS + Tailwind 4). Sin backend real, sin DB, sin auth.
- **Documentación viva:** ver carpeta [`docs/`](./docs). Empieza por [`docs/PROJECT_CONTEXT.md`](./docs/PROJECT_CONTEXT.md) y [`docs/FINANCIAL_CONTEXT.md`](./docs/FINANCIAL_CONTEXT.md).

> Toda decisión técnica importante debe quedar reflejada en `docs/`. Si tomamos una decisión en chat, escribirla en el doc correspondiente antes de cerrar la sesión.

---

## 1. Cómo debe trabajar Codex en este repo

### 1.1 Antes de tocar código
1. Leer este archivo.
2. Leer los docs relevantes en `docs/` según la tarea (ej. cambios de UI → `UI_GUIDELINES.md`; cambios de modelo → `ARCHITECTURE.md`).
3. Si la tarea no está cubierta por los docs, **proponerlo y esperar confirmación**.

### 1.2 Estilo de cambios
- **Cambios pequeños y enfocados.** Un PR / commit = un objetivo.
- **No reestructurar** carpetas ni renombrar masivamente sin pedirlo explícitamente.
- **No introducir abstracciones** que la tarea no necesita. No diseñar para hipótesis futuras.
- **No agregar dependencias** sin justificarlo en el commit/respuesta.
- Preferir **editar archivos existentes** sobre crear nuevos.
- Comentarios solo cuando el *por qué* no es obvio. Nada de comentarios que repiten el código.

### 1.3 Antes de cambios destructivos
**Pedir confirmación explícita** antes de:
- Borrar archivos o carpetas.
- Renombrar cosas que se exportan o se usan en varios lugares.
- Cambiar APIs públicas (props, tipos exportados, rutas).
- Tocar `package.json` (versiones, scripts) o configuración de build.
- Hacer `git reset --hard`, `git push --force`, eliminar ramas, sobreescribir trabajo no commiteado.
- Reescribir `mockData.ts` o `types.ts`.

### 1.4 Documentar decisiones
- Si elijo una opción no obvia, escribir **una línea** en el doc correspondiente: *qué se decidió + por qué*.
- Mantener `docs/MIGRATION_PLAN.md` y `docs/ROADMAP.md` actualizados conforme avancemos.
- Convertir fechas relativas a absolutas en docs (ej. "el jueves" → "2026-05-14").

---

## 2. Reglas duras (no romper)

> Estas reglas son innegociables salvo que yo las cambie por escrito en este archivo.

1. **No migres todavía a Next.js.** El frontend sigue en Vite hasta la Fase 4 del plan.
2. **No crees todavía NestJS.** El backend se inicia en la Fase 5.
3. **No crees microservicios.** El destino es **monolito modular en monorepo**, no microservicios.
4. **No borres archivos** sin justificación + confirmación.
5. **No reestructures el repo todavía.** El monorepo se introduce en la Fase 3.
6. **No integres Garmin** ni APIs de wearables todavía. Salud va después de finanzas.
7. **No construyas el "agente avanzado"** todavía. Primero el parser heurístico, luego LLM real con confirmación, luego agente.
8. **No llames al LLM** para cosas que un parser heurístico puede resolver. Los tokens cuestan; ver `docs/AI_STRATEGY.md`.
9. **La IA nunca guarda sin confirmación del usuario.** Siempre pasamos por la pantalla de revisión antes de persistir.
10. **El dinero reservado nunca cuenta como disponible.** Ver `docs/FINANCIAL_CONTEXT.md`.
11. **No expongas el `GEMINI_API_KEY`** en el cliente cuando exista backend. Hoy es demo, ok; cuando haya API, mover ahí.
12. **No uses `--no-verify`, `--force` ni saltarte hooks** salvo que yo lo pida explícitamente.

---

## 3. Diseño y UX

- **Mobile-first siempre.** El layout actual está en `max-w-md mx-auto`. Mantenerlo.
- **Respetar la demo visual.** La paleta, tipografía, radios redondeados, navegación inferior y micro-animaciones (motion/react) son la base. No cambiar el look & feel sin pedirlo.
- Cualquier nuevo componente debe seguir las convenciones de `docs/UI_GUIDELINES.md`.
- Idioma de UI: **español (Guatemala)**. Moneda: **GTQ** (símbolo `Q`).
- Capturar fácil, confirmar claro, analizar después.

---

## 4. Dominio y datos

- Las entidades canónicas están en `src/types.ts`. Antes de inventar tipos nuevos, revisar ahí.
- Los datos de prueba están en `src/mockData.ts`. Si necesitas más datos para una vista, **agrégalos ahí** (no inventes datos en el componente).
- Nunca hardcodear cifras de Selvin en componentes. Si son fijas hoy, deben venir de mock o de un único punto de configuración.
- Toda entidad persistible (cuando exista DB) debe llevar `createdAt`, `createdBy`, `updatedAt`, `updatedBy` y emitir un evento al `EventLog`. Ver `docs/ARCHITECTURE.md`.

---

## 5. Prioridades del MVP (orden estricto)

1. **Finanzas:** cuentas, transacciones, deudas, tarjetas, metas, eventos, registro rápido por IA.
2. **Auditoría e historial** de todo registro (event sourcing simple).
3. **Snapshots** semanales/mensuales para análisis sin reconsultar la base completa.
4. **Salud / nutrición / entrenamiento.**
5. **Agente proactivo** (sugerencias, alertas inteligentes).
6. **Wearables (Garmin, etc.).**
7. **Modo multiusuario / SaaS.**

> Si una tarea no encaja en este orden, **avísame antes de hacerla**.

---

## 6. Stack futuro (no implementar todavía, solo respetar la dirección)

- **Frontend:** Next.js 14/15 App Router + TS + Tailwind.
- **Backend:** NestJS + TS.
- **DB:** PostgreSQL.
- **ORM:** Prisma.
- **Monorepo:** Turborepo + pnpm.
- **Auth:** JWT (con refresh).
- **Validación backend:** class-validator + class-transformer.
- **Validación shared/frontend:** Zod cuando aplique.
- **Seguridad:** Helmet, CORS por env, rate limiting, password hashing (argon2/bcrypt), JWT firmados.
- **IA:** parser heurístico primero, LLM real después, con caché y bajo consumo de tokens.

---

## 7. Cómo correr la demo actual

```bash
npm install
# .env.local con GEMINI_API_KEY (opcional hoy: el parser real aún no se usa)
npm run dev   # Vite en http://localhost:3000
npm run lint  # tsc --noEmit
npm run build
```

---

## 8. Cuando algo se sienta fuera de alcance

Si te piden algo que choca con estas reglas (migrar todo, agregar microservicios, integrar Garmin, llamar LLM para todo, borrar la demo, etc.):

1. **No lo hagas.**
2. Explica por qué entra en conflicto con `AGENTS.md` o con un doc.
3. Propón la alternativa mínima viable.
4. Espera confirmación.

---

**Última actualización:** 2026-05-08. Este archivo manda. Si cambia el rumbo del producto, se actualiza aquí primero.
