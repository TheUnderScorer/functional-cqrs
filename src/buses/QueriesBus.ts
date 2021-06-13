import {
  QueriesBusInterface,
  Query,
  QueryHandler,
  QueryHandlerFn,
} from '../types';
import { BaseBus } from './BaseBus';
import { HandlersMap } from '../types/core';
import { ResolvedHandlerResult } from '../types/handler';

export class QueriesBus<
    Handlers extends HandlersMap<QueryHandler | QueryHandlerFn> = HandlersMap<
      QueryHandler | QueryHandlerFn
    >
  >
  extends BaseBus
  implements QueriesBusInterface<Handlers>
{
  query<QueryType extends Query = Query>(
    query: QueryType
  ): ResolvedHandlerResult<Handlers, QueryType> {
    return this.run(query);
  }
}
