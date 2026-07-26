// @vitest-environment jsdom
import type { FormEvent } from 'react';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import { useController } from './use-controller';
import { useSignUpUseCase } from './use-sign-up-use-case/use-sign-up-use-case';
import type { SignUpPageEntity } from '../reducer';

vi.mock('./use-sign-up-use-case/use-sign-up-use-case', () => ({
  useSignUpUseCase: vi.fn(),
}));

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

describe(`${useController.name}`, () => {
  describe('onFormSubmit', () => {
    let signUpUseCase: Mock<(formData: FormData) => Promise<void>>;

    beforeEach(() => {
      signUpUseCase = vi.fn().mockResolvedValue(undefined);
      vi.mocked(useSignUpUseCase).mockReset().mockReturnValue(signUpUseCase);
    });

    it('creates the use case with the controller state and dispatch', () => {
      const dispatch = vi.fn();
      const idle: SignUpPageEntity = { status: 'idle' };

      useController({ state: idle, dispatch });

      expect(useSignUpUseCase).toHaveBeenCalledWith({ state: idle, dispatch });
    });

    it('prevents the default form submission', () => {
      const dispatch = vi.fn();
      const idle: SignUpPageEntity = { status: 'idle' };
      const { onFormSubmit } = useController({ state: idle, dispatch });
      const event = makeFormSubmitEvent({
        password: 'same',
        confirm_password: 'same',
      });

      onFormSubmit(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('forwards the submitted form data to the use case', () => {
      const dispatch = vi.fn();
      const idle: SignUpPageEntity = { status: 'idle' };
      const { onFormSubmit } = useController({ state: idle, dispatch });
      const event = makeFormSubmitEvent({
        password: 'same',
        confirm_password: 'same',
      });

      onFormSubmit(event);

      expect(signUpUseCase).toHaveBeenCalledWith(expect.any(FormData));
      const formData = signUpUseCase.mock.calls[0][0];
      expect(formData.get('password')).toBe('same');
    });
  });
});
