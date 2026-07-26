import { NextRequest, NextResponse } from 'next/server';

import { getInjection } from '@/di/container';

type PostMethodOutput = NextResponse<
  | { user: { id: string; username: string } }
  | { message: string }
  | { error: string }
>;

// POST /api/auth/sign-up  body: { username?: string; password?: string; confirm_password?: string }
export async function POST(request: NextRequest): Promise<PostMethodOutput> {
  const payload: unknown = await request.json().catch(() => null);

  const signUpController = getInjection('ISignUpApiController');
  const result = await signUpController(payload);

  if (result.status === 'failure' || result.status === 'created') {
    return NextResponse.json(result.body, result.init);
  }

  const response = NextResponse.json(result.body, result.init);
  const { cookie } = result;
  response.cookies.set(cookie.name, cookie.value, cookie.attributes);
  return response;
}
