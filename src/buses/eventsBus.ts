import {
  CommandsBus,
  Event,
  EventContext,
  EventHandlerFn,
  EventsBus,
  QueriesBus,
} from '../typings';
import {
  EventHandlerDefinition,
  EventHandlerMetadataItem,
  EventHandlerMetadataStore,
} from '../stores/metadata/eventHandlerMetadataStore';
import { Constructor } from '../typings/common';
import { storeToArray } from '../utils';

export interface PrivateEventsBus<Context> extends EventsBus<Context> {
  setCommandsBus: (bus: CommandsBus) => void;
  setQueriesBus: (bus: QueriesBus) => void;
  setContext: (context: Context) => void;
  loadClasses: () => void;
}

export const createEventsBus = <Context = any>(
  store: EventHandlerMetadataStore,
  initialContext?: Context
): PrivateEventsBus<Context> => {
  let context: Context | undefined = initialContext;
  let commandsBus: CommandsBus;
  let queriesBus: QueriesBus;

  const getFullContext = (): EventContext<Context> => ({
    ...context!,
    commandsBus,
    queriesBus,
  });

  const loadClassInstances = () => {
    return storeToArray(store).reduce((instanceStore, value) => {
      if (value.type === 'function') {
        return instanceStore;
      }

      const instance = new (value.handler as Constructor<any>)(
        getFullContext()
      );

      instanceStore.set(value.name, instance);

      return instanceStore;
    }, new Map<string, Record<string, any>>());
  };
  let classInstances = loadClassInstances();

  const getHandlersForEvent = (eventName: string) => {
    return storeToArray(store).filter(
      ({ eventName: handlerEventName, handlers }) => {
        return (
          handlerEventName === eventName ||
          Boolean(
            handlers?.find((entry: EventHandlerDefinition) => entry.eventName)
          )
        );
      }
    );
  };

  const callEventHandler = async <EventType extends Event>(
    event: EventType,
    handlerMeta: EventHandlerMetadataItem<any>
  ) => {
    if (handlerMeta.type === 'function') {
      await (handlerMeta.handler as EventHandlerFn<EventType, Context>)({
        event,
        context: getFullContext(),
      });

      return;
    }

    const instance = classInstances.get(handlerMeta.name);

    if (!instance) {
      return;
    }

    const filteredDefinitions = handlerMeta.handlers!.filter(
      (definition) => definition.eventName === event.name
    );

    await Promise.all(
      filteredDefinitions.map((definition) => {
        if (!instance[definition.method]) {
          throw new Error(
            `Class ${handlerMeta.name} does not have method "${definition.method}"`
          );
        }

        return instance[definition.method](event);
      })
    );
  };

  const callEventHandlers = async (event: Event) => {
    const handlers = getHandlersForEvent(event.name);

    if (!handlers.length) {
      return;
    }

    await Promise.all(
      handlers.map((handler) => callEventHandler(event, handler))
    );
  };

  return {
    dispatch: async <EventType extends Event = Event>(event: EventType) => {
      await callEventHandlers(event);
    },
    setContext: (newContext: Context) => {
      context = newContext;

      classInstances = loadClassInstances();
    },
    setCommandsBus: (bus) => {
      commandsBus = bus;
    },
    setQueriesBus: (bus) => {
      queriesBus = bus;
    },
    loadClasses: () => {
      classInstances = loadClassInstances();
    },
  };
};
