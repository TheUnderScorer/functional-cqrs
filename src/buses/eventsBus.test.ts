import { createEventsBus } from './eventsBus';
import { eventHandler, EventsSubscriber, EventSubscriber } from '../decorators';
import {
  Event,
  EventHandler,
  EventHandlerFunction,
  EventHandlersStore,
} from '../typings';
import { loadFromMetadata } from '../core/loadFromMetadata';

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
      let called: Event<any> | undefined;

      @EventsSubscriber()

      // @ts-ignore
      // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
      class Subscribers {
        constructor(readonly subContext: any) {}

        @EventSubscriber({
          eventName: 'TestEvent',
        })
        handleTestEvent(event: Event<'TestEvent'>) {
          expect(this.subContext.test).toEqual(true);

          called = event;
        }
      }

      loadFromMetadata({
        stores: { eventHandlersStore: store } as any,
        context: {
          test: true,
        },
      });

      const bus = createEventsBus(store)(context);
      bus.invokeSubscribers();

      await bus.dispatch<TestEvent>({
        event: 'TestEvent',
        payload: true,
      });

      expect(called?.event).toEqual('TestEvent');
    });
  });
});
