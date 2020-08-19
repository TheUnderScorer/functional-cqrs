import { EventsBus } from './event';
import { QueriesBus } from './query';
import { SingularHandler, SingularInstruction } from './singular';

export type Command<
  Type extends string = string,
  Payload = any
> = SingularInstruction<Type, Payload>;

export type CommandContext<Context = any> = Context & {
  eventsBus: EventsBus;
  queriesBus: QueriesBus;
};

export interface CommandsBus<Context = any> {
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

export type CommandHandler<
  CommandType extends Command = Command
> = SingularHandler<CommandType>;

export type CommandHandlerFn<
  CommandType extends Command = Command,
  Context = any,
  ReturnValue = any
> = (params: CommandHandlerFnParams<CommandType, Context>) => ReturnValue;
