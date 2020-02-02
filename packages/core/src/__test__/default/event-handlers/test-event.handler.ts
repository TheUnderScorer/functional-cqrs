import { Event, EventHandler } from '@functional-cqrs/typings';
import { TestContext } from '../handlers/test.handler';
import { eventHandler } from '@functional-cqrs/stores';

export type TestEvent = Event<'TestEvent', boolean>;

export interface EventHandlerCall {
  version: string;
  event: TestEvent;
}

export let eventHandlerCalls: EventHandlerCall[] = [];

export const resetEventCalls = () => {
  eventHandlerCalls = [];
};

export const testEventHandler: EventHandler<TestEvent, TestContext> = ({
  version,
}) => event => {
  eventHandlerCalls.push({
    version,
    event,
  });
};

export default eventHandler<TestEvent, TestContext>(
  'TestEvent',
  testEventHandler
);
