import {
  Command,
  CommandHandler,
  CommandHandlersStore,
  Event,
  EventHandler,
  EventHandlersStore,
  Query,
  QueryHandler,
  QueryHandlersStore,
} from '@functional-cqrs/typings';
import { commandHandler, eventHandler, queryHandler } from './wrappers';

describe('commandHandler', () => {
  const store: CommandHandlersStore = new Map<string, CommandHandler<any>>();

  beforeEach(() => {
    store.clear();
  });

  test('registers command handler into container', () => {
    type TestCommand = Command<'TestCommand', boolean>;

    const handler: CommandHandler<TestCommand> = () => ({ payload }) => {
      return payload;
    };

    commandHandler<TestCommand>('TestCommand', handler)(store);

    expect(store.get('TestCommand')).toEqual(handler);
  });
});

describe('eventHandler', () => {
  const store: EventHandlersStore = new Map<string, Array<EventHandler<any>>>();

  beforeEach(() => {
    store.clear();
  });

  type TestEvent = Event<'TestEvent', boolean>;

  const handler: EventHandler<TestEvent> = () => ({ payload }) => {
    console.log({ payload });
  };

  test('registers event handler into container', () => {
    eventHandler<TestEvent>('TestEvent', handler)(store);

    const handlers = store.get('TestEvent')!;

    expect(handlers).toHaveLength(1);
    expect(handlers[0]).toEqual(handler);
  });

  test('does not duplicate handlers', () => {
    eventHandler<TestEvent>('TestEvent', handler)(store);
    eventHandler<TestEvent>('TestEvent', handler)(store);

    const handlers = store.get('TestEvent')!;

    expect(handlers).toHaveLength(1);
    expect(handlers[0]).toEqual(handler);
  });
});

describe('queryHandler', () => {
  const store: QueryHandlersStore = new Map<string, QueryHandler<any>>();

  beforeEach(() => {
    store.clear();
  });

  type TestQuery = Query<string, 'TestQuery'>;

  test('registers query handler into containers', () => {
    const handler: QueryHandler<TestQuery> = () => ({ payload }) => {
      return payload;
    };

    queryHandler<TestQuery>('TestQuery', handler)(store);

    expect(store.get('TestQuery')).toEqual(handler);
  });
});
