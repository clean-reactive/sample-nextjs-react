'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { SESSION_COOKIE } from '@/config';
import { getInjection } from '@/di/container';
import { ToggleTodoAction } from '../gateway.types';

export const toggleTodoAction: ToggleTodoAction = async (todoId) => {
  const toggleTodoController = getInjection('IToggleTodoBffController');

  const cookie = cookies().get(SESSION_COOKIE)?.value;

  const result = await toggleTodoController(todoId, cookie);

  if (result.status === 'failure') {
    return result;
  }

  revalidatePath('/');
  return result;
};
