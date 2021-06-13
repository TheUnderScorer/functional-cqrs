export interface Todo {
  id: string;
  name: string;
  done: boolean;
}

export type TodoRepository = Map<string, Todo>;
