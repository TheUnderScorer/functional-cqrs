import { Todo, TodoRepository } from '../types';
import { CreateTodoCommand } from './CreateTodo.command';
import { CommandContext } from 'functional-cqrs';
import { TodoCreatedEvent } from '../events/TodoCreated.event';

export const createTodoHandler =
  (repository: TodoRepository) =>
  ({ payload }: CreateTodoCommand, context: CommandContext): Todo => {
    repository.set(payload.id, payload);

    context.eventsBus.dispatch(new TodoCreatedEvent(payload));

    return payload;
  };
