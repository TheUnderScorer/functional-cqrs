import {
  createCommandBus,
  createEventsBus,
  createQueriesBus,
} from '@functional-cqrs/buses';
import { Stores } from './cqrs';

const createBuses = <Context = any>(
  { commandHandlersStore, eventHandlersStore, queryHandlersStore }: Stores,
  context?: Context
) => {
  const commandsBus = createCommandBus(commandHandlersStore)(context);
  const eventsBus = createEventsBus(eventHandlersStore)(context);
  const queriesBus = createQueriesBus(queryHandlersStore)(context);

  commandsBus.setEventsBus(eventsBus);
  commandsBus.setQueriesBus(queriesBus);

  eventsBus.setCommandsBus(commandsBus);
  eventsBus.setQueriesBus(queriesBus);

  queriesBus.setEventsBus(eventsBus);

  return {
    commandsBus,
    eventsBus,
    queriesBus,
  };
};

export default createBuses;
