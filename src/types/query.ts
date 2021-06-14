import {
  ClassHandler,
  CommandLike,
  HandlerFn,
  ResolvedHandlerResult,
} from './handler';
import { HandlersMap } from './core';

export type Query<Payload = any, Name extends string = string> = CommandLike<
  Payload,
  Name
>;

export interface QueriesBusInterface<
  Handlers extends HandlersMap<QueryHandler | QueryHandlerFn> = HandlersMap<
    QueryHandler | QueryHandlerFn
  >
> {
  query: <QueryType extends Query = Query>(
    query: QueryType
  ) => ResolvedHandlerResult<Handlers, QueryType>;
}

export type QueryHandler<QueryType extends Query<any, any> = Query<any, any>> =
  ClassHandler<QueryType>;

export type QueryHandlerFn<
  QueryType extends Query<any, any> = Query<any, any>,
  ReturnValue = any
> = HandlerFn<QueryType, ReturnValue, never>;
