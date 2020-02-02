import { Query, QueryHandler } from '@functional-cqrs/typings';
import { TestContext } from '../handlers/test.handler';
import { queryHandler } from '@functional-cqrs/stores';
import { TestEvent } from '../event-handlers/test-event.handler';

export type TestQuery = Query<
  'TestQuery',
  {
    index: number;
  }
>;

export const items = [0, 1, 2, 3, 4];

export const testQueryHandler: QueryHandler<TestQuery, TestContext, number> = ({
  eventsBus,
}) => async ({ payload: { index } }) => {
  await eventsBus.dispatch<TestEvent>({
    event: 'TestEvent',
    payload: true,
  });

  return items[index] ?? 0;
};

export default queryHandler<TestQuery, TestContext>(
  'TestQuery',
  testQueryHandler
);
