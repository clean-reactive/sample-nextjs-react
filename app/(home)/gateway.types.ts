// NOTE(harunou): Add todo action.
export type AddTodoAction = (
  formData: FormData
) => Promise<AddTodoActionSuccess | AddTodoActionFailure>;

export type AddTodoActionSuccess = { status: 'success' };

export type AddTodoFailureCode =
  'invalid_data' | 'unauthenticated' | 'unexpected_error';

export type AddTodoActionFailure = {
  status: 'failure';
  code: AddTodoFailureCode;
};

// NOTE(harunou): Bulk update action.
export type BulkUpdateAction = (
  dirty: number[],
  deleted: number[]
) => Promise<BulkUpdateActionSuccess | BulkUpdateActionFailure>;

export type BulkUpdateActionSuccess = { status: 'success' };

export type BulkUpdateFailureCode =
  'invalid_data' | 'unauthenticated' | 'not_found' | 'unexpected_error';

export type BulkUpdateActionFailure = {
  status: 'failure';
  code: BulkUpdateFailureCode;
};

// NOTE(harunou): Toggle todo action.
export type ToggleTodoAction = (
  todoId: number
) => Promise<ToggleTodoActionSuccess | ToggleTodoActionFailure>;

export type ToggleTodoActionSuccess = { status: 'success' };

export type ToggleTodoFailureCode =
  'invalid_data' | 'unauthenticated' | 'not_found' | 'unexpected_error';

export type ToggleTodoActionFailure = {
  status: 'failure';
  code: ToggleTodoFailureCode;
};

// NOTE(harunou): Sign out action.
export type SignOutAction = () => Promise<void>;
