import { commandHandler } from '../../../decorators';
import { TestEvent } from '../eventHandlers/testEventHandler';
import { Command, CommandHandlerFn } from '../../../typings';

export type TestCommand = Command<'TestCommand', boolean>;

export interface TestContext {
  version: string;
}

export const testHandler: CommandHandlerFn<TestCommand, TestContext> = async ({
  command: { payload },
  context: { eventsBus, version },
}) => {
  await eventsBus.dispatch<TestEvent>(new TestEvent(false));

  return {
    version,
    payload,
  };
};

export default commandHandler.asFunction<TestCommand, TestContext>(
  'TestCommand',
  testHandler
);
