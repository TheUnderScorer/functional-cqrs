import { CommandsBus, EventsBus, QueriesBus } from '../buses';
import { Stores } from './cqrs';
import { Buses } from '../typings/buses';
import { ContextCreator } from '../typings/context';
import { ContextManager } from '../context/ContextManager';
import { Constructor } from '../typings/common';

export interface CreateBusesParams<Context> {
  stores: Stores;
  context?: Context | ContextCreator<Context>;
  CommandsBusConstructor?: Constructor<CommandsBus<Context>>;
  QueriesBusConstructor?: Constructor<QueriesBus<Context>>;
  EventsBusConstructor?: Constructor<EventsBus<Context>>;
}

export const createBuses = <Context = any>({
  context,
  stores: { queryHandlersStore, eventHandlersStore, commandHandlersStore },
  EventsBusConstructor = EventsBus,
  CommandsBusConstructor = CommandsBus,
  QueriesBusConstructor = QueriesBus,
}: CreateBusesParams<Context>): Buses => {
  const isContextCreator = typeof context === 'function';
  const initialContext = isContextCreator ? undefined : context;

  const contextManager = new ContextManager<Context>(initialContext as Context);

  const commandsBus = new CommandsBusConstructor(
    commandHandlersStore,
    contextManager
  );
  const eventsBus = new EventsBusConstructor(
    eventHandlersStore,
    contextManager
  );
  const queriesBus = new QueriesBusConstructor(
    queryHandlersStore,
    contextManager
  );

  contextManager.setCommandsBus(commandsBus);
  contextManager.setEventsBus(eventsBus);
  contextManager.setQueriesBus(queriesBus);

  const buses = {
    commandsBus,
    eventsBus,
    queriesBus,
  };

  if (isContextCreator) {
    const createdContext = (context as ContextCreator<Context>)(buses);
    contextManager.setContext(createdContext);
  }

  return buses;
};
