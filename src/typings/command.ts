import {
  ClassHandler,
  CommandLike,
  HandlerFn,
  ResolvedHandlerResult,
} from './handler';
import { HandlersMap } from './core';

export type Command<Payload = any, Type extends string = string> = CommandLike<
  Payload,
  Type
>;

export interface CommandsBusInterface<
  Handlers extends HandlersMap<CommandHandler | CommandHandlerFn> = HandlersMap<
    CommandHandler | CommandHandlerFn
  >
> {
  execute: <CommandType extends Command = Command>(
    command: Readonly<CommandType>
  ) => ResolvedHandlerResult<Handlers, CommandType>;
}

export type CommandHandler<
  CommandType extends Command = Command,
  ReturnValue = unknown
> = ClassHandler<CommandType, ReturnValue>;

export type CommandHandlerFn<
  CommandType extends Command<any, any> = Command<any, any>,
  ReturnValue = any
> = HandlerFn<CommandType, ReturnValue>;
