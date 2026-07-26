import { z } from 'zod';

import {
  ISignInApiController,
  ISignInApiUseCase,
} from '@/src/interface-adapters/api/auth/sign-in/contract';

/**
 * The controller's sole responsibility: map what it receives (the route's
 * unknown body) into what it must pass to the use case (the two credential
 * fields as strings). Bounds are the use case's to enforce.
 */
const signInInputSchema = z
  .object({
    username: z.string(),
    password: z.string(),
  })
  .partial();

export const signInApiController =
  (signInUseCase: ISignInApiUseCase): ISignInApiController =>
  (payload) => {
    const { data = {} } = signInInputSchema.safeParse(payload);
    return signInUseCase(data);
  };
