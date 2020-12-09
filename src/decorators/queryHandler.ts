import { Query, QueryHandler, QueryHandlerFn } from '../typings';
import { queryHandlerMetadataStore } from '../stores/metadata/queryHandlerMetadataStore';
import { Constructor } from '../typings/common';
import { HandlerType } from '../stores/metadata/types';

export const queryHandler = {
  /**
   * Registers new query handler as function.
   * */
  asFunction: <QueryType extends Query, Context = any, ReturnValue = any>(
    query: QueryType['name'],
    fn: QueryHandlerFn<QueryType, Context, ReturnValue>
  ) => {
    queryHandlerMetadataStore.set(query, {
      handler: fn,
      name: fn.name ?? Date.now().toString(),
      type: HandlerType.Function,
      targetName: query,
    });

    return fn;
  },

  /**
   * Registers new query handler as class
   * */
  asClass: <QueryType extends Query>(
    query: Pick<QueryType, 'name'> | QueryType['name']
  ) => <T extends Constructor<QueryHandler<QueryType>>>(target: T) => {
    const queryName = typeof query === 'object' ? query.name : query;

    queryHandlerMetadataStore.set(queryName, {
      handler: target,
      type: HandlerType.Class,
      name: target.name,
      targetName: queryName,
    });

    return target;
  },
};
