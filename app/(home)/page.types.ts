export type TodoEntity = {
  id: number;
  todo: string;
  userId: string;
  completed: boolean;
};

export type TemplateData = { todos: TodoEntity[] };

export type HomePageAction = () => Promise<TemplateData>;
