# UI_GUIDELINES.md — Personal OS AI

Guía visual y de interacción. Basada en la demo actual de Vite (Google AI Studio). **Mantener este look & feel** salvo que se decida lo contrario por escrito aquí.

---

## 1. Principios

1. **Mobile-first.** Todo se diseña pensando en una sola columna estrecha.
2. **Pulcro y silencioso.** Espacios generosos, mucho blanco, tipografía clara, pocas líneas duras.
3. **Jerarquía por contraste.** Negro intenso para títulos clave (Dashboard cifras), gris claro para metadatos, color solo cuando hay un mensaje.
4. **Color con intención.** Azul = acción primaria. Rosa = riesgo / deuda. Ámbar = reservado / advertencia. Verde = ingreso / progreso.
5. **Una acción por pantalla.** No saturar.

---

## 2. Layout base

- Contenedor raíz: `flex flex-col min-h-screen bg-gray-50 max-w-md mx-auto relative overflow-hidden shadow-2xl ring-1 ring-gray-200`.
- **Header sticky** con backdrop-blur, logo "P" en azul, settings a la derecha.
- **Main scrollable** con `pb-24` para no quedar tapado por la navegación inferior.
- **Bottom nav fija** (`fixed bottom-0`) dentro del mismo `max-w-md`.

> El "frame" estrecho es intencional: simula app móvil incluso en desktop. No quitarlo sin acuerdo.

---

## 3. Paleta

### Colores marca (definidos en `src/index.css` con `@theme`)
| Token | HEX | Uso |
|---|---|---|
| `--color-brand-blue` | `#2563eb` | Acción primaria, links, foco. |
| `--color-brand-green` | `#10b981` | Ingresos, progreso, éxito. |
| `--color-brand-amber` | `#f59e0b` | Reservado, advertencia. |
| `--color-brand-red` | `#ef4444` | Riesgo, deuda crítica. |

### Escala neutra (Tailwind)
- Fondo: `bg-gray-50`.
- Cards: `bg-white` con `border border-gray-100` y `shadow-sm`.
- Texto fuerte: `text-gray-900`.
- Texto medio: `text-gray-700`.
- Texto secundario / metadatos: `text-gray-400`.
- Microetiquetas (uppercase): `text-gray-400` con `tracking-widest`.

### Accentos por dominio (mockData)
- Cuentas BI azul, BAC roja, BAM ámbar, emergency esmeralda, efectivo gris.
- Tarjetas: gradients (`from-... to-...`) que reflejan la marca de la tarjeta.
- Deudas en `DebtsView`: barra lateral de prioridad — `bg-rose-500` (high), `bg-amber-500` (medium), `bg-blue-500` (low).

---

## 4. Tipografía

Definida en `src/index.css`:
- **Sans:** Inter (400, 500, 600, 700) — texto general.
- **Mono:** JetBrains Mono (400, 500) — **siempre** para cifras monetarias y números fijos (límites, tasas).

Pesos en uso:
- `font-medium` — texto general.
- `font-bold` — etiquetas y datos secundarios destacados.
- `font-black` — cifras grandes y títulos de pantalla.
- `tracking-tight` para títulos, `tracking-widest` para microetiquetas en mayúsculas.

Tamaños frecuentes:
- Título de pantalla: `text-2xl font-black`.
- Cifras hero (Dashboard, balance card): `text-3xl`–`text-4xl font-black font-mono`.
- Etiquetas: `text-[10px] font-bold uppercase tracking-widest`.
- Body: `text-xs`–`text-sm`.

---

## 5. Componentes y patrones

### 5.1 Card estándar
```
bg-white p-{4|5|6} rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-{3|4}
```
- Radio: **`rounded-3xl`** (24px) para el card grande, `rounded-2xl` (16px) para sub-cards.
- Sombra: `shadow-sm` o `shadow-xl shadow-{color}-100` cuando es protagonista.

### 5.2 Métricas (MetricCard en `Dashboard.tsx`)
- Icono dentro de cuadrado redondeado coloreado (`w-10 h-10 rounded-2xl`).
- Etiqueta `uppercase` arriba, valor grande abajo, subtítulo opcional gris.
- Tap: `whileTap={{ scale: 0.98 }}`.

### 5.3 Botón primario
```
bg-blue-600 text-white p-4 rounded-3xl font-bold flex items-center justify-center gap-2
shadow-lg shadow-blue-100 active:scale-95 transition-all
```

### 5.4 Botón oscuro / confirmación crítica
```
bg-gray-900 text-white py-3 rounded-2xl font-bold
```
Usado en `QuickRegister` para "Confirmar" y en `DebtsView` para "Pagar".

### 5.5 Badges de estado
- Activa: `bg-emerald-50 text-emerald-600 border border-emerald-100`.
- Bloqueada: `bg-rose-50 text-rose-600 border border-rose-100`.
- Por cancelar: `bg-amber-50 text-amber-600`.
- Cancelada: `bg-gray-50 text-gray-400`.
- Patrón: `px-2 py-0.5 rounded text-[10px] font-black uppercase`.

