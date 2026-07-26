import { z } from 'zod';

import { CreateTodoInputData } from '@/src/application/use-cases/todos/create-todo.use-case';
import {
  ICreateTodoApiController,
  ICreateTodoApiUseCase,
} from '@/src/interface-adapters/api/todos/create-todo/contract';

const createTodoInputSchema = z.object({ todo: z.string() }).partial();

export const createTodoApiController =
  (createTodoUseCase: ICreateTodoApiUseCase): ICreateTodoApiController =>
  (payload, sessionId) => {
    const { data = {} } = createTodoInputSchema.safeParse(payload);
    const inputData: CreateTodoInputData = { todo: data.todo, sessionId };
    return createTodoUseCase(inputData);
  };
