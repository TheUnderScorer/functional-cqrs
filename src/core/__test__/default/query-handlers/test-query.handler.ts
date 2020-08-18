import { TestContext } from '../handlers/test.handler';
import { queryHandler } from '../../../../stores';
import { TestEvent } from '../event-handlers/test-event.handler';
import { Query, QueryHandler } from '../../../../typings';

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
