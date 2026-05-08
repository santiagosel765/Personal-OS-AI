import type { DashboardDTO } from '@personal-os/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
  }
}

export async function fetchDashboard(): Promise<DashboardDTO> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/dashboard`, { cache: 'no-store' });
  } catch (e) {
    throw new ApiError(
      `No se pudo conectar al API en ${API_URL}. ¿Está corriendo \`pnpm --filter @personal-os/api dev\`?`,
    );
  }
  if (!res.ok) {
    throw new ApiError(`API respondió ${res.status} ${res.statusText}`, res.status);
  }
  return (await res.json()) as DashboardDTO;
}
