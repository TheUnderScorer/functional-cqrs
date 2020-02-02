import { Command, CommandsBus, EventsBus } from '@functional-cqrs/typings';
import { commandHandlersStore } from '@functional-cqrs/stores';

export const createCommandBus = <Context = any>(
  context: Context
): CommandsBus => {
  let eventsBus: EventsBus;

  return {
    execute: <CommandType extends Command = Command, ReturnValue = any>(
      command: CommandType
    ): Promise<ReturnValue> | ReturnValue => {
      const handler = commandHandlersStore.get(command.type);

      if (!handler) {
        throw new Error(`No handler for command ${command.type} found.`);
      }

      return handler({
        ...context,
        eventsBus,
      })(command);
    },
    setEventsBus: (bus: EventsBus) => {
      eventsBus = bus;
    },
  };
};
