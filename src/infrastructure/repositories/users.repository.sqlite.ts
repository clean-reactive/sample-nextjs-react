import { eq } from 'drizzle-orm';
import { hash } from 'bcrypt-ts';

import { DrizzleConnection } from '@/drizzle';
import { users } from '@/drizzle/schema';
import { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import { DatabaseOperationError } from '@/src/entities/errors/common';
import type { CreateUser, User } from '@/src/entities/models/user';
import { PASSWORD_SALT_ROUNDS } from '@/config';

export class SqliteUsersRepository implements IUsersRepository {
  constructor(
    private readonly connection: DrizzleConnection = DrizzleConnection.make()
  ) {}

  private get db() {
    return this.connection.db;
  }

  async getUser(id: string): Promise<User | undefined> {
    const query = this.db.query.users.findFirst({
      where: eq(users.id, id),
    });

    const user = await query.execute();

    return user;
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    const query = this.db.query.users.findFirst({
      where: eq(users.username, username),
    });

    const user = await query.execute();

    return user;
  }
  async createUser(input: CreateUser): Promise<User> {
    const password_hash = await hash(input.password, PASSWORD_SALT_ROUNDS);

    const newUser: User = {
      id: input.id,
      username: input.username,
      password_hash,
    };
    const query = this.db.insert(users).values(newUser).returning();

    const [created] = await query.execute();

    if (created) {
      return created;
    } else {
      throw new DatabaseOperationError('Cannot create user.');
    }
  }
}
