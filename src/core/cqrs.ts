import { createBuses } from './createBuses';

import { Buses } from '../typings/buses';
import {
  CommandHandlerMetadataStore,
  getCommandHandlersByHandlers,
} from '../stores/metadata/commandHandlerMetadataStore';
import {
  getQueryHandlersByHandlers,
  QueryHandlerMetadataStore,
} from '../stores/metadata/queryHandlerMetadataStore';
import {
  EventHandlerMetadataStore,
  getEventHandlersByHandlers,
} from '../stores/metadata/eventHandlerMetadataStore';
import { Constructor } from '../typings/common';

type HandlerToRegister = ((...args: any[]) => any) | Constructor<any>;

// TODO Specify which classes to load
export interface CqrsConfig<Context = any> {
  context?: Context | ((buses: Buses) => Context);
  commandHandlers?: HandlerToRegister[];
  eventHandlers?: HandlerToRegister[];
  queryHandlers?: HandlerToRegister[];
}

export interface Stores {
  commandHandlersStore: CommandHandlerMetadataStore;
  eventHandlersStore: EventHandlerMetadataStore;
  queryHandlersStore: QueryHandlerMetadataStore;
}

export const createCqrs = async <Context = any>({
  context,
  eventHandlers = [],
  commandHandlers = [],
  queryHandlers = [],
}: CqrsConfig<Context> = {}) => {
  const commandHandlersStore = getCommandHandlersByHandlers(
    commandHandlers ?? []
  );

  const queryHandlersStore = getQueryHandlersByHandlers(queryHandlers ?? []);

  const eventHandlersStore = getEventHandlersByHandlers(eventHandlers ?? []);

  const stores: Stores = {
    commandHandlersStore,
    queryHandlersStore,
    eventHandlersStore,
  };

  return {
    buses: createBuses(stores, context),
  };
};
