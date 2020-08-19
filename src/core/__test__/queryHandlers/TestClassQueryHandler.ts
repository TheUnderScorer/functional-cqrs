import { Query, QueryContext, QueryHandler } from '../../../typings';
import { items } from './testQueryHandler';
import { TestContext } from '../handlers/testHandler';
import { TestEvent } from '../eventHandlers/testEventHandler';
import { queryHandler } from '../../../decorators';

export type TestClassQuery = Query<
  'TestClassQuery',
  {
    index: number;
  }
>;

@queryHandler.asClass<TestClassQuery>('TestClassQuery')
export class TestClassQueryHandler implements QueryHandler<TestClassQuery> {
  constructor(private readonly context: QueryContext<TestContext>) {}

  async handle(query: TestClassQuery) {
    await this.context.eventsBus.dispatch<TestEvent>({
      name: 'TestEvent',
      payload: true,
    });

    return items[query.payload.index] ?? 0;
  }
}
