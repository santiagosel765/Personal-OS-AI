export const mobileNavItems = [
  { href: '/dashboard', label: 'Dashboard', shortLabel: 'Inicio', primary: false },
  { href: '/accounts', label: 'Cuentas', shortLabel: 'Cuentas', primary: false },
  { href: '/transactions/new', label: 'Registrar', shortLabel: 'Registrar', primary: true },
  { href: '/transactions', label: 'Historial', shortLabel: 'Historial', primary: false },
  { href: '/goals', label: 'Metas', shortLabel: 'Metas', primary: false },
] as const;

export const desktopNavItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/accounts', label: 'Cuentas' },
  { href: '/transactions', label: 'Transacciones' },
  { href: '/cards', label: 'Tarjetas' },
  { href: '/debts', label: 'Deudas' },
  { href: '/goals', label: 'Metas' },
  { href: '/events', label: 'Eventos' },
] as const;
