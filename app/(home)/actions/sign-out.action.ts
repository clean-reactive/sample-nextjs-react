'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { SESSION_COOKIE } from '@/config';
import { getInjection } from '@/di/container';
import { SignOutAction } from '../gateway.types';

export const signOutAction: SignOutAction = async () => {
  const signOutController = getInjection('ISignOutBffController');
  const result = await signOutController(cookies().get(SESSION_COOKIE)?.value);

  if (result.status === 'success') {
    const blankCookie = result.data;
    cookies().set(blankCookie.name, blankCookie.value, blankCookie.attributes);
  }

  redirect('/sign-in');
};
