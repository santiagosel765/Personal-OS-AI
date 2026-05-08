# WORKING_RULES.md — Personal OS AI

Reglas de producto que aplican a todas las fases. Si una regla aquí choca con una decisión técnica, **gana la regla**.

---

## Reglas del producto

1. **Capturar fácil.** Lo que el usuario sabe expresar en una frase, el sistema debe poder registrarlo. No imponer formularios largos.
2. **Confirmar claro.** La interpretación de la IA siempre se muestra antes de persistir. Mostrar montos, cuentas, categorías y confianza.
3. **Analizar después.** Los registros alimentan dashboards, reportes y al agente — nunca al revés.
4. **Todo registro debe ser auditable.** `createdAt`, `createdBy`, `updatedAt`, `updatedBy`, soft-delete y `EventLog` por entidad.
5. **El dinero reservado no debe contarse como disponible.** Las cuentas tipo `reserved` (ej. Q4,300 BAM Oro) están fuera del "Disponible Real".
6. **La IA nunca guarda sin confirmación.** Sin excepción. Ni en notificaciones, ni en flujos de voz, ni en el agente.
7. **No llamar al LLM** para tareas que un parser heurístico resuelve. Tokens y latencia importan.
8. **Diseñar para bajo consumo de tokens.** Prompt caching, schemas estrictos, snapshots en lugar de historial completo, cache por entrada normalizada.
9. **Orden de verticales: finanzas primero, salud después, agente avanzado al final.** No invertir el orden por capricho.
10. **No sobreconstruir.** Cada fase debe entregar valor por sí sola. Ninguna abstracción se introduce "por si acaso".

---

## Reglas operativas (cómo trabajamos en el repo)

### Cambios
- Cambios pequeños, enfocados, reversibles.
- Una tarea = un commit (cuando es razonable).
- Editar antes que crear. Borrar requiere justificación + confirmación.

### Datos sensibles
- `GEMINI_API_KEY` y similares **nunca** en el cliente cuando exista backend.
- `.env*` ignorado por git (ya está en `.gitignore`).
- No hardcodear datos de Selvin en componentes; vienen de mock o config.

### Idioma y monedas
- UI en español (Guatemala). Moneda `GTQ` con prefijo `Q`.
- Fechas en formato local pero **persistencia en ISO** (`YYYY-MM-DD` o ISO 8601 con TZ).

### Calidad
- TS estricto (`tsc --noEmit` debe pasar).
- Validación Zod (frontend/shared) y `class-validator` (backend) en límites.
- Tests donde el dominio paga (helpers financieros, parser, AI).

### Confianza
- Si Claude no está seguro → preguntar.
- Si una decisión es no obvia → documentarla en el doc correspondiente.
- Si una regla aquí estorba un caso real → proponer su modificación, no romperla en silencio.

---

## Anti-patrones que evitamos

- "Diseñar para el día que seamos un SaaS multi-tenant gigante" mientras hay un solo usuario.
- "Microservicios desde el día 1."
- "El LLM lo arregla."
- "Persistimos sin confirmación, ya el usuario revisa después."
- "Sumar el reservado al disponible si queda bonito en el dashboard."
- "Refactor masivo previo a entregar valor."

---

## Cuándo violar una regla

Cuando explícitamente lo decidamos juntos y quede registrado en el doc correspondiente con fecha y motivo. No antes.
