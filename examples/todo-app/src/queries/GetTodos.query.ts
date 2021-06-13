import { Query } from 'functional-cqrs';

export interface GetTodosPayload {
  limit?: number;
}

export const GetTodos = 'GetTodos' as const;

export class GetTodosQuery implements Query<GetTodosPayload> {
  name = GetTodos;

  constructor(readonly payload: GetTodosPayload) {}
}
