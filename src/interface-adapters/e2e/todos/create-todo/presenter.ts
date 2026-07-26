import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError, UnknownError } from '@/src/entities/errors/common';
import { ICreateTodoE2ePresenter } from '@/src/interface-adapters/e2e/todos/create-todo/contract';

export const createTodoE2ePresenter =
  (): ICreateTodoE2ePresenter => async (output) => {
    if (
      output instanceof InputParseError ||
      output instanceof UnauthenticatedError ||
      output instanceof UnknownError
    ) {
      throw new Error(`create todo failed: ${output.message}`, {
        cause: output,
      });
    }

    if (output.length !== 1) {
      throw new Error(`expected exactly one todo, got ${output.length}`);
    }

    return output[0];
  };
