import { TestContext } from '../handlers/testHandler';
import { queryHandler } from '../../../decorators';
import { TestEvent } from '../eventHandlers/testEventHandler';
import { Query, QueryHandlerFn } from '../../../typings';

export type TestQuery = Query<
  'TestQuery',
  {
    index: number;
  }
>;

export const items = [0, 1, 2, 3, 4];

const handler: QueryHandlerFn<TestQuery, TestContext, number> = async ({
  query,
  context: { eventsBus },
}) => {
  await eventsBus.dispatch<TestEvent>({
    name: 'TestEvent',
    payload: true,
  });

  return items[query.payload.index] ?? 0;
};

export const testQueryHandler = queryHandler.asFunction<TestQuery, TestContext>(
  'TestQuery',
  handler
);
