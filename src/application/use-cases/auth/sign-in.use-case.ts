import { AuthenticationError } from '@/src/entities/errors/auth';
import { InputParseError, UnknownError } from '@/src/entities/errors/common';
import {
  Credentials,
  credentialsSchema,
} from '@/src/entities/models/credentials';
import { Cookie } from '@/src/entities/models/cookie';
import type { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';

/**
 * @description Input data structure; raw, not-yet-validated credentials.
 * @owner The use case; outer layers import it.
 * @emerges At controller implementation, when the controller needs the
 * shape the use case accepts.
 */
export type SignInInputData = Partial<Credentials>;

/**
 * @description Output data structure; the entity outcomes of the flow.
 * @owner The use case; outer layers import it.
 * @emerges At use case implementation, the use case declares the output
 * data structure; the presenter depends on it.
 */
export type SignInOutputData =
  Cookie | InputParseError | AuthenticationError | UnknownError;

/**
 * @description Input Boundary; how the flow is invoked.
 * @owner The use case; it implements the boundary, controllers depend on
 * it. Generic over VM: the application layer never learns the view model —
 * each adapter closes the generic with its own.
 * @emerges At use case implementation, as the signature the use case
 * commits to.
 */
export type ISignInUseCase<VM> = (input: SignInInputData) => Promise<VM>;

/**
 * @description Output Boundary; what the use case calls back with the
 * output data.
 * @owner The use case; it is the consumer of the presenter, so the port is
 * declared here — presenters implement it.
 * @emerges At use case implementation, when the output data structure is
 * ready and the use case needs a way to hand it off.
 */
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
