import { Buses } from '../typings/buses';
import {
  CommandHandlersMap,
  CqrsConfig,
  QueryHandlersMap,
} from '../typings/core';
import { CommandsBus } from '../buses/CommandsBus';
import { QueriesBus } from '../buses/QueriesBus';
import { EventsBus } from '../buses/EventsBus';

export const createBuses = <
  CommandHandlers extends CommandHandlersMap,
  QueryHandlers extends QueryHandlersMap
>({
  commandHandlers,
  queryHandlers,
  eventHandlers,
  subscribers,
  EventsBusConstructor = EventsBus,
  CommandsBusConstructor = CommandsBus,
  QueriesBusConstructor = QueriesBus,
}: CqrsConfig<CommandHandlers, QueryHandlers>): Buses<
  CommandHandlers,
  QueryHandlers
> => {
  const commandsBus = new CommandsBusConstructor(commandHandlers);
  const eventsBus = new EventsBusConstructor(subscribers, eventHandlers);
  const queriesBus = new QueriesBusConstructor(queryHandlers);

  return {
    commandsBus,
    eventsBus,
    queriesBus,
  };
};
