import { Command, CommandHandler } from '@functional-cqrs/typings';
import { commandHandlersStore } from './stores';

/**
 * Registers new command handler into global container
 * */
export const commandHandler = <
  CommandType extends Command = Command,
  Context = any,
  ReturnValueType = any
>(
  type: CommandType['type'],
  handler: CommandHandler<CommandType, Context, ReturnValueType>
) => {
  commandHandlersStore.set(type, handler as CommandHandler);

  return handler;
};
