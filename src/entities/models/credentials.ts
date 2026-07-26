import { z } from 'zod';

import { usernameSchema } from '@/src/entities/models/username';
import { passwordSchema } from '@/src/entities/models/password';

/**
 * @description Root authority for credential shape and bounds.
 * @owner The entities layer.
 * @emerges From the domain rules for valid credentials.
 */
export const credentialsSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

/**
 * @description Derived from the schema so type and validation cannot
 * disagree.
 * @owner The entities layer.
 * @emerges With the schema, as its static shape.
 */
export type Credentials = z.infer<typeof credentialsSchema>;
