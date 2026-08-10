import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { SESSION_COOKIE } from '@/config';
import { getInjection } from '@/di/container';
import type { HomePageAction } from './page.types';

// Called by the template to prepare its data, not the other way around.
// Fetches the signed-in user's todos, redirecting to sign-in if the session is
// missing or invalid.
export const homePageAction: HomePageAction = async () => {
  const getTodosController = getInjection('IGetTodosForUserBffController');

  const cookie = cookies().get(SESSION_COOKIE)?.value;

  const result = await getTodosController(cookie);

  if (result.status === 'failure') {
    redirect('/sign-in');
  }

  return { todos: result.data };
};
