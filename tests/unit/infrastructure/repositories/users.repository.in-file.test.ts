import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { existsSync, rmSync } from 'node:fs';

import { createUserFactory } from '@/src/entities/models/create-user.factory';
import { userFactory } from '@/src/entities/models/user.factory';
import { InFileUsersRepository } from '@/src/infrastructure/repositories/users.repository.in-file';
import { readUsersFile, writeUsersFile } from './in-file-helpers';

const TEST_FILE = 'in-file-users.unit.local.json';

describe(`${InFileUsersRepository.name}`, () => {
  beforeEach(() => {
    rmSync(TEST_FILE, { force: true });
  });

  afterAll(() => {
    rmSync(TEST_FILE, { force: true });
  });

  describe('when the file does not exist', () => {
    it('does not create the file on construction', () => {
      new InFileUsersRepository(TEST_FILE);

      expect(existsSync(TEST_FILE)).toBe(false);
    });

    it('reads as an empty store without creating the file', async () => {
      const repo = new InFileUsersRepository(TEST_FILE);

      expect(await repo.getUser('nope')).toBeUndefined();
      expect(existsSync(TEST_FILE)).toBe(false);
    });

    it('creates the file once a write happens', async () => {
      const repo = new InFileUsersRepository(TEST_FILE);

      await repo.createUser(createUserFactory.item());

      expect(existsSync(TEST_FILE)).toBe(true);
    });
  });

  describe('getUser', () => {
    it('returns the matching user', async () => {
      const [first, second] = userFactory.list({ count: 2 });
      writeUsersFile(TEST_FILE, [first, second]);
      const repo = new InFileUsersRepository(TEST_FILE);

      expect(await repo.getUser(second.id)).toEqual(second);
    });

    it('returns undefined when not found', async () => {
      writeUsersFile(TEST_FILE, userFactory.list({ count: 1 }));
      const repo = new InFileUsersRepository(TEST_FILE);

      expect(await repo.getUser('nope')).toBeUndefined();
    });
  });

  describe('getUserByUsername', () => {
    it('returns the matching user', async () => {
      const [first, second] = userFactory.list({ count: 2 });
      writeUsersFile(TEST_FILE, [first, second]);
      const repo = new InFileUsersRepository(TEST_FILE);

      expect(await repo.getUserByUsername(second.username)).toEqual(second);
    });

    it('returns undefined when not found', async () => {
      writeUsersFile(TEST_FILE, userFactory.list({ count: 1 }));
      const repo = new InFileUsersRepository(TEST_FILE);

      expect(await repo.getUserByUsername('nobody')).toBeUndefined();
    });
  });

  describe('createUser', () => {
    it('stores the plaintext password as the hash, and persists', async () => {
      writeUsersFile(TEST_FILE, []);
      const repo = new InFileUsersRepository(TEST_FILE);
      const input = createUserFactory.item();

      const created = await repo.createUser(input);

      expect(created).toEqual({
        id: input.id,
        username: input.username,
        password_hash: input.password,
      });
      expect(readUsersFile(TEST_FILE)).toEqual([created]);
    });
  });

  it('persists across instances (file-backed, not in-memory)', async () => {
    writeUsersFile(TEST_FILE, []);
    const input = createUserFactory.item();
    await new InFileUsersRepository(TEST_FILE).createUser(input);

    // A brand-new instance reads back the previously written data.
    const found = await new InFileUsersRepository(TEST_FILE).getUserByUsername(
      input.username
    );

    expect(found).toEqual({
      id: input.id,
      username: input.username,
      password_hash: input.password,
    });
  });
});
