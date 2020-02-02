import { sync as globSync } from 'glob';
import {
  CommandHandler,
  CommandHandlersStore,
  EventHandler,
  EventHandlersStore,
  Module,
  QueryHandler,
  QueryHandlersStore,
} from '@functional-cqrs/typings';
import importHandlers from './import-handlers';
import createBuses from './create-buses';

export interface CqrsConfig<Context = any> {
  commandHandlersPath?: string[];
  eventHandlersPath?: string[];
  queryHandlersPath?: string[];
  importer?: (path: string) => Promise<Module>;
  context?: Context;
  globHandler?: (path: string) => string[];
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
  importer = async path => import(path),
  context,
  globHandler = globSync,
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

  return {
    loadedHandlers,
    buses: createBuses(stores, context),
  };
};
