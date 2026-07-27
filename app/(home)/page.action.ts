import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { SESSION_COOKIE } from '@/config';
import { getInjection } from '@/di/container';
import type { HomePageAction } from './page.types';

/**
 * Implements the template's page action (HomePageAction). The injected BFF
 * controller's own type is inferred directly from getInjection - the one
 * place the two consumer-owned contracts meet, checked structurally.
 */
export const homePageAction: HomePageAction = async () => {
  const getTodosController = getInjection('IGetTodosForUserBffController');

  const cookie = cookies().get(SESSION_COOKIE)?.value;

  const result = await getTodosController(cookie);

  if (result.status === 'failure') {
    // NOTE(harunou): response selection - the action answers with a redirect
    // instead of a template. `result.code` distinguishes `unauthenticated` from
    // `unexpected_error`; both are answered the same way today.
    redirect('/sign-in');
  }

  return { todos: result.data };
};
