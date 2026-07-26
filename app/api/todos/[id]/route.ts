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

type PatchMethodOutput = NextResponse<TodoResponse | { error: string }>;

type DeleteMethodOutput = NextResponse<TodoResponse | { error: string }>;

// PATCH /api/todos/[id]
export async function PATCH(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<PatchMethodOutput> {
  const sessionId = cookies().get(SESSION_COOKIE)?.value;

  const toggleTodoController = getInjection('IToggleTodoApiController');
  const result = await toggleTodoController(params.id, sessionId);

  if (result.status === 'failure') {
    return NextResponse.json(result.body, result.init);
  }

  return NextResponse.json(result.body);
}

// DELETE /api/todos/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<DeleteMethodOutput> {
  const sessionId = cookies().get(SESSION_COOKIE)?.value;

  const deleteTodoController = getInjection('IDeleteTodoApiController');
  const result = await deleteTodoController(params.id, sessionId);

  if (result.status === 'failure') {
    return NextResponse.json(result.body, result.init);
  }

  return NextResponse.json(result.body);
}