### 5.6 Alertas
- **Riesgo medio (ámbar):** `bg-amber-50 border-amber-100`, icono `AlertCircle` ámbar.
- **Crítico (rojo):** `bg-rose-50` o card `bg-rose-600` (ver `DebtsView`).
- **Información (azul):** `bg-blue-50/50 ring-1 ring-blue-50`.

### 5.7 Progreso
- Barra: `w-full h-{1.5|2|3} bg-gray-100 rounded-full overflow-hidden` con `motion.div` animando `width`.
- Color de barra según umbral:
  - `< 70%` → `bg-blue-600`.
  - `70–90%` → `bg-amber-500`.
  - `> 90%` → `bg-rose-500`.

### 5.8 Estados vacíos
- Caja `bg-gray-50 border border-gray-100 border-dashed rounded-3xl` con texto gris centrado.

---

## 6. Navegación

### 6.1 Bottom nav (en `App.tsx`)
- 5 items: **Inicio, Cuentas, Registrar (FAB), Historial, Metas**.
- Item resaltado (Registrar) es un FAB azul flotante (`bg-blue-600 -mt-10 rounded-full`).
- Ítem activo: azul. Ítem inactivo: gris.
- Las pantallas secundarias (Cards, Debts, Events, AccountDetail, Settings) se acceden desde Dashboard u otras vistas.

### 6.2 Header
- Logo + "Personal OS" + botón Settings.
- Sticky con blur.

### 6.3 Pantallas detalle
- Header propio con `ArrowLeft` para volver. Ej. `AccountDetailView`.

---

## 7. Microinteracciones

- Cambios entre vistas: `motion.div` con `initial={{ opacity: 0, x: 10 }}`, `animate={{ opacity: 1, x: 0 }}`, `exit={{ opacity: 0, x: -10 }}`, `duration: 0.2`.
- Listas: stagger natural con `initial={{ opacity: 0, y: 10 }}` por item.
- Botones: `whileTap={{ scale: 0.98 }}` o `active:scale-95`.
- Loading IA: `Loader2` con `animate-spin`.

> Mantener la animación discreta (≤ 300ms). El producto se siente rápido por su minimalismo, no por animaciones largas.

---

## 8. Iconografía

- Librería: `lucide-react`.
- Tamaño estándar: `w-5 h-5` (botones e items), `w-4 h-4` (badges/inline), `w-24 h-32` (decorativo en cards grandes con `opacity-10`).
- Iconos clave por dominio:
  - Inicio: `LayoutDashboard`.
  - Cuentas: `Wallet`.
  - Reservado: `ShieldCheck`.
  - Emergencia: `Heart`.
  - Ahorro: `Landmark`.
  - Deuda: `Zap` / `Landmark`.
  - Tarjeta: `CreditCard`.
  - Meta: `Target` / `TrendingUp`.
  - Evento: `CalendarDays`.
  - Registrar: `PlusCircle`.
  - Historial: `History`.

---

## 9. Reglas de visualización financiera

- Moneda **siempre** con prefijo `Q`, sin espacio: `Q5,200.00`.
- Cifras grandes en `font-mono` para alinear visualmente.
- Decimales:
  - 2 decimales en transacciones, deudas y montos exactos.
  - 0 decimales aceptables en titulares (`Q5,200`) si el detalle ya se mostró.
- **Reservado** se muestra en ámbar y con etiqueta "(⚠️ No Tocar)" o "Reservado".
- **Cuenta bloqueada / tarjeta bloqueada** se renderiza con overlay `NO USAR` o badge `Bloqueada`.

---

## 10. Idioma y voz

- Español neutro con guiño guatemalteco. "Q", "BI", "BAC", "BAM" sin traducir.
- Tono **breve, directo, cálido**. Ejemplos en la demo:
  - "Hola, Personal OS AI 👋"
  - "Vas bien. Has gastado el 68% de tu meta semanal."
  - "Te quedan Q5,200 hasta el 29 de mayo."
- Evitar jerga técnica al usuario. Nada de "transaction", "entity", "payload" en UI.

---

## 11. Accesibilidad mínima

- Tamaño táctil ≥ 40×40 en botones de la barra inferior y FAB (ya cumplido).
- Contraste AA: revisar texto gris `text-gray-400` sobre `bg-gray-50` en componentes nuevos.
- `aria-label` en botones que solo tienen icono (Settings, Search, Filter, etc.). **Pendiente** en la demo.

---

## 12. Lo que NO debe hacerse

- No introducir librerías de UI completas (MUI, Chakra, Mantine). La demo usa Tailwind + componentes propios y se queda así.
- No cambiar `max-w-md` ni el frame mobile sin acuerdo.
- No alejarse de la paleta: si una vista nueva pide otro color, primero mapearlo a la escala existente.
- No usar emojis en cifras o etiquetas (los emojis de tono como 👋 son ok en saludos puntuales).
- No animar todo. Si una animación no aporta significado, fuera.
