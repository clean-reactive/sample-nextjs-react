import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { SESSION_COOKIE } from '@/config';
import { getInjection } from '@/di/container';

type TodoResponse = {
  id: number;
  todo: string;
  userId: string;
  completed: boolean;
};

type GetMethodOutput = NextResponse<
  { todos: TodoResponse[] } | { error: string }
>;

type PostMethodOutput = NextResponse<
  { todos: TodoResponse[] } | { error: string }
>;

// GET /api/todos
export async function GET(): Promise<GetMethodOutput> {
  const sessionId = cookies().get(SESSION_COOKIE)?.value;

  const getTodosForUserController = getInjection(
    'IGetTodosForUserApiController'
  );
  const result = await getTodosForUserController(sessionId);

  if (result.status === 'failure') {
    return NextResponse.json(result.body, result.init);
  }

  return NextResponse.json(result.body);
}

// POST /api/todos  body: { todo?: string }
export async function POST(request: NextRequest): Promise<PostMethodOutput> {
  const sessionId = cookies().get(SESSION_COOKIE)?.value;
  const payload: unknown = await request.json().catch(() => null);

  const createTodoController = getInjection('ICreateTodoApiController');
  const result = await createTodoController(payload, sessionId);

  if (result.status === 'failure') {
    return NextResponse.json(result.body, result.init);
  }

  return NextResponse.json(result.body, result.init);
}
