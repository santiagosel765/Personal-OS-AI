/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Helpers de fecha para la demo. Sin librerías externas.
 *
 * La demo opera sobre una "fecha base" fija (DEMO_TODAY_ISO) para que las cifras
 * y vistas sean reproducibles. Cuando exista backend real, getToday() pasa a
 * devolver new Date() en un único punto.
 *
 * Ver docs/FINANCIAL_CONTEXT.md.
 */

export const DEMO_TODAY_ISO = '2026-05-08';

export function getToday(): Date {
  return new Date(`${DEMO_TODAY_ISO}T00:00:00`);
}

export function formatLongDateEs(date: Date): string {
  // "viernes, 8 de mayo de 2026" → capitalizamos para "Viernes, 8 de mayo de 2026".
  const formatted = new Intl.DateTimeFormat('es-GT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
  return capitalizeFirst(formatted);
}

export function formatShortDateEs(date: Date): string {
  // "8 de mayo"
  return new Intl.DateTimeFormat('es-GT', {
    day: 'numeric',
    month: 'long',
  }).format(date);
}

export function formatDayHeaderEs(date: Date): string {
  // "Jueves, 7 de mayo" — para encabezados de grupos de transacciones.
  const formatted = new Intl.DateTimeFormat('es-GT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
  return capitalizeFirst(formatted);
}

/** Lunes de la semana que contiene `date` (00:00 hora local). ISO 8601. */
export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dow = d.getDay(); // 0=Dom..6=Sab
  const shiftToMonday = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + shiftToMonday);
  return d;
}

/** Domingo de la semana que contiene `date` (23:59:59.999 hora local). */
export function endOfWeek(date: Date): Date {
  const d = startOfWeek(date);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
}

function capitalizeFirst(s: string): string {
  return s.length === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1);
}
