import { ClassHandler, CommandLike, HandlerFn } from './handler';

export type Command<Payload = any, Type extends string = string> = CommandLike<
  Payload,
  Type
>;

export interface CommandsBusInterface {
  execute: <CommandType extends Command = Command, ReturnValue = any>(
    command: Readonly<CommandType>
  ) => ReturnValue | Promise<ReturnValue>;
}

export type CommandHandler<
  CommandType extends Command = Command
> = ClassHandler<CommandType>;

export type CommandHandlerFn<
  CommandType extends Command = Command,
  ReturnValue = any
> = HandlerFn<CommandType, ReturnValue>;
