import { factoryT } from 'factory-t';
import { User } from '@/src/entities/models/user';
import { passwordFactory } from '@/src/entities/models/password.factory';
import { usernameFactory } from '@/src/entities/models/username.factory';

// Reusable field factory for a user id, so the `user-id-<n>` convention lives in
// one place (used for User.id, Session.userId, ...).
export const userIdFactory = (ctx: { index: number }): string =>
  `user-id-${ctx.index}`;

export const userFactory = factoryT<User>({
  id: userIdFactory,
  username: () => usernameFactory.item().username,
  password_hash: () => passwordFactory.item().password,
});
