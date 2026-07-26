import { factoryT } from 'factory-t';
import { Cookie } from '@/src/entities/models/cookie';
import { SESSION_COOKIE } from '@/config';

export const cookieFactory = factoryT<Cookie>({
  name: SESSION_COOKIE,
  value: (ctx) => `cookie-value-${ctx.index}`,
  attributes: () => ({}),
});
