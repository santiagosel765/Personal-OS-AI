import type {
  AccountDTO,
  CardDTO,
  DashboardDTO,
  DebtDTO,
  EventDTO,
  GoalDTO,
  TransactionDTO,
} from '@personal-os/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
  }
}

async function apiFetch<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { cache: 'no-store' });
  } catch {
    throw new ApiError(
      `No se pudo conectar al API en ${API_URL}. Revisa que este corriendo pnpm --filter @personal-os/api dev.`,
    );
  }

  if (!res.ok) {
    throw new ApiError(`API respondio ${res.status} ${res.statusText}`, res.status);
  }

  return (await res.json()) as T;
}

export function fetchDashboard(): Promise<DashboardDTO> {
  return apiFetch<DashboardDTO>('/dashboard');
}

export function fetchAccounts(): Promise<AccountDTO[]> {
  return apiFetch<AccountDTO[]>('/accounts');
}

export function fetchTransactions(limit = 100): Promise<TransactionDTO[]> {
  return apiFetch<TransactionDTO[]>(`/transactions?limit=${limit}`);
}

export function fetchCards(): Promise<CardDTO[]> {
  return apiFetch<CardDTO[]>('/cards');
}

export function fetchDebts(): Promise<DebtDTO[]> {
  return apiFetch<DebtDTO[]>('/debts');
}

export function fetchGoals(): Promise<GoalDTO[]> {
  return apiFetch<GoalDTO[]>('/goals');
}

export function fetchEvents(): Promise<EventDTO[]> {
  return apiFetch<EventDTO[]>('/events');
}
