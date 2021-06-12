import { QueriesBusInterface, Query } from '../typings';
import { BaseBus } from './BaseBus';

export class QueriesBus extends BaseBus implements QueriesBusInterface {
  query<QueryType extends Query = Query, ReturnValue = any>(
    query: QueryType
  ): ReturnValue | Promise<ReturnValue> {
    return this.run(query);
  }
}
