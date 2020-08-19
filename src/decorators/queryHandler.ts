import { Query, QueryHandler, QueryHandlerFn } from '../typings';
import { queryHandlerMetadataStore } from '../stores/metadata/queryHandlerMetadataStore';
import { Constructor } from '../typings/common';

export const queryHandler = {
  /**
   * Registers new query handler as function.
   *
   * TODO Example
   * */
  asFunction: <QueryType extends Query, Context = any>(
    query: QueryType['name'],
    fn: QueryHandlerFn<QueryType>
  ) => {
    queryHandlerMetadataStore.set(query, {
      handler: fn,
      name: fn.name ?? Date.now().toString(),
      type: 'function',
      targetName: query,
    });

    return fn;
  },

  /**
   * Registers new query handler as class.
   *
   * TODO Example
   * */
  asClass: <QueryType extends Query>(
    query: Pick<QueryType, 'name'> | QueryType['name']
  ) => <T extends Constructor<QueryHandler<QueryType>>>(target: T) => {
    const queryName = typeof query === 'object' ? query.name : query;

    queryHandlerMetadataStore.set(queryName, {
      handler: target,
      type: 'class',
      name: target.name,
      targetName: queryName,
    });

    return target;
  },
};
