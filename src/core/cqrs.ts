import { sync as globSync } from 'glob';
import {
  CommandHandler,
  CommandHandlersStore,
  EventHandler,
  EventHandlersStore,
  Module,
  QueryHandler,
  QueryHandlersStore,
} from '../typings';
import importHandlers from './importHandlers';
import createBuses from './createBuses';
import loadHandlers, { HandlerToRegister } from './loadHandlers';
import { Buses } from '../typings/buses';

export interface CqrsConfig<Context = any> {
  commandHandlersPath?: string[];
  eventHandlersPath?: string[];
  queryHandlersPath?: string[];
  importer?: (path: string) => Promise<Module>;
  context?: Context | ((buses: Buses) => Context);
  globHandler?: (path: string) => string[];
  commandHandlers?: HandlerToRegister[];
  eventHandlers?: HandlerToRegister[];
  queryHandlers?: HandlerToRegister[];
}

export interface Stores {
  commandHandlersStore: CommandHandlersStore;
  eventHandlersStore: EventHandlersStore;
  queryHandlersStore: QueryHandlersStore;
}

export const createCqrs = async <Context = any>({
  commandHandlersPath = [],
  eventHandlersPath = [],
  queryHandlersPath = [],
  importer = async (path) => import(path),
  context,
  globHandler = globSync,
  eventHandlers = [],
  commandHandlers = [],
  queryHandlers = [],
}: CqrsConfig<Context> = {}) => {
  let loadedHandlers = 0;

  const commandHandlersStore: CommandHandlersStore = new Map<
    string,
    CommandHandler<any>
  >();
  const eventHandlersStore: EventHandlersStore = new Map<
    string,
    Array<EventHandler<any>>
  >();
  const queryHandlersStore: QueryHandlersStore = new Map<
    string,
    QueryHandler<any>
  >();

  const stores: Stores = {
    commandHandlersStore,
    queryHandlersStore,
    eventHandlersStore,
  };

  if (commandHandlersPath.length) {
    loadedHandlers += await importHandlers(
      commandHandlersPath,
      importer,
      globHandler,
      commandHandlersStore
    );
  }

  if (queryHandlersPath.length) {
    loadedHandlers += await importHandlers(
      queryHandlersPath,
      importer,
      globHandler,
      queryHandlersStore
    );
  }

  if (eventHandlersPath.length) {
    loadedHandlers += await importHandlers(
      eventHandlersPath,
      importer,
      globHandler,
      eventHandlersStore
    );
  }

  if (eventHandlers.length) {
    loadedHandlers += loadHandlers({
      store: eventHandlersStore,
      handlers: eventHandlers,
    });
  }

  if (commandHandlers.length) {
    loadedHandlers += loadHandlers({
      store: commandHandlersStore,
      handlers: commandHandlers,
    });
  }

  if (queryHandlers.length) {
    loadedHandlers += loadHandlers({
      store: queryHandlersStore,
      handlers: queryHandlers,
    });
  }

  return {
    loadedHandlers,
    buses: createBuses(stores, context),
  };
};
