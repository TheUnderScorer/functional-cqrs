import {
  Command,
  CommandHandler,
  CommandHandlersStore,
  CommandsBus,
  EventsBus,
  QueriesBus,
} from '../typings';

export interface PrivateCommandBus<Context> extends CommandsBus<Context> {
  setEventsBus: (bus: EventsBus) => void;
  setQueriesBus: (bus: QueriesBus) => void;
  invokeHandlers: () => void;
}

export interface InvokedCommandHandlers {
  [key: string]: ReturnType<CommandHandler<any>>;
}

export const createCommandBus = <Context = any>(
  store: CommandHandlersStore
) => (context: Context): PrivateCommandBus<Context> => {
  let eventsBus: EventsBus;
  let queriesBus: QueriesBus;

  let invokedCommands: InvokedCommandHandlers;

  return {
    execute: <CommandType extends Command = Command, ReturnValue = any>(
      command: CommandType
    ): Promise<ReturnValue> | ReturnValue => {
      const handler = invokedCommands[command.type];

      if (!handler) {
        throw new Error(`No handler for command ${command.type} found.`);
      }

      return handler(command);
    },
    setEventsBus: (bus: EventsBus) => {
      eventsBus = bus;
    },
    setQueriesBus: (bus: QueriesBus) => {
      queriesBus = bus;
    },
    invokeHandlers: () => {
      invokedCommands = Array.from(store.entries()).reduce<
        InvokedCommandHandlers
      >((previousValue, [command, handler]) => {
        previousValue[command] = handler({
          ...context,
          eventsBus,
          queriesBus,
        });

        return previousValue;
      }, {});
    },
  };
};
