import { factoryT } from 'factory-t';
import { Username } from '@/src/entities/models/username';

export const usernameFactory = factoryT<{ username: Username }>({
  username: (ctx) => `username-${ctx.index}`,
});
