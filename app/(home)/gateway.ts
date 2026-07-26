import { bulkUpdateAction } from './actions/bulk-update.action';
import { createTodoAction } from './actions/create-todo.action';
import { signOutAction } from './actions/sign-out.action';
import { toggleTodoAction } from './actions/toggle-todo.action';
import type { HomePageGateway } from './gateway.types';

export const makeHomePageGateway = (): HomePageGateway => ({
  addTodo: createTodoAction,
  bulkUpdate: bulkUpdateAction,
  toggleTodo: toggleTodoAction,
  signOut: signOutAction,
});
