import { Command } from 'functional-cqrs';
import { Todo } from '../types';

export const CreateTodo = 'CreateTodo' as const;

export class CreateTodoCommand implements Command<Todo> {
  name = CreateTodo;

  constructor(readonly payload: Todo) {}
}
