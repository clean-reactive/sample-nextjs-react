'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getInjection } from '@/di/container';
import { SignUpAction } from './gateway.types';

export const signUpAction: SignUpAction = async (formData) => {
  const signUpController = getInjection('ISignUpBffController');
  const result = await signUpController(formData);

  if (result.status === 'failure') {
    return result;
  }

  const sessionCookie = result.data;
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  redirect('/');
};
