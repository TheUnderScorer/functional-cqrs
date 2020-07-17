import { createEventsBus } from './events-bus';
import { eventHandler } from '@functional-cqrs/stores';
import {
  Event,
  EventHandler,
  EventHandlerFunction,
  EventHandlersStore,
  EventSubscriberCreator,
} from '@functional-cqrs/typings';

type TestEvent = Event<'TestEvent', boolean>;

interface TestContext {
  isTest: true;
}

const context: TestContext = {
  isTest: true,
};

describe('Events Bus', () => {
  describe('dispatch', () => {
    const store: EventHandlersStore = new Map<
      string,
      Array<EventHandler<any>>
    >();

    beforeEach(() => {
      store.clear();
    });

    it('should dispatch event with context', async () => {
      const handler: EventHandlerFunction<TestEvent, TestContext> = jest.fn(
        ({ isTest }) => ({ payload }) => {
          expect(isTest).toEqual(true);
          expect(payload).toEqual(true);
        }
      );

      eventHandler<TestEvent>('TestEvent', handler)(store);

      const bus = createEventsBus(store)(context);
      bus.invokeSubscribers();

      await bus.dispatch<TestEvent>({
        event: 'TestEvent',
        payload: true,
      });

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should handle event subscribers', async () => {
      const handler = jest.fn((event: TestEvent) => {
        expect(event.payload).toEqual(true);
      });

      const createSubscriber: EventSubscriberCreator<
        TestContext,
        ['TestEvent']
      > = (ctx) => ({
        eventSubscribers: ['TestEvent'],
        TestEvent: (event) => {
          expect(ctx.isTest).toEqual(true);
          handler(event);
        },
      });

      eventHandler<TestEvent>('TestEvent', createSubscriber)(store);

      const bus = createEventsBus(store)(context);
      bus.invokeSubscribers();

      await bus.dispatch<TestEvent>({
        event: 'TestEvent',
        payload: true,
      });

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });
});
