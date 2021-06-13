import { TodoCreatedEvent } from './TodoCreated.event';
import { EventContext } from 'functional-cqrs';

export const onTodoCreated = (
  event: TodoCreatedEvent,
  context: EventContext
) => {
  console.log('Todo created:', {
    event,
    context,
  });
};
