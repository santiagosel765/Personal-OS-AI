import { formatGTQ } from '@personal-os/shared';

type MoneyValueProps = {
  value: number | string | null | undefined;
  className?: string;
  compact?: boolean;
};

export function MoneyValue({ value, className = '', compact = false }: MoneyValueProps) {
  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {formatGTQ(value ?? 0, compact ? { maximumFractionDigits: 0, minimumFractionDigits: 0 } : {})}
    </span>
  );
}
