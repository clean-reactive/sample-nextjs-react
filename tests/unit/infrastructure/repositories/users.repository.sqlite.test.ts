import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { compare } from 'bcrypt-ts';

import { SqliteUsersRepository } from '@/src/infrastructure/repositories/users.repository.sqlite';
import { createUserFactory } from '@/src/entities/models/create-user.factory';
import { userFactory } from '@/src/entities/models/user.factory';
import {
  clearSqliteTestDb,
  getAllUsers,
  insertTestUser,
  migrateSqliteTestDb,
  newSqliteTestConnection,
} from './sqlite-helpers';

describe(`${SqliteUsersRepository.name}`, () => {
  const connection = newSqliteTestConnection();
  const repo = new SqliteUsersRepository(connection);

  beforeAll(async () => {
    await migrateSqliteTestDb(connection);
  });

  beforeEach(async () => {
    await clearSqliteTestDb(connection);
  });

  describe('createUser', () => {
    it('hashes the password and persists the row', async () => {
      const input = createUserFactory.item();

      const created = await repo.createUser(input);

      expect(created.id).toBe(input.id);
      expect(created.username).toBe(input.username);
      expect(created.password_hash).not.toBe(input.password);
      expect(await compare(input.password, created.password_hash)).toBe(true);
      expect(await getAllUsers(connection)).toEqual([created]);
    });

    it('rejects a duplicate id', async () => {
      const input = createUserFactory.item();
      await insertTestUser(connection, input.id);

      await expect(repo.createUser(input)).rejects.toThrow();
    });
  });

  describe('getUser', () => {
    it('returns the matching user', async () => {
      const { id } = userFactory.item();
      await insertTestUser(connection, id);
      const [seeded] = await getAllUsers(connection);

      expect(await repo.getUser(id)).toEqual(seeded);
    });

    it('returns undefined when not found', async () => {
      expect(await repo.getUser('nope')).toBeUndefined();
    });
  });

  describe('getUserByUsername', () => {
    it('returns the matching user', async () => {
      const { id } = userFactory.item();
      await insertTestUser(connection, id);
      const [seeded] = await getAllUsers(connection);

      expect(await repo.getUserByUsername(seeded.username)).toEqual(seeded);
    });

    it('returns undefined when not found', async () => {
      expect(await repo.getUserByUsername('nobody')).toBeUndefined();
    });
  });
});
