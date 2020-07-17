import {
  CommandsBus,
  EventHandler,
  EventHandlersStore,
  EventsBus,
  QueriesBus,
  Event,
} from '@functional-cqrs/typings';

export interface PrivateEventsBus<Context> extends EventsBus<Context> {
  setCommandsBus: (bus: CommandsBus) => void;
  setQueriesBus: (bus: QueriesBus) => void;
}

export const createEventsBus = <Context = any>(store: EventHandlersStore) => (
  context: Context
): PrivateEventsBus<Context> => {
  let commandsBus: CommandsBus;
  let queriesBus: QueriesBus;

  return {
    dispatch: async <EventType extends Event = Event>(event: EventType) => {
      const handlers = (store.get(event.event) ?? []) as Array<
        EventHandler<EventType, Context>
      >;

      if (handlers.length) {
        await Promise.all(
          handlers.map((handler) =>
            handler({
              ...context,
              queriesBus,
              commandsBus,
            })(event)
          )
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
  };
};
