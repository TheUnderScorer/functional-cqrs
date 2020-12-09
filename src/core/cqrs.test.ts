import { createCqrs } from './cqrs';
import commandHandler, {
  TestCommand,
  TestContext,
} from './__test__/handlers/testHandler';
import eventHandler, {
  eventHandlerCalls,
  resetEventCalls,
} from './__test__/eventHandlers/testEventHandler';
import { items, TestQuery } from './__test__/queryHandlers/testQueryHandler';
import { TestClassEventHandler } from './__test__/eventHandlers/TestClassEventHandler';
import {
  TestClassQuery,
  TestClassQueryHandler,
} from './__test__/queryHandlers/TestClassQueryHandler';
import { testQueryHandler } from './__test__/queryHandlers/testQueryHandler';
import {
  TestClassCommand,
  TestClassHandler,
} from './__test__/handlers/TestClassHandler';

describe('createCqrs', () => {
  const context: TestContext = {
    version: '0.1',
  };

  beforeEach(() => {
    resetEventCalls();
  });

  it('should return buses and loaded handlers count', async () => {
    const cqrs = await createCqrs();

    expect(cqrs).toMatchInlineSnapshot(`
      Object {
        "buses": Object {
          "commandsBus": CommandsBus {
            "caller": Caller {
              "contextManager": ContextManager {
                "commandsBus": [Circular],
                "context": undefined,
                "eventsBus": EventsBus {
                  "caller": EventHandlerCaller {
                    "contextManager": [Circular],
                  },
                  "contextManager": [Circular],
                  "store": Set {},
                },
                "queriesBus": QueriesBus {
                  "caller": Caller {
                    "contextManager": [Circular],
                    "type": "query",
                  },
                  "contextManager": [Circular],
                  "store": Map {},
                },
              },
              "type": "command",
            },
            "contextManager": ContextManager {
              "commandsBus": [Circular],
              "context": undefined,
              "eventsBus": EventsBus {
                "caller": EventHandlerCaller {
                  "contextManager": [Circular],
                },
                "contextManager": [Circular],
                "store": Set {},
              },
              "queriesBus": QueriesBus {
                "caller": Caller {
                  "contextManager": [Circular],
                  "type": "query",
                },
                "contextManager": [Circular],
                "store": Map {},
              },
            },
            "store": Map {},
          },
          "eventsBus": EventsBus {
            "caller": EventHandlerCaller {
              "contextManager": ContextManager {
                "commandsBus": CommandsBus {
                  "caller": Caller {
                    "contextManager": [Circular],
                    "type": "command",
                  },
                  "contextManager": [Circular],
                  "store": Map {},
                },
                "context": undefined,
                "eventsBus": [Circular],
                "queriesBus": QueriesBus {
                  "caller": Caller {
                    "contextManager": [Circular],
                    "type": "query",
                  },
                  "contextManager": [Circular],
                  "store": Map {},
                },
              },
            },
            "contextManager": ContextManager {
              "commandsBus": CommandsBus {
                "caller": Caller {
                  "contextManager": [Circular],
                  "type": "command",
                },
                "contextManager": [Circular],
                "store": Map {},
              },
              "context": undefined,
              "eventsBus": [Circular],
              "queriesBus": QueriesBus {
                "caller": Caller {
                  "contextManager": [Circular],
                  "type": "query",
                },
                "contextManager": [Circular],
                "store": Map {},
              },
            },
            "store": Set {},
          },
          "queriesBus": QueriesBus {
            "caller": Caller {
              "contextManager": ContextManager {
                "commandsBus": CommandsBus {
                  "caller": Caller {
                    "contextManager": [Circular],
                    "type": "command",
                  },
                  "contextManager": [Circular],
                  "store": Map {},
                },
                "context": undefined,
                "eventsBus": EventsBus {
                  "caller": EventHandlerCaller {
                    "contextManager": [Circular],
                  },
                  "contextManager": [Circular],
                  "store": Set {},
                },
                "queriesBus": [Circular],
              },
              "type": "query",
            },
            "contextManager": ContextManager {
              "commandsBus": CommandsBus {
                "caller": Caller {
                  "contextManager": [Circular],
                  "type": "command",
                },
                "contextManager": [Circular],
                "store": Map {},
              },
              "context": undefined,
              "eventsBus": EventsBus {
                "caller": EventHandlerCaller {
                  "contextManager": [Circular],
                },
                "contextManager": [Circular],
                "store": Set {},
              },
              "queriesBus": [Circular],
            },
            "store": Map {},
          },
        },
      }
    `);
  });

  it('should handle query', async () => {
    const { buses } = await createCqrs({
      context,
      commandHandlers: [commandHandler],
      eventHandlers: [eventHandler],
      queryHandlers: [testQueryHandler],
    });

    const item = await buses.queriesBus.query<TestQuery>({
      name: 'TestQuery',
      payload: {
        index: 2,
      },
    });

    expect(item).toEqual(items[2]);
    expect(eventHandlerCalls).toEqual([
      {
        version: context.version,
        event: {
          name: 'TestEvent',
          payload: true,
        },
      },
    ]);
  });

  it('should handle query as class', async () => {
    const { buses } = await createCqrs({
      context,
      commandHandlers: [commandHandler],
      eventHandlers: [TestClassEventHandler],
      queryHandlers: [TestClassQueryHandler],
    });

    const item = await buses.queriesBus.query<TestClassQuery>({
      name: 'TestClassQuery',
      payload: {
        index: 2,
      },
    });

    expect(item).toEqual(items[2]);
    expect(eventHandlerCalls).toEqual([
      {
        version: context.version,
        event: {
          name: 'TestEvent',
          payload: true,
        },
      },
    ]);
  });

  it('should handle commands', async () => {
    const { buses } = await createCqrs({
      context,
      commandHandlers: [commandHandler],
      eventHandlers: [TestClassEventHandler],
      queryHandlers: [testQueryHandler],
    });

    const result = await buses.commandsBus.execute<TestCommand>({
      name: 'TestCommand',
      payload: true,
    });

    expect(result).toEqual({
      version: context.version,
      payload: true,
    });

    expect(eventHandlerCalls).toEqual([
      {
        version: context.version,
        event: {
          name: 'TestEvent',
          payload: false,
        },
      },
    ]);
  });

  it('should handle class command handler', async () => {
    const { buses } = await createCqrs({
      context,
      commandHandlers: [TestClassHandler],
      eventHandlers: [TestClassEventHandler],
      queryHandlers: [testQueryHandler],
    });

    const result = await buses.commandsBus.execute<TestClassCommand>({
      name: 'TestClassCommand',
      payload: true,
    });

    expect(result).toEqual({
      version: context.version,
      payload: true,
    });

    expect(eventHandlerCalls).toEqual([
      {
        version: context.version,
        event: {
          name: 'TestEvent',
          payload: false,
        },
      },
    ]);
  });
});
