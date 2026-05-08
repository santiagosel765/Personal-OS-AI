type StatusTone = 'success' | 'warning' | 'danger' | 'muted' | 'accent';

const toneClass: Record<StatusTone, string> = {
  success: 'border-[var(--color-success)]/30 bg-[var(--color-success)]/10 text-[var(--color-success)]',
  warning: 'border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10 text-[var(--color-warning)]',
  danger: 'border-[var(--color-danger)]/35 bg-[var(--color-danger)]/10 text-[var(--color-danger)]',
  muted: 'border-white/10 bg-white/5 text-[var(--color-muted)]',
  accent: 'border-[var(--color-accent)]/35 bg-[var(--color-accent)]/12 text-[#b9adff]',
};

export function StatusBadge({ children, tone = 'muted' }: { children: React.ReactNode; tone?: StatusTone }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase ${toneClass[tone]}`}>
      {children}
    </span>
  );
}
