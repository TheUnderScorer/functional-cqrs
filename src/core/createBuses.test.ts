import { Stores } from './cqrs';
import createBuses from './createBuses';
import { CommandHandler, EventHandler, QueryHandler } from '../typings';

const stores: Stores = {
  eventHandlersStore: new Map<string, Array<EventHandler<any>>>(),
  commandHandlersStore: new Map<string, CommandHandler<any>>(),
  queryHandlersStore: new Map<string, QueryHandler<any>>(),
};

const ctx = {
  test: true,
};

describe('createBuses', () => {
  it('should create buses with given context', async () => {
    const result = createBuses(stores, ctx);

    expect(Object.keys(result)).toMatchInlineSnapshot(`
    Array [
      "commandsBus",
      "eventsBus",
      "queriesBus",
    ]
  `);
  });
});
