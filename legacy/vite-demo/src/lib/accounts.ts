/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Account } from '../types';

export function getAccountById(accounts: Account[], accountId: string | undefined): Account | undefined {
  if (!accountId) return undefined;
  return accounts.find((a) => a.id === accountId);
}

export function getAccountName(accounts: Account[], accountId: string | undefined): string {
  return getAccountById(accounts, accountId)?.name ?? '—';
}
