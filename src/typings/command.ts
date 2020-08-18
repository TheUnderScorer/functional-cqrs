import { EventsBus } from './event';
import { QueriesBus } from './query';

export interface Command<Type extends string = string, Payload = any> {
  type: Type;
  payload: Payload;
}

export type CommandContext<Context = any> = Context & {
  eventsBus: EventsBus;
  queriesBus: QueriesBus;
};

export interface CommandsBus<Context = any> {
  execute: <CommandType extends Command = Command, ReturnValue = any>(
    command: CommandType
  ) => ReturnValue | Promise<ReturnValue>;
}

export type CommandHandler<
  CommandType extends Command = Command,
  Context = any,
  ReturnValue = any
> = (context: CommandContext<Context>) => (command: CommandType) => ReturnValue;
export type CommandHandlersStore = Map<string, CommandHandler<any>>;
