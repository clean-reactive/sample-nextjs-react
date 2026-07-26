'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { SESSION_COOKIE } from '@/config';
import { getInjection } from '@/di/container';
import { BulkUpdateAction } from '../gateway.types';

export const bulkUpdateAction: BulkUpdateAction = async (dirty, deleted) => {
  const bulkUpdateController = getInjection('IBulkUpdateBffController');

  const cookie = cookies().get(SESSION_COOKIE)?.value;

  const result = await bulkUpdateController(dirty, deleted, cookie);

  // The transactions may have partially committed, so refresh even on failure.
  revalidatePath('/');
  return result;
};
