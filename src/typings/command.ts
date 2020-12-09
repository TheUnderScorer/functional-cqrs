import { EventsBusInterface } from './event';
import { QueriesBusInterface } from './query';
import { Handler, HandlerInstruction } from './handler';

export type Command<
  Type extends string = string,
  Payload = any
> = HandlerInstruction<Type, Payload>;

export type CommandContext<Context = any> = Context & {
  eventsBus: EventsBusInterface<Context>;
  queriesBus: QueriesBusInterface<Context>;
};

export interface CommandsBusInterface<Context = any> {
  execute: <CommandType extends Command = Command, ReturnValue = any>(
    command: CommandType
  ) => ReturnValue | Promise<ReturnValue>;
}

export interface CommandHandlerFnParams<
  CommandType extends Command = Command,
  Context = any
> {
  context: CommandContext<Context>;
  command: CommandType;
}

export type CommandHandler<CommandType extends Command = Command> = Handler<
  CommandType
>;

export type CommandHandlerFn<
  CommandType extends Command = Command,
  Context = any,
  ReturnValue = any
> = (params: CommandHandlerFnParams<CommandType, Context>) => ReturnValue;
