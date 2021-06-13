import {
  ClassHandler,
  CommandLike,
  HandlerFn,
  ResolvedHandlerResult,
} from './handler';
import { HandlersMap } from './core';
import { EventsBusInterface } from './event';
import { BaseBusInterface } from './buses';

export type Command<Payload = any, Type extends string = string> = CommandLike<
  Payload,
  Type
>;

export interface CommandContext {
  eventsBus: EventsBusInterface;
}

export interface CommandsBusInterface<
  Handlers extends HandlersMap<CommandHandler | CommandHandlerFn> = HandlersMap<
    CommandHandler | CommandHandlerFn
  >
> extends BaseBusInterface<CommandContext> {
  execute: <CommandType extends Command = Command>(
    command: Readonly<CommandType>
  ) => ResolvedHandlerResult<Handlers, CommandType>;
}

export type CommandHandler<
  CommandType extends Command = Command,
  ReturnValue = unknown
> = ClassHandler<CommandType, ReturnValue, CommandContext>;

export type CommandHandlerFn<
  CommandType extends Command<any, any> = Command<any, any>,
  ReturnValue = any
> = HandlerFn<CommandType, ReturnValue, CommandContext>;
