import { createBuses } from './createBuses';
import { CqrsConfig } from '../typings/core';

export const createCqrs = async ({
  commandHandlers = {},
  queryHandlers = {},
  eventHandlers = {},
  subscribers = [],
  ...rest
}: CqrsConfig = {}) => {
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
