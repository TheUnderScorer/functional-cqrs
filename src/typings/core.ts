import { QueryHandler, QueryHandlerFn } from './query';
import { EventHandlerFn, EventSubscriber } from './event';
import { CommandHandler, CommandHandlerFn } from './command';
import { Constructor } from './common';
import { CommandsBus } from '../buses/CommandsBus';
import { QueriesBus } from '../buses/QueriesBus';
import { EventsBus } from '../buses/EventsBus';
import { Buses } from './buses';

export type HandlersMap<HandlerType = any, Keys extends string = string> = {
  [Key in Keys]: HandlerType;
};

export interface CqrsResult<
  CommandHandlers extends CommandHandlersMap,
  QueryHandlers extends QueryHandlersMap
> {
  buses: Buses<CommandHandlers, QueryHandlers>;
}

export type CommandHandlersMap = HandlersMap<CommandHandlerFn | CommandHandler>;

export type QueryHandlersMap = HandlersMap<QueryHandlerFn | QueryHandler>;

export type EventHandlersMap = HandlersMap<EventHandlerFn[]>;

export interface CqrsConfig<
  CommandHandlers extends CommandHandlersMap,
  QueryHandlers extends QueryHandlersMap
> {
  commandHandlers?: CommandHandlers;
  queryHandlers?: QueryHandlers;
  eventHandlers?: EventHandlersMap;
  subscribers?: EventSubscriber<object>[];
  CommandsBusConstructor?: Constructor<CommandsBus>;
  QueriesBusConstructor?: Constructor<QueriesBus>;
  EventsBusConstructor?: Constructor<EventsBus>;
}
