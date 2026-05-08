import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Personal OS AI',
  description: 'Tu sistema operativo personal — finanzas, hábitos y metas.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0b1020',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-GT">
      <body className="min-h-screen">
        <div className="mx-auto max-w-md min-h-screen px-4 pb-24 pt-6">{children}</div>
      </body>
    </html>
  );
}
