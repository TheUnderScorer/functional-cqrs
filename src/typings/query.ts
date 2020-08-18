import { EventsBus } from './event';

export interface Query<Name extends string = string, Payload = any> {
  query: Name;
  payload: Payload;
}

export type QueryContext<Context = any> = Context & {
  eventsBus: EventsBus;
};

export interface QueriesBus<Context = any> {
  query: <QueryType extends Query = Query, ReturnValue = any>(
    query: QueryType
  ) => ReturnValue | Promise<ReturnValue>;
}

export type QueryHandlersStore = Map<string, QueryHandler<any>>;
export type QueryHandler<
  QueryType extends Query = Query,
  Context = any,
  ReturnValue = any
> = (
  context: QueryContext<Context>
) => (query: QueryType) => ReturnValue | Promise<ReturnValue>;
