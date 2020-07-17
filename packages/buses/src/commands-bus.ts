import {
  Command,
  CommandHandlersStore,
  CommandsBus,
  EventsBus,
  QueriesBus,
} from '@functional-cqrs/typings';

export interface PrivateCommandBus<Context> extends CommandsBus<Context> {
  setEventsBus: (bus: EventsBus) => void;
  setQueriesBus: (bus: QueriesBus) => void;
}

export const createCommandBus = <Context = any>(
  store: CommandHandlersStore
) => (context: Context): PrivateCommandBus<Context> => {
  let eventsBus: EventsBus;
  let queriesBus: QueriesBus;

  return {
    execute: <CommandType extends Command = Command, ReturnValue = any>(
      command: CommandType
    ): Promise<ReturnValue> | ReturnValue => {
      const handler = store.get(command.type);

      if (!handler) {
        throw new Error(`No handler for command ${command.type} found.`);
      }

      return handler({
        ...context,
        queriesBus,
        eventsBus,
      })(command);
    },
    setEventsBus: (bus: EventsBus) => {
      eventsBus = bus;
    },
    setQueriesBus: (bus: QueriesBus) => {
      queriesBus = bus;
    },
  };
};
