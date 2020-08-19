import { EventsBus } from './event';
import { SingularHandler, SingularInstruction } from './singular';

export type Query<
  Name extends string = string,
  Payload = any
> = SingularInstruction<Name, Payload>;

export type QueryContext<Context = any> = Context & {
  eventsBus: EventsBus;
};

export interface QueriesBus<Context = any> {
  query: <QueryType extends Query = Query, ReturnValue = any>(
    query: QueryType
  ) => ReturnValue | Promise<ReturnValue>;
}

export type QueryHandler<QueryType extends Query> = SingularHandler<QueryType>;

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
