import { TestContext } from '../handlers/testHandler';
import { eventHandler } from '../../../../decorators';
import { Event, EventHandlerFunction } from '../../../../typings';

export type TestEvent = Event<'TestEvent', boolean>;

export interface EventHandlerCall {
  version: string;
  event: TestEvent;
}

// eslint-disable-next-line import/no-mutable-exports
export let eventHandlerCalls: EventHandlerCall[] = [];

export const resetEventCalls = () => {
  eventHandlerCalls = [];
};

export const testEventHandler: EventHandlerFunction<TestEvent, TestContext> = ({
  version,
}) => (event) => {
  eventHandlerCalls.push({
    version,
    event,
  });
};

export default eventHandler<TestEvent, TestContext>(
  'TestEvent',
  testEventHandler
);
