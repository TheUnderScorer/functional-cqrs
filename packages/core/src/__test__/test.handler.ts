import { Command, CommandHandler } from '@functional-cqrs/typings';
import { commandHandler } from '@functional-cqrs/stores';

export interface TestCommand extends Command<boolean> {
  type: 'TestCommand';
}

export interface TestContext {
  version: string;
}

const testHandler: CommandHandler<TestCommand, TestContext> = ({
  version,
}) => ({ payload }) => {
  return {
    version,
    payload,
  };
};

export default commandHandler<TestCommand>('TestCommand', testHandler);
