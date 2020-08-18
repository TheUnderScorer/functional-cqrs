import { commandHandler } from '../../../../stores';
import { TestEvent } from '../event-handlers/test-event.handler';
import { Command, CommandHandler } from '../../../../typings';

export type TestCommand = Command<'TestCommand', boolean>;

export interface TestContext {
  version: string;
}

export const testHandler: CommandHandler<TestCommand, TestContext> = ({
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

export default commandHandler<TestCommand, TestContext>(
  'TestCommand',
  testHandler
);

export const handler = commandHandler<TestCommand, TestContext>(
  'TestCommand',
  testHandler
);
