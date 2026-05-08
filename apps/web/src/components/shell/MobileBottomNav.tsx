'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { mobileNavItems } from './navItems';

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[var(--color-bg)]/95 px-3 pb-3 pt-2 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 items-end gap-1">
        {mobileNavItems.map((item) => {
          const active = pathname === item.href || (!item.primary && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-14 flex-col items-center justify-center rounded-2xl text-[10px] font-bold transition ${
                item.primary
                  ? '-mt-8 bg-[var(--color-accent)] text-white shadow-xl shadow-[var(--color-accent)]/30'
                  : active
                    ? 'text-white'
                    : 'text-[var(--color-muted)]'
              }`}
              aria-label={item.label}
            >
              <span className={`mb-1 h-1.5 w-1.5 rounded-full ${active ? 'bg-current' : 'bg-transparent'}`} />
              <span>{item.shortLabel}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
