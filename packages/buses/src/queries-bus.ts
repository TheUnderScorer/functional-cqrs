import {
  EventsBus,
  QueriesBus,
  QueryHandlersStore,
} from '@functional-cqrs/typings';

export interface PrivateQueriesBus<Context> extends QueriesBus<Context> {
  setEventsBus: (bus: EventsBus) => void;
}

export const createQueriesBus = <Context = any>(store: QueryHandlersStore) => (
  context: Context
): PrivateQueriesBus<Context> => {
  let eventsBus: EventsBus;

  return {
    query: (query) => {
      const handler = store.get(query.query);

      if (!handler) {
        throw new Error(`No handler for query ${query.query} found.`);
      }

      return handler({
        ...context,
        eventsBus,
      })(query);
    },
    setEventsBus: (bus) => {
      eventsBus = bus;
    },
  };
};
