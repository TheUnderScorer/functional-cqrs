import { TestContext } from '../handlers/testHandler';
import { eventHandler } from '../../../decorators';
import { Event, EventHandlerFn } from '../../../typings';

export class TestEvent implements Event {
  constructor(readonly payload: boolean) {}
}

export interface EventHandlerCall {
  version: string;
  event: TestEvent;
}

// eslint-disable-next-line import/no-mutable-exports
export let eventHandlerCalls: EventHandlerCall[] = [];

export const resetEventCalls = () => {
  eventHandlerCalls = [];
};

export const testEventHandler: EventHandlerFn<TestEvent, TestContext> = ({
  event,
  context,
}) => {
  eventHandlerCalls.push({
    version: context.version,
    event,
  });
};

export default eventHandler.asFunction<TestEvent, TestContext>(
  'TestEvent',
  testEventHandler
);
