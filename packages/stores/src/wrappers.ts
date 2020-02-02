import {
  Command,
  CommandHandler,
  Event,
  EventHandler,
  EventHandlersStore,
} from '@functional-cqrs/typings';
import { commandHandlersStore, eventHandlersStore } from './stores';
import { pipe } from 'ramda';

type EventHandlerTumple = [EventHandlersStore, EventHandler[]];

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
) => {
  commandHandlersStore.set(type, handler as CommandHandler);

  return handler;
};

export const eventHandler = <EventType extends Event = Event, Context = any>(
  type: EventType['event'],
  handler: EventHandler<EventType, Context>
) => {
  const getHandlers = (store: EventHandlersStore): EventHandlerTumple => [
    store,
    store.get(type) ?? [],
  ];

  const checkHandlersUniqueness = ([
    store,
    handlers,
  ]: EventHandlerTumple): EventHandlerTumple => {
    if (handlers.find(registeredHandler => registeredHandler === handler)) {
      throw new Error(
        `Provided handler "${handler.name}" is already registered for event ${type}.`
      );
    }

    return [store, handlers];
  };

  const saveHandlers = ([store, handlers]: EventHandlerTumple) => {
    handlers.push(handler);

    store.set(type, handlers);

    return [store, handlers];
  };

  try {
    pipe(
      getHandlers,
      checkHandlersUniqueness,
      saveHandlers
    )(eventHandlersStore);
  } catch (e) {
    console.error(e);
  }

  return handler;
};
