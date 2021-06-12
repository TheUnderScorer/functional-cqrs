import { CommandsBusInterface } from './command';
import { QueriesBusInterface } from './query';
import { EventsBusInterface } from './event';
import { CommandHandlersMap, QueryHandlersMap } from './core';

export interface Buses<
  CommandHandlers extends CommandHandlersMap,
  QueryHandlers extends QueryHandlersMap
> {
  commandsBus: CommandsBusInterface<CommandHandlers>;
  queriesBus: QueriesBusInterface<QueryHandlers>;
  eventsBus: EventsBusInterface;
}
