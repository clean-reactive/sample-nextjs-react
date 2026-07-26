import { z } from 'zod';

export const usernameSchema = z.string().min(3).max(31);

export type Username = z.infer<typeof usernameSchema>;
