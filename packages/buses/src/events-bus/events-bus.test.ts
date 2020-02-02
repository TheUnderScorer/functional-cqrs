import { Event, EventHandler } from '@functional-cqrs/typings';
import { createEventsBus } from './index';
import { eventHandler, eventHandlersStore } from '@functional-cqrs/stores';

describe('dispatch', () => {
  type TestEvent = Event<boolean, 'TestEvent'>;

  interface TestContext {
    isTest: true;
  }

  const context: TestContext = {
    isTest: true,
  };

  beforeEach(() => {
    eventHandlersStore.clear();
  });

  test('should dispatch event with context', async () => {
    const handler: EventHandler<TestEvent, TestContext> = jest.fn(
      ({ isTest }) => ({ payload }) => {
        expect(isTest).toEqual(true);
        expect(payload).toEqual(true);
      }
    );

    eventHandler<TestEvent>('TestEvent', handler);

    const bus = createEventsBus(context);
    await bus.dispatch<TestEvent>({
      event: 'TestEvent',
      payload: true,
    });

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
