/** Formateo GTQ. Usa Intl en runtime; en SSR/Node ≥20 está disponible. */
export function formatGTQ(value: number | string, opts: Intl.NumberFormatOptions = {}): string {
  const n = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(n)) return 'Q0.00';
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...opts,
  }).format(n);
}

/** Para sumar cifras que vienen como string (Prisma Decimal). */
export function sum(values: Array<number | string | null | undefined>): number {
  return values.reduce<number>((acc, v) => {
    if (v == null) return acc;
    const n = typeof v === 'string' ? Number(v) : v;
    return Number.isFinite(n) ? acc + n : acc;
  }, 0);
}
