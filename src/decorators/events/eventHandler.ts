/* eslint-disable no-shadow */
import { Event, EventHandler, EventHandlersStore } from '../../typings';
import { pipe } from 'ramda';

type EventHandlerTuple = [EventHandlersStore, EventHandler[]];

// TODO Refactor to not use pipe from ramda
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
        `Provided handler is already registered for event ${type}.`
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