import { pipe } from 'ramda';
import {
  Command,
  CommandHandler,
  CommandHandlersStore,
  EventHandler,
  EventHandlersStore,
  Query,
  QueryHandler,
  QueryHandlersStore,
  Event,
} from '@functional-cqrs/typings';

type EventHandlerTuple = [EventHandlersStore, EventHandler[]];

/**
 * Registers new command handler into global container
 * */
export const commandHandler = <
  CommandType extends Command = Command,
  Context = any,
  ReturnValueType = any
>(
  type: CommandType['type'],
  handler: CommandHandler<CommandType, Context, ReturnValueType>
) => (store: CommandHandlersStore) => {
  if (store.has(type)) {
    console.warn(`Handler for command ${type} already exists.`);

    return handler;
  }

  store.set(type, handler as CommandHandler);

  return handler;
};

export const eventHandler = <EventType extends Event = Event, Context = any>(
  type: EventType['event'],
  handler: EventHandler<EventType, Context>
) => (store: EventHandlersStore) => {
  const getHandlers = (store: EventHandlersStore): EventHandlerTuple => [
    store,
    store.get(type) ?? [],
  ];

  const checkHandlersUniqueness = ([
    store,
    handlers,
  ]: EventHandlerTuple): EventHandlerTuple => {
    if (handlers.find((registeredHandler) => registeredHandler === handler)) {
      throw new Error(
        `Provided handler "${handler.name}" is already registered for event ${type}.`
      );
    }

    return [store, handlers];
  };

  const saveHandlers = ([store, handlers]: EventHandlerTuple) => {
    handlers.push(handler as EventHandler);

    store.set(type, handlers);

    return [store, handlers];
  };

  try {
    pipe(getHandlers, checkHandlersUniqueness, saveHandlers)(store);
  } catch (e) {
    console.error(e);
  }

  return handler;
};

export const queryHandler = <
  QueryType extends Query = Query,
  Context = any,
  ReturnValueType = any
>(
  type: QueryType['query'],
  handler: QueryHandler<QueryType, Context, ReturnValueType>
) => (store: QueryHandlersStore) => {
  if (store.has(type)) {
    console.warn(`Handler for query "${type}" already exists.`);

    return handler;
  }

  store.set(type, handler);

  return handler;
};
