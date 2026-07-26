import { beforeEach, describe, expect, it } from 'vitest';

import { SESSION_COOKIE } from '@/config';
import { userFactory } from '@/src/entities/models/user.factory';
import { sessionFactory } from '@/src/entities/models/session.factory';
import { cookieFactory } from '@/src/entities/models/cookie.factory';
import { usernameFactory } from '@/src/entities/models/username.factory';
import { passwordFactory } from '@/src/entities/models/password.factory';
import { InFileAuthenticationService } from '@/src/infrastructure/services/authentication.service.in-file';

describe(`${InFileAuthenticationService.name}`, () => {
  const service = new InFileAuthenticationService();

  beforeEach(() => {
    userFactory.resetCount();
    sessionFactory.resetCount();
    cookieFactory.resetCount();
    usernameFactory.resetCount();
    passwordFactory.resetCount();
  });

  describe('validatePasswords', () => {
    it('resolves true when the passwords match', async () => {
      expect(await service.validatePasswords('secret', 'secret')).toBe(true);
    });

    it('resolves false when the passwords differ', async () => {
      expect(await service.validatePasswords('secret', 'other')).toBe(false);
    });
  });

  describe('createSession', () => {
    it('encodes the user id and username into the session id and cookie', async () => {
      const user = userFactory.item({ id: 'user-id-7', username: 'alice' });

      const { session, cookie } = await service.createSession(user);

      expect(session.userId).toBe('user-id-7');
      expect(session.id).toBe(cookie.value);
      expect(session.expiresAt).toEqual(new Date('2100-01-01T00:00:00.000Z'));
      expect(cookie.name).toBe(SESSION_COOKIE);
      expect(cookie.attributes).toEqual({});
    });
  });

  describe('validateSession', () => {
    it('recovers the real user from a session it created', async () => {
      const user = userFactory.item({ id: 'user-id-1', username: 'alice' });
      const { cookie } = await service.createSession(user);

      const { user: recovered, session } = await service.validateSession(
        cookie.value
      );

      expect(recovered.id).toBe('user-id-1');
      expect(recovered.username).toBe('alice');
      expect(session.id).toBe(cookie.value);
      expect(session.userId).toBe('user-id-1');
      expect(session.expiresAt).toBeInstanceOf(Date);
    });

    it('round-trips: a created session validates back to the same user', async () => {
      const user = userFactory.item({ id: 'user-id-42', username: 'bob' });

      const { cookie } = await service.createSession(user);
      const { user: recovered } = await service.validateSession(cookie.value);

      expect(recovered.id).toBe(user.id);
      expect(recovered.username).toBe(user.username);
    });
  });

  describe('invalidateSession', () => {
    it('returns a blank cookie', async () => {
      const { blankCookie } = await service.invalidateSession('user-id-1');

      expect(blankCookie).toEqual({
        name: SESSION_COOKIE,
        value: '',
        attributes: {},
      });
    });
  });

  describe('generateUserId', () => {
    it('generates an id following the user-id convention', async () => {
      expect(service.generateUserId()).toMatch(/^user-id-/);
    });
  });
});
