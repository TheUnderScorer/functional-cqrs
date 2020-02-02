import {
  CommandsBus,
  Event,
  EventHandler,
  EventHandlersStore,
  EventsBus,
  QueriesBus,
} from '@functional-cqrs/typings';

export const createEventsBus = <Context = any>(store: EventHandlersStore) => (
  context: Context
): EventsBus => {
  let commandsBus: CommandsBus;
  let queriesBus: QueriesBus;

  return {
    dispatch: async <EventType extends Event = Event>(event: EventType) => {
      const handlers = (store.get(event.event) ?? []) as Array<
        EventHandler<EventType, Context>
      >;

      if (handlers.length) {
        await Promise.all(
          handlers.map(handler =>
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
    setCommandsBus: bus => {
      commandsBus = bus;
    },
    setQueriesBus: bus => {
      queriesBus = bus;
    },
  };
};
