import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { SESSION_COOKIE } from '@/config';
import { getInjection } from '@/di/container';

type PostMethodOutput = NextResponse<{ error: string } | { success: true }>;

// POST /api/todos/bulk  body: { dirty?: number[]; deleted?: number[] }
export async function POST(request: NextRequest): Promise<PostMethodOutput> {
  const sessionId = cookies().get(SESSION_COOKIE)?.value;
  const payload: unknown = await request.json().catch(() => null);

  const bulkUpdateController = getInjection('IBulkUpdateApiController');
  const result = await bulkUpdateController(payload, sessionId);

  if (result.status === 'failure') {
    return NextResponse.json(result.body, result.init);
  }

  return NextResponse.json(result.body, result.init);
}
