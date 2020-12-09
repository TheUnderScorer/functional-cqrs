import { EventsBusInterface } from './event';
import { Handler, HandlerInstruction } from './handler';

export type Query<
  Name extends string = string,
  Payload = any
> = HandlerInstruction<Name, Payload>;

export type QueryContext<Context = any> = Context & {
  eventsBus: EventsBusInterface;
};

export interface QueriesBusInterface<Context = any> {
  query: <QueryType extends Query = Query, ReturnValue = any>(
    query: QueryType
  ) => ReturnValue | Promise<ReturnValue>;
}

export type QueryHandler<QueryType extends Query> = Handler<QueryType>;

export interface QueryHandlerFnParams<
  QueryType extends Query = Query,
  Context = any
> {
  context: QueryContext<Context>;
  query: QueryType;
}

export type QueryHandlerFn<
  QueryType extends Query = Query,
  Context = any,
  ReturnValue = any
> = (
  params: QueryHandlerFnParams<QueryType, Context>
) => ReturnValue | Promise<ReturnValue>;
