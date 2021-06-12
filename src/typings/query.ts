import { ClassHandler, CommandLike, HandlerFn } from './handler';
import { MaybePromise } from './common';

export type Query<Payload = any, Name extends string = string> = CommandLike<
  Payload,
  Name
>;

export interface QueriesBusInterface {
  query: <QueryType extends Query = Query, ReturnValue = any>(
    query: QueryType
  ) => MaybePromise<ReturnValue>;
}

export type QueryHandler<QueryType extends Query = Query> = ClassHandler<
  QueryType
>;

export type QueryHandlerFn<
  QueryType extends Query = Query,
  ReturnValue = any
> = HandlerFn<QueryType, ReturnValue>;
