import { createCqrs } from './cqrs';
import { sync as globSync } from 'glob';
import { eventCalls, TestCommand, TestContext } from './__test__/test.handler';

describe('createCqrs', () => {
  test('should return buses and loaded handlers count', async () => {
    const cqrs = await createCqrs();

    expect(cqrs).toMatchInlineSnapshot(`
      Object {
        "buses": Object {
          "commandsBus": Object {
            "execute": [Function],
            "setEventsBus": [Function],
          },
          "eventsBus": Object {
            "dispatch": [Function],
            "setCommandsBus": [Function],
          },
        },
        "loadedHandlers": 0,
      }
    `);
  });

  test('should import handlers using glob pattern', async () => {
    const globHandler = jest.fn((path: string) => globSync(path));

    const { loadedHandlers } = await createCqrs({
      globHandler,
      handlersPath: ['**/__test__/*.handler.ts'],
    });

    expect(loadedHandlers).toEqual(1);
  });

  test('execute command and dispatch event on created cqrs', async () => {
    const globHandler = jest.fn((path: string) => globSync(path));

    const context: TestContext = {
      version: '0.1',
    };

    const { buses } = await createCqrs({
      globHandler,
      handlersPath: ['**/__test__/*.handler.ts'],
      context,
    });

    const dispatchSpy = jest.spyOn(buses.eventsBus, 'dispatch');

    const command: TestCommand = {
      type: 'TestCommand',
      payload: false,
    };

    const { payload, version } = await buses.commandsBus.execute(command);
    expect(payload).toEqual(command.payload);
    expect(version).toEqual(context.version);

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(eventCalls).toEqual(1);
  });
});
