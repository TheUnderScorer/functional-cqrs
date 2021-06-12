import { QueryHandler, QueryHandlerFn } from './query';
import { CreateBusesParams } from '../core/createBuses';
import { EventHandlerFn } from './event';
import { CommandHandler, CommandHandlerFn } from './command';

export type HandlersMap<HandlerType> = {
  [key: string]: HandlerType;
};

export type CommandHandlersMap = HandlersMap<CommandHandlerFn | CommandHandler>;

export type QueryHandlersMap = HandlersMap<QueryHandlerFn | QueryHandler>;

export type EventHandlersMap = HandlersMap<EventHandlerFn[]>;

export type CqrsConfig = Pick<
  CreateBusesParams,
  'CommandsBusConstructor' | 'EventsBusConstructor' | 'QueriesBusConstructor'
> &
  Pick<
    Partial<CreateBusesParams>,
    'eventHandlers' | 'commandHandlers' | 'subscribers' | 'queryHandlers'
  >;
