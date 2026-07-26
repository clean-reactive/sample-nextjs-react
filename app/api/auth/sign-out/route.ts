import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { SESSION_COOKIE } from '@/config';
import { getInjection } from '@/di/container';

type PostMethodOutput = NextResponse<{ error: string } | { success: true }>;

// POST /api/auth/sign-out
export async function POST(): Promise<PostMethodOutput> {
  const sessionId = cookies().get(SESSION_COOKIE)?.value;

  const signOutController = getInjection('ISignOutApiController');
  const result = await signOutController(sessionId);

  if (result.status === 'failure') {
    return NextResponse.json(result.body, result.init);
  }

  const response = NextResponse.json(result.body, result.init);
  const { cookie } = result;
  response.cookies.set(cookie.name, cookie.value, cookie.attributes);
  return response;
}
