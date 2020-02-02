import { createCqrs } from './cqrs';
import {
  TestCommand,
  TestContext,
} from './__test__/default/handlers/test.handler';
import {
  eventHandlerCalls,
  resetEventCalls,
} from './__test__/default/event-handlers/test-event.handler';
import {
  items,
  TestQuery,
} from './__test__/default/query-handlers/test-query.handler';

describe('createCqrs', () => {
  beforeEach(() => {
    resetEventCalls();
  });

  test('should return buses and loaded handlers count', async () => {
    const cqrs = await createCqrs();

    expect(cqrs).toMatchInlineSnapshot(`
      Object {
        "buses": Object {
          "commandsBus": Object {
            "execute": [Function],
            "setEventsBus": [Function],
            "setQueriesBus": [Function],
          },
          "eventsBus": Object {
            "dispatch": [Function],
            "setCommandsBus": [Function],
            "setQueriesBus": [Function],
          },
          "queriesBus": Object {
            "query": [Function],
            "setEventsBus": [Function],
          },
        },
        "loadedHandlers": 0,
      }
    `);
  });

  test('should import handlers using glob pattern', async () => {
    const { loadedHandlers } = await createCqrs({
      commandHandlersPath: ['**/__test__/default/handlers/*.handler.ts'],
      eventHandlersPath: ['**/__test__/default/event-handlers/*.handler.ts'],
      queryHandlersPath: ['**/__test__/default/query-handlers/*.handler.ts'],
    });

    expect(loadedHandlers).toEqual(3);
  });

  test('execute command and dispatch event on created cqrs', async () => {
    const context: TestContext = {
      version: '0.1',
    };

    const { buses, loadedHandlers } = await createCqrs({
      commandHandlersPath: ['**/__test__/default/handlers/*.handler.ts'],
      eventHandlersPath: ['**/__test__/default/event-handlers/*.handler.ts'],
      queryHandlersPath: ['**/__test__/default/query-handlers/*.handler.ts'],
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

  test('execute query on created cqrs', async () => {
    const context: TestContext = {
      version: '0.1',
    };

    const { buses, loadedHandlers } = await createCqrs({
      commandHandlersPath: ['**/__test__/default/handlers/*.handler.ts'],
      eventHandlersPath: ['**/__test__/default/event-handlers/*.handler.ts'],
      queryHandlersPath: ['**/__test__/default/query-handlers/*.handler.ts'],
      context,
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
