import { AuthenticationError } from '@/src/entities/errors/auth';
import { InputParseError, UnknownError } from '@/src/entities/errors/common';
import {
  Credentials,
  credentialsSchema,
} from '@/src/entities/models/credentials';
import { Cookie } from '@/src/entities/models/cookie';
import type { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';

export type SignInInputData = Partial<Credentials>;

export type SignInOutputData =
  Cookie | InputParseError | AuthenticationError | UnknownError;

export type ISignInUseCase<VM> = (input: SignInInputData) => Promise<VM>;

export type ISignInPresenter<VM> = (output: SignInOutputData) => Promise<VM>;

export const signInUseCase =
  <VM>(
    usersRepository: IUsersRepository,
    authenticationService: IAuthenticationService,
    presenter: ISignInPresenter<VM>
  ): ISignInUseCase<VM> =>
  async (input: SignInInputData): Promise<VM> => {
    try {
      const { data, error: inputParseError } =
        credentialsSchema.safeParse(input);
      if (inputParseError) {
        return presenter(
          new InputParseError('Invalid data', { cause: inputParseError })
        );
      }

      const existingUser = await usersRepository.getUserByUsername(
        data.username
      );

      if (!existingUser) {
        return presenter(new AuthenticationError('User does not exist'));
      }

      const validPassword = await authenticationService.validatePasswords(
        data.password,
        existingUser.password_hash
      );

      if (!validPassword) {
        return presenter(
          new AuthenticationError('Incorrect username or password')
        );
      }

      const { cookie } =
        await authenticationService.createSession(existingUser);
      return presenter(cookie);
    } catch (err) {
      return presenter(
        new UnknownError('Unknown error has happen', { cause: err })
      );
    }
  };
