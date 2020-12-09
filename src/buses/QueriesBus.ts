import { QueriesBusInterface, Query } from '../typings';
import { QueryHandlerMetadataStore } from '../stores/metadata/queryHandlerMetadataStore';
import { Caller } from '../callers/Caller';
import { ContextManager } from '../context/ContextManager';
import { getObjName } from '../utils/getObjName';

export class QueriesBus<Context> implements QueriesBusInterface<Context> {
  private readonly caller: Caller<Context>;

  constructor(
    private readonly store: QueryHandlerMetadataStore,
    private readonly contextManager: ContextManager<Context>
  ) {
    this.caller = new Caller<Context>(this.contextManager, 'query');
  }

  query<QueryType extends Query = Query, ReturnValue = any>(
    query: QueryType
  ): ReturnValue | Promise<ReturnValue> {
    const name = getObjName(query);
    const handler = this.store.get(name);

    if (!handler) {
      throw new Error(`No handler for query ${name} found.`);
    }

    return this.caller.call(handler, query);
  }
}
