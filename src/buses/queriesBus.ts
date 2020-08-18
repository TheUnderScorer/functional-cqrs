import {
  EventsBus,
  QueriesBus,
  QueryHandler,
  QueryHandlersStore,
} from '../typings';

export interface PrivateQueriesBus<Context> extends QueriesBus<Context> {
  setEventsBus: (bus: EventsBus) => void;
  invokeHandlers: () => void;
  setContext: (context: Context) => void;
}

export interface InvokedQueryHandlers {
  [key: string]: ReturnType<QueryHandler>;
}

export const createQueriesBus = <Context = any>(store: QueryHandlersStore) => (
  initialContext?: Context
): PrivateQueriesBus<Context> => {
  let context: Context | undefined = initialContext;
  let eventsBus: EventsBus;

  let invokedQueryHandlers: InvokedQueryHandlers;

  return {
    query: (query) => {
      const handler = invokedQueryHandlers[query.query];

      if (!handler) {
        throw new Error(`No handler for query ${query.query} found.`);
      }

      return handler(query);
    },
    setEventsBus: (bus) => {
      eventsBus = bus;
    },
    invokeHandlers: () => {
      invokedQueryHandlers = Array.from(store.entries()).reduce<
        InvokedQueryHandlers
      >((handlers, [query, handler]) => {
        handlers[query] = handler({
          ...context!,
          eventsBus,
        });

        return handlers;
      }, {});
    },
    setContext: (newContext) => {
      context = newContext;
    },
  };
};
