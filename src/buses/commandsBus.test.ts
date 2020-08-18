import { commandHandler } from '../decorators';
import { createCommandBus } from './commandsBus';
import { Command, CommandHandler, CommandHandlersStore } from '../typings';

describe('Commands Bus', () => {
  describe('execute', () => {
    const store: CommandHandlersStore = new Map<string, CommandHandler<any>>();

    beforeEach(() => {
      store.clear();
    });

    it('should execute command with context', async () => {
      const ctx = {
        isTest: true,
      };

      type TestCmd = Command<'TestCmd', boolean>;

      const handler: CommandHandler<TestCmd, typeof ctx> = ({
        isTest,
      }) => async ({ payload }) => {
        return {
          isTest,
          payload,
        };
      };

      commandHandler<TestCmd, typeof ctx>('TestCmd', handler)(store);

      const bus = createCommandBus(store)(ctx);
      bus.invokeHandlers();

      const result = await bus.execute<TestCmd>({
        type: 'TestCmd',
        payload: false,
      });

      expect(result.payload).toEqual(false);
      expect(result.isTest).toEqual(true);
    });
  });
});
