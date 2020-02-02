import {
  Command,
  CommandHandler,
  Event,
  EventHandler,
} from '@functional-cqrs/typings';
import { commandHandler, eventHandler } from './wrappers';
import { commandHandlersStore, eventHandlersStore } from './stores';

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

describe('eventHandler', () => {
  beforeEach(() => {
    eventHandlersStore.clear();
  });

  interface TestEvent extends Event<boolean> {
    event: 'TestEvent';
  }

  const handler: EventHandler<TestEvent> = () => ({ payload }) => {
    console.log({ payload });
  };

  test('registers event handler into container', () => {
    eventHandler<TestEvent>('TestEvent', handler);

    const handlers = eventHandlersStore.get('TestEvent')!;

    expect(handlers).toHaveLength(1);
    expect(handlers[0]).toEqual(handler);
  });

  test('does not duplicate handlers', () => {
    eventHandler<TestEvent>('TestEvent', handler);
    eventHandler<TestEvent>('TestEvent', handler);

    const handlers = eventHandlersStore.get('TestEvent')!;

    expect(handlers).toHaveLength(1);
    expect(handlers[0]).toEqual(handler);
  });
});
