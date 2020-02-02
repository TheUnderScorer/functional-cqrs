import {
  Query,
  QueryHandler,
  QueryHandlersStore,
} from '@functional-cqrs/typings';
import { queryHandler } from '@functional-cqrs/stores';
import { createQueriesBus } from '.';

describe('query', () => {
  const store: QueryHandlersStore = new Map<string, QueryHandler<any>>();

  beforeEach(() => {
    store.clear();
  });

  test('should execute query with context', async () => {
    const ctx = {
      isTest: true,
    };

    type TestQuery = Query<'TestQuery', boolean>;

    const handler: QueryHandler<TestQuery, typeof ctx> = ({
      isTest,
    }) => async ({ payload }) => {
      return {
        isTest,
        payload,
      };
    };

    queryHandler<TestQuery, typeof ctx>('TestQuery', handler)(store);

    const bus = createQueriesBus(store)(ctx);
    const result = await bus.query<TestQuery>({
      query: 'TestQuery',
      payload: false,
    });

    expect(result.payload).toEqual(false);
    expect(result.isTest).toEqual(true);
  });
});
