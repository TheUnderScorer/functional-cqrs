import {
  Command,
  CommandHandler,
  Event,
  EventHandler,
} from '@functional-cqrs/typings';
import { commandHandler, eventHandler } from '@functional-cqrs/stores';

export interface TestCommand extends Command<boolean> {
  type: 'TestCommand';
}

export type TestEvent = Event<boolean, 'TestEvent'>;

export interface TestContext {
  version: string;
}

export let eventCalls = 0;

const testEventHandler: EventHandler<TestEvent, TestContext> = () => ({
  payload,
}) => {
  console.log({ payload });

  eventCalls++;
};

eventHandler<TestEvent, TestContext>('TestEvent', testEventHandler);

const testHandler: CommandHandler<TestCommand, TestContext> = ({
  version,
  eventsBus,
}) => ({ payload }) => {
  eventsBus.dispatch<TestEvent>({
    event: 'TestEvent',
    payload: false,
  });

  return {
    version,
    payload,
  };
};

commandHandler<TestCommand, TestContext>('TestCommand', testHandler);
