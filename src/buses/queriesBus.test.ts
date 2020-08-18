import { queryHandler } from '../decorators';
import { createQueriesBus } from './queriesBus';
import { Query, QueryHandler, QueryHandlersStore } from 'typings';

describe('Queries Bus', () => {
  describe('query', () => {
    const store: QueryHandlersStore = new Map<string, QueryHandler<any>>();

    beforeEach(() => {
      store.clear();
    });

    it('should execute query with context', async () => {
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
      bus.invokeHandlers();

      const result = await bus.query<TestQuery>({
        query: 'TestQuery',
        payload: false,
      });

      expect(result.payload).toEqual(false);
      expect(result.isTest).toEqual(true);
    });
  });
});
