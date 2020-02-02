import {
  CommandsBus,
  Event,
  EventHandler,
  EventsBus,
} from '@functional-cqrs/typings';
import { eventHandlersStore } from '@functional-cqrs/stores';

export const createEventsBus = <Context = any>(context: Context): EventsBus => {
  let commandsBus: CommandsBus;

  return {
    dispatch: async <EventType extends Event = Event>(event: Event) => {
      const handlers = (eventHandlersStore.get(event.event) ?? []) as Array<
        EventHandler<EventType, Context>
      >;

      if (handlers.length) {
        await Promise.all(
          handlers.map(handler =>
            handler({
              ...context,
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
  };
};
