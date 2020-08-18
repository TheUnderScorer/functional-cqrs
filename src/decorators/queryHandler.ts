import { Query, QueryHandler, QueryHandlersStore } from '../typings';

export const queryHandler = <
  QueryType extends Query = Query,
  Context = any,
  ReturnValueType = any
>(
  type: QueryType['query'],
  handler: QueryHandler<QueryType, Context, ReturnValueType>
) => (store: QueryHandlersStore) => {
  if (store.has(type)) {
    console.warn(`Handler for query "${type}" already exists.`);

    return handler;
  }

  store.set(type, handler);

  return handler;
};
