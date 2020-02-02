import { Command, CommandHandler } from '@functional-cqrs/typings';
import { commandHandler } from '@functional-cqrs/stores';
import { TestEvent } from '../event-handlers/test-event.handler';

export type TestCommand = Command<'TestCommand', boolean>;

export interface TestContext {
  version: string;
}

export const testHandler: CommandHandler<TestCommand, TestContext> = ({
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

export default commandHandler<TestCommand, TestContext>(
  'TestCommand',
  testHandler
);

export const handler = commandHandler<TestCommand, TestContext>(
  'TestCommand',
  testHandler
);
