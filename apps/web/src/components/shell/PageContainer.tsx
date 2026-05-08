type PageContainerProps = {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export function PageContainer({ title, eyebrow = 'Personal OS', children, actions }: PageContainerProps) {
  return (
    <main className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">{eyebrow}</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-[var(--color-text)]">{title}</h1>
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </header>
      {children}
    </main>
  );
}
