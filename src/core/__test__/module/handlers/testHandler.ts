import { commandHandler } from '../../../../decorators';
import { TestEvent } from '../../default/event-handlers/testEventHandler';
import { Command, CommandHandler } from '../../../../typings';

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
