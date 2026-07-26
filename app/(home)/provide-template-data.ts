import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { SESSION_COOKIE } from '@/config';
import { getInjection } from '@/di/container';
import type { Todo } from './todos/todos.types';

type GetTodosControllerPort = (
  sessionId: string | undefined
) => Promise<GetTodosFailure | GetTodosSuccess>;

type GetTodosFailure = { status: 'failure' };

type GetTodosSuccess = { status: 'success'; data: Todo[] };

export async function provideTemplateData(): Promise<{ todos: Todo[] }> {
  const getTodosController: GetTodosControllerPort = getInjection(
    'IGetTodosForUserBffController'
  );

  const cookie = cookies().get(SESSION_COOKIE)?.value;

  const result = await getTodosController(cookie);

  if (result.status === 'failure') {
    redirect('/sign-in');
  }

  return { todos: result.data };
}
