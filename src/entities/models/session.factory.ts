import { factoryT, fields } from 'factory-t';
import { Session } from '@/src/entities/models/session';
import { userIdFactory } from '@/src/entities/models/user.factory';

const expiresAtDates = [
  new Date('2100-01-01T00:00:00.000Z'),
  new Date('2100-02-01T00:00:00.000Z'),
  new Date('2100-03-01T00:00:00.000Z'),
];

export const sessionFactory = factoryT<Session>({
  id: (ctx) => `session-id-${ctx.index}`,
  userId: userIdFactory,
  expiresAt: fields.sequence(expiresAtDates),
});
