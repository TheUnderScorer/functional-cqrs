import { TestContext } from '../handlers/testHandler';
import { queryHandler } from '../../../../decorators';
import { TestEvent } from '../event-handlers/testEventHandler';
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
