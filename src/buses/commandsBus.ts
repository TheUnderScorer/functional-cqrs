import {
  Command,
  CommandContext,
  CommandHandler,
  CommandsBus,
  EventsBus,
  QueriesBus,
} from '../typings';
import { CommandHandlerMetadataStore } from '../stores/metadata/commandHandlerMetadataStore';
import { makeLoadClassInstances } from './helpers/singular/loadClassInstances';
import { makeCallHandler } from './helpers/singular/callSingularHandler';

export interface PrivateCommandBus<Context> extends CommandsBus<Context> {
  setEventsBus: (bus: EventsBus) => void;
  setQueriesBus: (bus: QueriesBus) => void;
  setContext: (context: Context) => void;
  loadClasses: () => void;
}

export const createCommandBus = <Context = any>(
  store: CommandHandlerMetadataStore,
  initialContext?: Context
): PrivateCommandBus<Context> => {
  let eventsBus: EventsBus;
  let queriesBus: QueriesBus;

  let context: Context | undefined = initialContext;

  const getFullContext = (): CommandContext<Context> => ({
    ...context!,
    eventsBus,
    queriesBus,
  });

  const loadClassInstances = makeLoadClassInstances<
    CommandHandler,
    CommandContext<Context>
  >({ store, contextProvider: getFullContext });
  let classInstances = loadClassInstances();

  const callHandler = makeCallHandler<CommandContext<Context>>({
    classInstancesProvider: () => classInstances,
    contextProvider: getFullContext,
    key: 'command',
  });

  return {
    execute: <CommandType extends Command = Command, ReturnValue = any>(
      command: CommandType
    ): Promise<ReturnValue> | ReturnValue => {
      const handler = store.get(command.name);

      if (!handler) {
        throw new Error(`No handler for command ${command.name} found.`);
      }

      return callHandler(handler, command);
    },
    setEventsBus: (bus: EventsBus) => {
      eventsBus = bus;
    },
    setQueriesBus: (bus: QueriesBus) => {
      queriesBus = bus;
    },
    setContext: (newContext) => {
      context = newContext;

      classInstances = loadClassInstances();
    },
    loadClasses: () => {
      classInstances = loadClassInstances();
    },
  };
};
