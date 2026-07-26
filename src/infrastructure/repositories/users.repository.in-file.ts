import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { must } from '@/lib/utils';
import { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import type { CreateUser, User } from '@/src/entities/models/user';

export class InFileUsersRepository implements IUsersRepository {
  constructor(
    private readonly file: string = must(process.env.IN_FILE_USERS_FILE)
  ) {}

  private load(): User[] {
    if (!existsSync(this.file)) {
      return [];
    }
    return JSON.parse(readFileSync(this.file, 'utf8')) as User[];
  }

  private save(users: User[]): void {
    writeFileSync(this.file, JSON.stringify(users, null, 2));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.load().find((u) => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.load().find((u) => u.username === username);
  }

  async createUser(input: CreateUser): Promise<User> {
    const users = this.load();
    const newUser: User = {
      id: input.id,
      username: input.username,
      password_hash: input.password,
    };
    this.save([...users, newUser]);
    return newUser;
  }
}
