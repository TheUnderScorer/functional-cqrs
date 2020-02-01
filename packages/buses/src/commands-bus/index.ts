import { Command } from '@functional-cqrs/typings';
import { commandHandlersStore } from '@functional-cqrs/stores';

export const createCommandBus = <Context = any>(context: Context) => {
  return {
    execute: <CommandType extends Command = Command, ReturnValue = any>(
      command: CommandType
    ): Promise<ReturnValue> | ReturnValue => {
      const handler = commandHandlersStore.get(command.type);

      if (!handler) {
        throw new Error(`No handler for command ${command.type} found.`);
      }

      return handler(context)(command);
    },
  };
};
