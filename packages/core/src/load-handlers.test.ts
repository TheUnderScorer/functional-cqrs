import {
  QueryHandler,
  EventHandlersStore,
  EventHandler,
  CommandHandler,
  CommandHandlersStore,
  QueryHandlersStore,
  Command,
  Query,
  Event,
} from '@functional-cqrs/typings';
import {
  commandHandler,
  queryHandler,
  eventHandler,
} from '@functional-cqrs/stores';
import loadHandlers from './load-handlers';

const commandHandlersStore: CommandHandlersStore = new Map<
  string,
  CommandHandler<any>
>();
const eventHandlersStore: EventHandlersStore = new Map<
  string,
  Array<EventHandler<any>>
>();
const queryHandlersStore: QueryHandlersStore = new Map<
  string,
  QueryHandler<any>
>();

type TestCommand = Command<'Test', boolean>;
type TestQuery = Query<'Test', boolean>;
type TestEvent = Event<'Test', boolean>;

beforeEach(() => {
  commandHandlersStore.clear();
  eventHandlersStore.clear();
  queryHandlersStore.clear();
});

test('load command handler', () => {
  const handler: CommandHandler<TestCommand> = () => command => {
    return command;
  };

  const handlers = [commandHandler<TestCommand>('Test', handler)];

  const result = loadHandlers({
    store: commandHandlersStore,
    handlers,
  });

  expect(result).toEqual(1);
  expect(commandHandlersStore.get('Test')).toEqual(handler);
});

test('load query handler', () => {
  const handler: QueryHandler<TestQuery> = () => query => {
    return query;
  };

  const handlers = [queryHandler<TestQuery>('Test', handler)];

  const result = loadHandlers({
    store: queryHandlersStore,
    handlers,
  });

  expect(result).toEqual(1);
  expect(queryHandlersStore.get('Test')).toEqual(handler);
});

test('load event handler', () => {
  const handler: EventHandler<TestEvent> = () => event => {
    console.log(event);
  };

  const handlers = [eventHandler<TestEvent>('Test', handler)];

  const result = loadHandlers({
    store: eventHandlersStore,
    handlers,
  });

  expect(result).toEqual(1);
  expect(eventHandlersStore.get('Test')).toEqual([handler]);
});
