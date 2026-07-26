/**
 * The API adapter's side of the contract. The adapter owns only what the
 * boundary diagram assigns it — the controller's raw input, the view model,
 * and the controller interface. The Input/Output Boundaries stay with the
 * use case; this file merely closes their VM generic with the adapter's
 * view model.
 */

import { Cookie } from '@/src/entities/models/cookie';
import {
  ISignInPresenter,
  ISignInUseCase,
} from '@/src/application/use-cases/auth/sign-in.use-case';

/**
 * @description The view model. Every branch carries the full response body
 * and everything the route needs to build the response, so the route only
 * forwards them — no reconstructing.
 * @owner The route.
 * @emerges From the  route declaration.
 */
export type SignInApiViewModel =
  | {
      status: 'success';
      body: { success: true };
      init: { status: number };
      cookie: Cookie;
    }
  | { status: 'failure'; body: { error: string }; init: { status: number } };

/**
 * @description The controller interface; the controller implements it via
 * annotation, the route depends on it through DI. Input is `unknown` — the
 * route hands over whatever the wire carried; the controller extracts the
 * credential shape itself.
 * @owner The controller.
 * @emerges From the controller implementation's needs: a contract to
 * conform to.
 */
export type ISignInApiController = (
  payload: unknown
) => Promise<SignInApiViewModel>;

/**
 * @description The Input Boundary, closed with the adapter's view model.
 * @owner The use case declares the boundary; the adapter only specializes
 * it here.
 */
export type ISignInApiUseCase = ISignInUseCase<SignInApiViewModel>;

/**
 * @description The Output Boundary, closed with the adapter's view model;
 * the presenter implements it via annotation.
 * @owner The use case declares the boundary; the adapter only specializes
 * it here.
 */
export type ISignInApiPresenter = ISignInPresenter<SignInApiViewModel>;
