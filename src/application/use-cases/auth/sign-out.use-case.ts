import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError, UnknownError } from '@/src/entities/errors/common';
import { Cookie } from '@/src/entities/models/cookie';
import { Session } from '@/src/entities/models/session';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';

export type SignOutInputData = Partial<{ sessionId: Session['id'] }>;

export type SignOutOutputData =
  Cookie | InputParseError | UnauthenticatedError | UnknownError;

export type ISignOutUseCase<VM> = (input: SignOutInputData) => Promise<VM>;

export type ISignOutPresenter<VM> = (output: SignOutOutputData) => Promise<VM>;

export const signOutUseCase =
  <VM>(
    authenticationService: IAuthenticationService,
    presenter: ISignOutPresenter<VM>
  ): ISignOutUseCase<VM> =>
  async (input: SignOutInputData): Promise<VM> => {
    try {
      if (!input.sessionId) {
        return presenter(new InputParseError('Must provide a session ID'));
      }

      const { session } = await authenticationService.validateSession(
        input.sessionId
      );
      const { blankCookie } = await authenticationService.invalidateSession(
        session.id
      );
      return presenter(blankCookie);
    } catch (err) {
      if (err instanceof UnauthenticatedError) {
        return presenter(err);
      }
      return presenter(
        new UnknownError('Unknown error has happen', { cause: err })
      );
    }
  };
