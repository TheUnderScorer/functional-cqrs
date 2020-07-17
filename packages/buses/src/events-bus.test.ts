import { createEventsBus } from './events-bus';
import { eventHandler } from '@functional-cqrs/stores';
import {
  EventHandler,
  EventHandlersStore,
  Event,
} from '@functional-cqrs/typings';

describe('dispatch', () => {
  const store: EventHandlersStore = new Map<string, Array<EventHandler<any>>>();

  beforeEach(() => {
    store.clear();
  });

  type TestEvent = Event<'TestEvent', boolean>;

  interface TestContext {
    isTest: true;
  }

  const context: TestContext = {
    isTest: true,
  };

  test('should dispatch event with context', async () => {
    const handler: EventHandler<TestEvent, TestContext> = jest.fn(
      ({ isTest }) => ({ payload }) => {
        expect(isTest).toEqual(true);
        expect(payload).toEqual(true);
      }
    );

    eventHandler<TestEvent>('TestEvent', handler)(store);

    const bus = createEventsBus(store)(context);
    await bus.dispatch<TestEvent>({
      event: 'TestEvent',
      payload: true,
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
