import { z } from 'zod';

import { usernameSchema } from '@/src/entities/models/username';
import { passwordSchema } from '@/src/entities/models/password';

export const credentialsSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export type Credentials = z.infer<typeof credentialsSchema>;
