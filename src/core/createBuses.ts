import { Buses } from '../typings/buses';
import { Constructor } from '../typings/common';
import {
  CommandHandlersMap,
  EventHandlersMap,
  QueryHandlersMap,
} from '../typings/core';
import { EventSubscriber } from '../typings';
import { CommandsBus } from '../buses/CommandsBus';
import { QueriesBus } from '../buses/QueriesBus';
import { EventsBus } from '../buses/EventsBus';

export interface CreateBusesParams {
  commandHandlers: CommandHandlersMap;
  queryHandlers: QueryHandlersMap;
  eventHandlers: EventHandlersMap;
  subscribers: EventSubscriber<object>[];
  CommandsBusConstructor?: Constructor<CommandsBus>;
  QueriesBusConstructor?: Constructor<QueriesBus>;
  EventsBusConstructor?: Constructor<EventsBus>;
}

export const createBuses = ({
  commandHandlers,
  queryHandlers,
  eventHandlers,
  subscribers,
  EventsBusConstructor = EventsBus,
  CommandsBusConstructor = CommandsBus,
  QueriesBusConstructor = QueriesBus,
}: CreateBusesParams): Buses => {
  const commandsBus = new CommandsBusConstructor(commandHandlers);
  const eventsBus = new EventsBusConstructor(subscribers, eventHandlers);
  const queriesBus = new QueriesBusConstructor(queryHandlers);

  return {
    commandsBus,
    eventsBus,
    queriesBus,
  };
};
