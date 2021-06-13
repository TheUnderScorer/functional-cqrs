import { Event } from 'functional-cqrs';
import { Todo } from '../types';

export class TodoCreatedEvent implements Event<Todo> {
  constructor(readonly payload: Todo) {}
}
