import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { User } from '@/src/entities/models/user';
import { userFactory, userIdFactory } from '@/src/entities/models/user.factory';
import { Session } from '@/src/entities/models/session';
import { sessionFactory } from '@/src/entities/models/session.factory';
import { Cookie } from '@/src/entities/models/cookie';
import { cookieFactory } from '@/src/entities/models/cookie.factory';

// Stateless in-file auth double: in-file mode has no session store, so
// instead of tracking sessions, the user's id and username are encoded into
// the session id (the cookie value) itself and decoded back out on
// validation — no lookup needed, and the recovered user is the real one.
function encodeSessionId(id: string, username: string): string {
  return Buffer.from(JSON.stringify({ id, username })).toString('base64url');
}

function decodeSessionId(sessionId: string): { id: string; username: string } {
  return JSON.parse(Buffer.from(sessionId, 'base64url').toString('utf-8'));
}

export class InFileAuthenticationService implements IAuthenticationService {
  validatePasswords(
    inputPassword: string,
    usersHashedPassword: string
  ): Promise<boolean> {
    return Promise.resolve(inputPassword === usersHashedPassword);
  }

  async validateSession(
    sessionId: string
  ): Promise<{ user: User; session: Session }> {
    const { id, username } = decodeSessionId(sessionId);
    const user = userFactory.item({ id, username });
    const session = sessionFactory.item({ id: sessionId, userId: id });
    return { user, session };
  }

  async createSession(
    user: User
  ): Promise<{ session: Session; cookie: Cookie }> {
    const sessionId = encodeSessionId(user.id, user.username);
    const session = sessionFactory.item({ id: sessionId, userId: user.id });
    const cookie = cookieFactory.item({ value: session.id });
    return { session, cookie };
  }

  async invalidateSession(
    _sessionId: string
  ): Promise<{ blankCookie: Cookie }> {
    const blankCookie = cookieFactory.item({ value: '' });
    return { blankCookie };
  }

  generateUserId(): string {
    return userIdFactory({ index: Math.random() });
  }
}
