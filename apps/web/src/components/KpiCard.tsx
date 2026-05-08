type Tone = 'accent' | 'muted' | 'warning' | 'success' | 'danger';

const toneClasses: Record<Tone, string> = {
  accent: 'border-[var(--color-accent)]/30 bg-[var(--color-surface)]',
  muted: 'border-white/5 bg-[var(--color-surface)]',
  warning: 'border-[var(--color-warning)]/30 bg-[var(--color-surface)]',
  success: 'border-[var(--color-success)]/30 bg-[var(--color-surface)]',
  danger: 'border-[var(--color-danger)]/30 bg-[var(--color-surface)]',
};

const toneText: Record<Tone, string> = {
  accent: 'text-[var(--color-accent)]',
  muted: 'text-[var(--color-text)]',
  warning: 'text-[var(--color-warning)]',
  success: 'text-[var(--color-success)]',
  danger: 'text-[var(--color-danger)]',
};

export function KpiCard({
  label,
  value,
  subtitle,
  tone = 'muted',
}: {
  label: string;
  value: string;
  subtitle?: string;
  tone?: Tone;
}) {
  return (
    <div className={`rounded-2xl border p-3 ${toneClasses[tone]}`}>
      <p className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${toneText[tone]}`}>{value}</p>
      {subtitle ? <p className="mt-0.5 text-[10px] text-[var(--color-muted)]">{subtitle}</p> : null}
    </div>
  );
}
