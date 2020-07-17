import {
  Command,
  CommandHandler,
  CommandHandlersStore,
  EventHandler,
  EventHandlersStore,
  Query,
  QueryHandler,
  QueryHandlersStore,
  Event,
  EventHandlerFunction,
} from '@functional-cqrs/typings';
import { eventHandler } from './event-handler';
import { queryHandler } from './query-handler';
import { commandHandler } from './command-handler';

describe('commandHandler', () => {
  const store: CommandHandlersStore = new Map<string, CommandHandler<any>>();

  beforeEach(() => {
    store.clear();
  });

  it('registers command handler into container', () => {
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

  const handler: EventHandlerFunction<TestEvent> = () => ({ payload }) => {
    console.log({ payload });
  };

  it('registers event handler into container', () => {
    eventHandler<TestEvent>('TestEvent', handler)(store);

    const handlers = store.get('TestEvent')!;

    expect(handlers).toHaveLength(1);
    expect(handlers[0]).toEqual(handler);
  });

  it('does not duplicate handlers', () => {
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

  it('registers query handler into containers', () => {
    const handler: QueryHandler<TestQuery> = () => ({ payload }) => {
      return payload;
    };

    queryHandler<TestQuery>('TestQuery', handler)(store);

    expect(store.get('TestQuery')).toEqual(handler);
  });
});
