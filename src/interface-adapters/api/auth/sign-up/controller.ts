import { z } from 'zod';

import {
  ISignUpApiController,
  ISignUpApiUseCase,
} from '@/src/interface-adapters/api/auth/sign-up/contract';

const signUpInputSchema = z
  .object({
    username: z.string(),
    password: z.string(),
    confirm_password: z.string(),
  })
  .partial();

export const signUpApiController =
  (signUpUseCase: ISignUpApiUseCase): ISignUpApiController =>
  (payload) => {
    const { data = {} } = signUpInputSchema.safeParse(payload);
    return signUpUseCase(data);
  };
