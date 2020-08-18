import { Command, CommandHandler, CommandHandlersStore } from '../typings';

/**
 * Registers new command handler into store
 * */
export const commandHandler = <
  CommandType extends Command = Command,
  Context = any,
  ReturnValueType = any
>(
  type: CommandType['type'],
  handler: CommandHandler<CommandType, Context, ReturnValueType>
) => (store: CommandHandlersStore) => {
  if (store.has(type)) {
    console.warn(`Handler for command ${type} already exists.`);

    return handler;
  }

  store.set(type, handler as CommandHandler);

  return handler;
};
