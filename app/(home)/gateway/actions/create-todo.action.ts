'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { SESSION_COOKIE } from '@/config';
import { getInjection } from '@/di/container';
import { AddTodoAction } from '../gateway.types';

export const createTodoAction: AddTodoAction = async (formData) => {
  const createTodoController = getInjection('ICreateTodoBffController');

  const cookie = cookies().get(SESSION_COOKIE)?.value;

  const result = await createTodoController(formData, cookie);

  if (result.status === 'failure') {
    return result;
  }

  revalidatePath('/');
  return result;
};
