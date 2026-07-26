'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getInjection } from '@/di/container';
import { SignInAction } from './gateway.types';

/**
 * Implements the page's gateway (SignInAction). The injected BFF
 * controller's own type is inferred directly from getInjection — the
 * one place the two consumer-owned contracts meet, checked structurally.
 *
 * The action maps no data: FormData goes to the controller as-is, and the
 * controller's view model comes back as-is — the BFF must shape both to meet
 * the port directly.
 */

/**
 * @description Implements the gateway; returning the controller's failure
 * checks it against the gateway contract.
 * @emerges From the gateway's needs: its sign-in method must be fulfilled
 * server-side.
 */
export const signInAction: SignInAction = async (formData) => {
  const signInController = getInjection('ISignInBffController');
  const result = await signInController(formData);

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
