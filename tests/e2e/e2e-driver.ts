import { getInjection } from '@/di/container';
import { Cookie } from '@/src/entities/models/cookie';
import { passwordFactory } from '@/src/entities/models/password.factory';
import { usernameFactory } from '@/src/entities/models/username.factory';

type TodoResponse = {
  id: number;
  todo: string;
  userId: string;
  completed: boolean;
};

export interface IE2EDriver {
  uniqueUsername(prefix?: string): string;
  createUser(
    username?: string
  ): Promise<{ username: string; sessionCookie: Cookie }>;
  createTodo(sessionId: string, todo: string): Promise<TodoResponse>;
  getTodos(sessionId: string): Promise<TodoResponse[]>;
}

export class E2EDriver {
  static readonly TEST_PASSWORD = passwordFactory.item().password;
  static make(
    type: 'interface-adapter' | 'repository' = 'interface-adapter'
  ): IE2EDriver {
    if (type === 'interface-adapter') {
      return new InterfaceAdapterE2EDriver();
    }
    return new RepositoryE2EDriver();
  }
}

class InterfaceAdapterE2EDriver implements IE2EDriver {
  uniqueUsername(prefix = 'u'): string {
    const { username } = usernameFactory.item();
    return `${prefix}-${Date.now().toString(36)}-${username}`;
  }

  async createUser(
    username = this.uniqueUsername()
  ): Promise<{ username: string; sessionCookie: Cookie }> {
    const signUpController = getInjection('ISignUpE2eController');
    const sessionCookie = await signUpController({
      username,
      password: E2EDriver.TEST_PASSWORD,
      confirm_password: E2EDriver.TEST_PASSWORD,
    });

    return { username, sessionCookie };
  }

  async createTodo(sessionId: string, todo: string): Promise<TodoResponse> {
    const createTodoController = getInjection('ICreateTodoE2eController');
    return createTodoController({ todo, sessionId });
  }

  async getTodos(sessionId: string): Promise<TodoResponse[]> {
    const getTodosController = getInjection('IGetTodosForUserE2eController');
    return getTodosController(sessionId);
  }
}

class RepositoryE2EDriver implements IE2EDriver {
  uniqueUsername(prefix = 'u'): string {
    void prefix;
    throw new Error('Method not implemented.');
  }

  async createUser(
    username = this.uniqueUsername()
  ): Promise<{ username: string; sessionCookie: Cookie }> {
    void username;
    throw new Error('Method not implemented.');
  }

  async createTodo(sessionId: string, todo: string): Promise<TodoResponse> {
    void sessionId;
    void todo;
    throw new Error('Method not implemented.');
  }

  async getTodos(sessionId: string): Promise<TodoResponse[]> {
    void sessionId;
    throw new Error('Method not implemented.');
  }
}
