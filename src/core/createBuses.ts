import { createCommandBus, createEventsBus, createQueriesBus } from '../buses';
import { Stores } from './cqrs';
import { Buses } from '../typings/buses';
import { ContextCreator } from '../typings/context';

export const createBuses = <Context = any>(
  { commandHandlersStore, eventHandlersStore, queryHandlersStore }: Stores,
  context?: Context | ContextCreator<Context>
): Buses => {
  const isContextCreator = typeof context === 'function';
  const initialContext = isContextCreator ? undefined : context;

  const commandsBus = createCommandBus(commandHandlersStore, initialContext);
  const eventsBus = createEventsBus(eventHandlersStore, initialContext);
  const queriesBus = createQueriesBus(queryHandlersStore, initialContext);

  commandsBus.setEventsBus(eventsBus);
  commandsBus.setQueriesBus(queriesBus);

  eventsBus.setCommandsBus(commandsBus);
  eventsBus.setQueriesBus(queriesBus);

  queriesBus.setEventsBus(eventsBus);

  const buses = {
    commandsBus,
    eventsBus,
    queriesBus,
  };

  if (isContextCreator) {
    const createdContext = (context as ContextCreator<Context>)(buses);
    eventsBus.setContext(createdContext);
    commandsBus.setContext(createdContext);
    queriesBus.setContext(createdContext);
  }

  eventsBus.loadClasses();
  queriesBus.loadClasses();
  commandsBus.loadClasses();

  return buses;
};
