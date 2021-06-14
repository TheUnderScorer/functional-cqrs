import { createBuses } from './createBuses';
import {
  CommandHandlersMap,
  CqrsConfig,
  CqrsResult,
  QueryHandlersMap,
} from '../types/core';

export const createCqrs = <
  CommandHandlers extends CommandHandlersMap,
  QueryHandlers extends QueryHandlersMap
>({
  commandHandlers = {} as CommandHandlers,
  queryHandlers = {} as QueryHandlers,
  eventHandlers = {},
  subscribers = [],
  ...rest
}: CqrsConfig<CommandHandlers, QueryHandlers>): CqrsResult<
  CommandHandlers,
  QueryHandlers
> => {
  return {
    buses: createBuses({
      ...rest,
      subscribers,
      eventHandlers,
      commandHandlers,
      queryHandlers,
    }),
  };
};
