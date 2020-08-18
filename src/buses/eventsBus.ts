import {
  CommandsBus,
  Event,
  EventHandlerFunction,
  EventHandlersStore,
  EventsBus,
  EventSubscriber,
  isEventSubscriber,
  QueriesBus,
} from '../typings';

export interface PrivateEventsBus<Context> extends EventsBus<Context> {
  setCommandsBus: (bus: CommandsBus) => void;
  setQueriesBus: (bus: QueriesBus) => void;
  invokeSubscribers: () => void;
}

export type InvokedSubscriber =
  | ReturnType<EventHandlerFunction>
  | EventSubscriber<any>;

export interface InvokedSubscribers {
  [key: string]: InvokedSubscriber[];
}

export const createEventsBus = <Context = any>(store: EventHandlersStore) => (
  context: Context
): PrivateEventsBus<Context> => {
  let commandsBus: CommandsBus;
  let queriesBus: QueriesBus;

  let invokedSubscribers: InvokedSubscribers;

  return {
    dispatch: async <EventType extends Event = Event>(event: EventType) => {
      const handlers: InvokedSubscriber[] =
        invokedSubscribers[event.event] ?? [];

      if (handlers.length) {
        await Promise.all(
          handlers.map((handler) => {
            if (isEventSubscriber(handler)) {
              return handler[event.event](event);
            }

            return (handler as ReturnType<EventHandlerFunction>)(event);
          })
        );
      } else {
        console.warn(`No handlers found for event "${event.event}"`);
      }
    },

    setCommandsBus: (bus) => {
      commandsBus = bus;
    },
    setQueriesBus: (bus) => {
      queriesBus = bus;
    },
    invokeSubscribers: () => {
      invokedSubscribers = Array.from(store.entries()).reduce<
        InvokedSubscribers
      >((subscribers, [event, handlers]) => {
        subscribers[event] = handlers.map((handler) =>
          handler({
            ...context,
            commandsBus,
            queriesBus,
          })
        );

        return subscribers;
      }, {});
    },
  };
};
