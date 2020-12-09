import { Query, QueryHandler, QueryHandlerFn } from '../typings';
import { queryHandlerMetadataStore } from '../stores/metadata/queryHandlerMetadataStore';
import { Constructor } from '../typings/common';
import { HandlerType } from '../stores/metadata/types';
import { getName } from '../utils/getName';

export const queryHandler = {
  /**
   * Registers new query handler as function.
   * */
  asFunction: <QueryType extends Query, Context = any, ReturnValue = any>(
    query: QueryType['name'],
    fn: QueryHandlerFn<QueryType, Context, ReturnValue>
  ) => {
    const targetName = getName(query);

    queryHandlerMetadataStore.set(targetName, {
      handler: fn,
      name: fn.name ?? Date.now().toString(),
      type: HandlerType.Function,
      targetName,
    });

    return fn;
  },

  /**
   * Registers new query handler as class
   * */
  asClass: <QueryType extends Query>(
    query: Pick<QueryType, 'name'> | QueryType['name']
  ) => <T extends Constructor<QueryHandler<QueryType>>>(target: T) => {
    const queryName = getName(query);

    queryHandlerMetadataStore.set(queryName, {
      handler: target,
      type: HandlerType.Class,
      name: target.name,
      targetName: queryName,
    });

    return target;
  },
};
