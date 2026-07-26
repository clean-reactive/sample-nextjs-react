import { z } from 'zod';

import { AuthenticationError } from '@/src/entities/errors/auth';
import { InputParseError, UnknownError } from '@/src/entities/errors/common';
import { credentialsSchema } from '@/src/entities/models/credentials';
import { passwordSchema } from '@/src/entities/models/password';
import { Cookie } from '@/src/entities/models/cookie';
import type { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';

export type SignUpInputData = Partial<{
  username: string;
  password: string;
  confirm_password: string;
}>;

export type SignUpOutputData =
  Cookie | InputParseError | AuthenticationError | UnknownError;

export type ISignUpUseCase<VM> = (input: SignUpInputData) => Promise<VM>;

export type ISignUpPresenter<VM> = (output: SignUpOutputData) => Promise<VM>;

const inputSchema = credentialsSchema
  .extend({ confirm_password: passwordSchema })
  .superRefine(({ password, confirm_password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'The passwords did not match',
        path: ['confirm_password'],
      });
    }
  });

export const signUpUseCase =
  <VM>(
    usersRepository: IUsersRepository,
    authenticationService: IAuthenticationService,
    presenter: ISignUpPresenter<VM>
  ): ISignUpUseCase<VM> =>
  async (input: SignUpInputData): Promise<VM> => {
    try {
      const { data, error: inputParseError } = inputSchema.safeParse(input);
      if (inputParseError) {
        return presenter(
          new InputParseError('Invalid data', { cause: inputParseError })
        );
      }

      const existingUser = await usersRepository.getUserByUsername(
        data.username
      );

      if (existingUser) {
        return presenter(new AuthenticationError('Username taken'));
      }

      const newUser = await usersRepository.createUser({
        id: authenticationService.generateUserId(),
        username: data.username,
        password: data.password,
      });

      const { cookie } = await authenticationService.createSession(newUser);
      return presenter(cookie);
    } catch (err) {
      return presenter(
        new UnknownError('Unknown error has happen', { cause: err })
      );
    }
  };
