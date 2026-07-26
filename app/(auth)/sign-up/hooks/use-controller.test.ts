// @vitest-environment jsdom
import type { Dispatch, FormEvent } from 'react';
import {
  Mocked,
  MockedFunction,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest';

import { useController } from './use-controller';
import { AppUseCase, useSignUpUseCase } from './use-sign-up-use-case';
import type { SignUpPageEntity, SignUpPageEvent } from '../reducer';

vi.mock('./use-sign-up-use-case', () => {
  const signUpUseCaseExecutorMock: MockedFunction<AppUseCase<FormData>> =
    vi.fn();
  const useSignUpUseCaseMock = () => signUpUseCaseExecutorMock;
  return { useSignUpUseCase: useSignUpUseCaseMock };
});

function makeFormSubmitEvent(fields: Record<string, string>) {
  const form = document.createElement('form');
  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement('input');
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  return {
    preventDefault: vi.fn(),
    currentTarget: form,
  } as unknown as FormEvent<HTMLFormElement>;
}

type Context = {
  dispatch: Mock<Dispatch<SignUpPageEvent>>;
  state: SignUpPageEntity;
  signUpUseCaseExecutor: MockedFunction<AppUseCase<FormData>>;
};

describe(`${useController.name}`, () => {
  describe('onFormSubmit', () => {
    beforeEach<Context>((ctx) => {
      ctx.dispatch = vi.fn();
      ctx.state = { status: 'idle' };
      const signUpUseCase = useSignUpUseCase({
        state: { status: 'idle' },
        dispatch: vi.fn(),
      });
      ctx.signUpUseCaseExecutor = vi.mocked(signUpUseCase);
      ctx.signUpUseCaseExecutor.mockReset();
    });

    it<Context>('prevents the default form submission', (ctx) => {
      const { onFormSubmit } = useController({
        state: ctx.state,
        dispatch: ctx.dispatch,
      });
      const event = makeFormSubmitEvent({
        password: 'same',
        confirm_password: 'same',
      });

      onFormSubmit(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it<Context>('forwards the submitted form data to the use case', (ctx) => {
      const { onFormSubmit } = useController({
        state: ctx.state,
        dispatch: ctx.dispatch,
      });
      const event = makeFormSubmitEvent({
        password: 'same',
        confirm_password: 'same',
      });

      onFormSubmit(event);

      expect(ctx.signUpUseCaseExecutor).toHaveBeenCalledWith(
        expect.any(FormData)
      );
      const formData = ctx.signUpUseCaseExecutor.mock.calls[0][0];
      expect(formData.get('password')).toBe('same');
      expect(formData.get('confirm_password')).toBe('same');
    });
  });
});
