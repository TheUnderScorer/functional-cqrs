import { Command, CommandHandler } from '@functional-cqrs/typings';
import { commandHandler } from './wrappers';
import { commandHandlersStore } from './stores';

describe('commandHandler', () => {
  beforeEach(() => {
    commandHandlersStore.clear();
  });

  test('registers command into container', () => {
    interface TestCommand extends Command<boolean> {
      type: 'TestCommand';
    }

    const handler: CommandHandler<TestCommand> = () => ({ payload }) => {
      return payload;
    };

    commandHandler<TestCommand>('TestCommand', handler);

    expect(commandHandlersStore.get('TestCommand')).toEqual(handler);
  });
});
