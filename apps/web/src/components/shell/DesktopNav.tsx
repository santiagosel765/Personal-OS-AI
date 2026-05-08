'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { desktopNavItems } from './navItems';

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-[73px] hidden h-[calc(100vh-73px)] w-64 shrink-0 border-r border-white/10 p-4 md:block">
      <nav className="space-y-1">
        {desktopNavItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                active
                  ? 'bg-[var(--color-surface-2)] text-white'
                  : 'text-[var(--color-muted)] hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
