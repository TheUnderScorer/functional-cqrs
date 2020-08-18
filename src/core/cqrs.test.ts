import { createCqrs } from './cqrs';
import commandHandler, {
  TestCommand,
  TestContext,
} from './__test__/default/handlers/testHandler';
import eventHandler, {
  eventHandlerCalls,
  resetEventCalls,
} from './__test__/default/event-handlers/testEventHandler';
import queryHandler, {
  items,
  TestQuery,
} from './__test__/default/query-handlers/testQueryHandler';

describe('createCqrs', () => {
  beforeEach(() => {
    resetEventCalls();
  });

  it('should return buses and loaded handlers count', async () => {
    const cqrs = await createCqrs();

    expect(cqrs).toMatchInlineSnapshot(`
      Object {
        "buses": Object {
          "commandsBus": Object {
            "execute": [Function],
            "invokeHandlers": [Function],
            "setContext": [Function],
            "setEventsBus": [Function],
            "setQueriesBus": [Function],
          },
          "eventsBus": Object {
            "dispatch": [Function],
            "invokeSubscribers": [Function],
            "setCommandsBus": [Function],
            "setContext": [Function],
            "setQueriesBus": [Function],
          },
          "queriesBus": Object {
            "invokeHandlers": [Function],
            "query": [Function],
            "setContext": [Function],
            "setEventsBus": [Function],
          },
        },
        "loadedHandlers": 0,
      }
    `);
  });

  it('should import handlers using glob pattern', async () => {
    const { loadedHandlers } = await createCqrs({
      commandHandlersPath: ['**/__test__/default/handlers/*Handler.ts'],
      eventHandlersPath: ['**/__test__/default/event-handlers/*Handler.ts'],
      queryHandlersPath: ['**/__test__/default/query-handlers/*Handler.ts'],
    });

    expect(loadedHandlers).toEqual(3);
  });

  it('execute command and dispatch event on created cqrs', async () => {
    const context: TestContext = {
      version: '0.1',
    };

    const { buses, loadedHandlers } = await createCqrs({
      commandHandlersPath: ['**/__test__/default/handlers/*Handler.ts'],
      eventHandlersPath: ['**/__test__/default/event-handlers/*Handler.ts'],
      queryHandlersPath: ['**/__test__/default/query-handlers/*Handler.ts'],
      context,
    });
    expect(loadedHandlers).toEqual(3);

    const dispatchSpy = jest.spyOn(buses.eventsBus, 'dispatch');

    const command: TestCommand = {
      type: 'TestCommand',
      payload: false,
    };

    const { payload, version } = await buses.commandsBus.execute(command);
    expect(payload).toEqual(command.payload);
    expect(version).toEqual(context.version);

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(eventHandlerCalls).toEqual([
      {
        version,
        event: {
          event: 'TestEvent',
          payload: false,
        },
      },
    ]);
  });

  it('execute query on created cqrs', async () => {
    const context: TestContext = {
      version: '0.1',
    };

    const { buses, loadedHandlers } = await createCqrs({
      context,
      commandHandlers: [commandHandler],
      eventHandlers: [eventHandler],
      queryHandlers: [queryHandler],
    });
    expect(loadedHandlers).toEqual(3);

    const item = await buses.queriesBus.query<TestQuery>({
      query: 'TestQuery',
      payload: {
        index: 2,
      },
    });

    expect(item).toEqual(items[2]);
    expect(eventHandlerCalls).toEqual([
      {
        version: context.version,
        event: {
          event: 'TestEvent',
          payload: true,
        },
      },
    ]);
  });
});
