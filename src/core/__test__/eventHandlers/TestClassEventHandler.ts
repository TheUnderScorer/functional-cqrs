import { eventHandlerCalls, TestEvent } from './testEventHandler';
import { TestContext } from '../handlers/testHandler';
import { eventHandler } from '../../../decorators';

@eventHandler.asClass({
  handlers: [
    {
      method: 'handleTestEvent',
      eventName: TestEvent,
    },
  ],
})
export class TestClassEventHandler {
  constructor(private readonly context: TestContext) {}

  handleTestEvent(event: TestEvent) {
    eventHandlerCalls.push({
      event,
      version: this.context.version,
    });
  }
}
