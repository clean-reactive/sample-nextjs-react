import { NextRequest, NextResponse } from 'next/server';

import { getInjection } from '@/di/container';

/**
 * @description The route's wire contract: `{ error }` on failure,
 * `{ success: true }` on success — the session travels in the Set-Cookie
 * header, not the body.
 * @owner The route; declared here — the view model's body branches must meet it
 * structurally where the route forwards `result.body`.
 * @emerges From what the route promises its HTTP clients.
 */
type PostMethodOutput = NextResponse<{ error: string } | { success: true }>;

// POST /api/auth/sign-in  body: { username?: string; password?: string }
export async function POST(request: NextRequest): Promise<PostMethodOutput> {
  const payload: unknown = await request.json().catch(() => null);

  const signInController = getInjection('ISignInApiController');
  const result = await signInController(payload);

  if (result.status === 'failure') {
    return NextResponse.json(result.body, result.init);
  }
  const response = NextResponse.json(result.body, result.init);
  const { cookie } = result;
  response.cookies.set(cookie.name, cookie.value, cookie.attributes);
  return response;
}
