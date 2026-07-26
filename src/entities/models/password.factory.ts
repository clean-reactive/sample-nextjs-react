import { factoryT } from 'factory-t';
import { Password } from '@/src/entities/models/password';

export const passwordFactory = factoryT<{ password: Password }>({
  password: (ctx) => `password-${ctx.index}`,
});
