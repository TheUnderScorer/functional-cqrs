import { Command, CommandHandler } from '@functional-cqrs/typings';
import { commandHandler } from '@functional-cqrs/stores';
import { createCommandBus } from '.';

describe('execute', () => {
  test('should execute command with context', async () => {
    const ctx = {
      isTest: true,
    };

    interface TestCmd extends Command<boolean> {
      type: 'TestCmd';
    }

    const handler: CommandHandler<TestCmd, typeof ctx> = ({
      isTest,
    }) => async ({ payload }) => {
      return {
        isTest,
        payload,
      };
    };

    commandHandler<TestCmd, typeof ctx>('TestCmd', handler);

    const bus = createCommandBus(ctx);
    const result = await bus.execute<TestCmd>({
      type: 'TestCmd',
      payload: false,
    });

    expect(result.payload).toEqual(false);
    expect(result.isTest).toEqual(true);
  });
});
