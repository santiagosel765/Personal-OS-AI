import { AppHeader } from './AppHeader';
import { DesktopNav } from './DesktopNav';
import { MobileBottomNav } from './MobileBottomNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <AppHeader />
      <div className="mx-auto flex max-w-6xl">
        <DesktopNav />
        <div className="w-full min-w-0 px-4 pb-28 pt-5 md:px-8 md:pb-10">
          <div className="mx-auto max-w-md md:max-w-4xl">{children}</div>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}
