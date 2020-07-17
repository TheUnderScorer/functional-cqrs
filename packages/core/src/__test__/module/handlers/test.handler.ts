import { Command, CommandHandler } from '@functional-cqrs/typings';
import { commandHandler } from '@functional-cqrs/stores';
import { TestEvent } from '../../default/event-handlers/test-event.handler';

export type TestCommand = Command<'TestCommand', boolean>;

export interface TestContext {
  version: string;
}

const testHandler: CommandHandler<TestCommand, TestContext> = ({
  version,
  eventsBus,
}) => async ({ payload }) => {
  await eventsBus.dispatch<TestEvent>({
    event: 'TestEvent',
    payload: false,
  });

  return {
    version,
    payload,
  };
};

module.exports = commandHandler<TestCommand, TestContext>(
  'TestCommand',
  testHandler
);
