import { generateIdFromEntropySize, Lucia } from 'lucia';
import { compare } from 'bcrypt-ts';

import { SESSION_COOKIE } from '@/config';
import { DrizzleConnection } from '@/drizzle';
import { type IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { Cookie } from '@/src/entities/models/cookie';
import { Session, sessionSchema } from '@/src/entities/models/session';
import { User } from '@/src/entities/models/user';

export class AuthenticationService implements IAuthenticationService {
  private lucia: Lucia;

  constructor(
    private readonly usersRepository: IUsersRepository,
    connection: DrizzleConnection = DrizzleConnection.make()
  ) {
    this.lucia = new Lucia(connection.luciaAdapter, {
      sessionCookie: {
        name: SESSION_COOKIE,
        expires: false,
        attributes: {
          secure: process.env.NODE_ENV === 'production',
        },
      },
      getUserAttributes: (attributes) => {
        return {
          username: attributes.username,
        };
      },
    });
  }

  validatePasswords(
    inputPassword: string,
    usersHashedPassword: string
  ): Promise<boolean> {
    return compare(inputPassword, usersHashedPassword);
  }

  async validateSession(
    sessionId: string
  ): Promise<{ user: User; session: Session }> {
    const result = await this.lucia.validateSession(sessionId);

    if (!result.user || !result.session) {
      throw new UnauthenticatedError('Unauthenticated');
    }

    const user = await this.usersRepository.getUser(result.user.id);

    if (!user) {
      throw new UnauthenticatedError("User doesn't exist");
    }

    return { user, session: result.session };
  }

  async createSession(
    user: User
  ): Promise<{ session: Session; cookie: Cookie }> {
    const luciaSession = await this.lucia.createSession(user.id, {});

    const session = sessionSchema.parse(luciaSession);
    const cookie = this.lucia.createSessionCookie(session.id);

    return { session, cookie };
  }

  async invalidateSession(sessionId: string): Promise<{ blankCookie: Cookie }> {
    await this.lucia.invalidateSession(sessionId);

    const blankCookie = this.lucia.createBlankSessionCookie();

    return { blankCookie };
  }

  generateUserId(): string {
    return generateIdFromEntropySize(10);
  }
}

interface DatabaseUserAttributes {
  username: string;
}

declare module 'lucia' {
  interface Register {
    Lucia: Lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
