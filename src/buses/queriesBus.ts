import { EventsBus, QueriesBus, QueryContext, QueryHandler } from '../typings';
import { makeLoadClassInstances } from './helpers/singular/loadClassInstances';
import { QueryHandlerMetadataStore } from '../stores/metadata/queryHandlerMetadataStore';
import { makeCallHandler } from './helpers/singular/callSingularHandler';

export interface PrivateQueriesBus<Context> extends QueriesBus<Context> {
  setEventsBus: (bus: EventsBus) => void;
  setContext: (context: Context) => void;
  loadClasses: () => void;
}

export const createQueriesBus = <Context = any>(
  store: QueryHandlerMetadataStore,
  initialContext?: Context
): PrivateQueriesBus<Context> => {
  let context: Context | undefined = initialContext;
  let eventsBus: EventsBus;

  const getFullContext = (): QueryContext<Context> => ({
    ...context!,
    eventsBus,
  });

  const loadClassInstances = makeLoadClassInstances<
    QueryHandler<any>,
    QueryContext<Context>
  >({ store, contextProvider: getFullContext });
  let classInstances = loadClassInstances();

  const callHandler = makeCallHandler<QueryContext<Context>>({
    classInstancesProvider: () => classInstances,
    contextProvider: getFullContext,
    key: 'query',
  });

  return {
    query: (query) => {
      const handler = store.get(query.name);

      if (!handler) {
        throw new Error(`No handler for query ${query.name} found.`);
      }

      return callHandler(handler, query);
    },
    setEventsBus: (newEventsBus) => {
      eventsBus = newEventsBus;
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
