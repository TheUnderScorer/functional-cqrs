import { TodoRepository } from '../types';
import { GetTodosQuery } from './GetTodos.query';
import { QueryHandler } from 'functional-cqrs';

export class GetTodosHandler implements QueryHandler<GetTodosQuery> {
  constructor(private readonly repository: TodoRepository) {}

  handle({ payload: { limit } }: GetTodosQuery) {
    const todos = Array.from(this.repository.values());

    return limit ? todos.slice(0, limit) : todos;
  }
}
