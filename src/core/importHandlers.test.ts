import importHandlers from './importHandlers';
import { sync } from 'glob';
import { testHandler } from './__test__/default/handlers/testHandler';
import { testEventHandler } from './__test__/default/event-handlers/testEventHandler';
import { testQueryHandler } from './__test__/default/query-handlers/testQueryHandler';
import {
  CommandHandler,
  CommandHandlersStore,
  EventHandler,
  EventHandlersStore,
  QueryHandler,
  QueryHandlersStore,
} from '../typings';

const importer = async (path: string) => import(path);

describe('Import command handlers', () => {
  const store: CommandHandlersStore = new Map<string, CommandHandler<any>>();

  beforeEach(() => {
    store.clear();
  });

  describe('Using ES export', () => {
    it('should import handlers and load them into store', async () => {
      const result = await importHandlers(
        ['**/__test__/default/handlers/*Handler.ts'],
        importer,
        sync,
        store
      );

      expect(result).toEqual(1);
      expect(store.size).toEqual(1);
      expect(store.get('TestCommand')).toEqual(testHandler);
    });
  });

  describe('Using module.exports', () => {
    it('should import handlers and load them into store', async () => {
      const result = await importHandlers(
        ['**/__test__/module/handlers/*Handler.ts'],
        importer,
        sync,
        store
      );

      expect(result).toEqual(1);
      expect(store.size).toEqual(1);
    });
  });
});

describe('Import event handlers', () => {
  const store: EventHandlersStore = new Map<string, Array<EventHandler<any>>>();

  beforeEach(() => {
    store.clear();
  });

  describe('Using ES export', () => {
    it('should import handlers and load them into store', async () => {
      const result = await importHandlers(
        ['**/__test__/default/event-handlers/*Handler.ts'],
        importer,
        sync,
        store
      );

      expect(result).toEqual(1);
      expect(store.size).toEqual(1);
      expect(store.get('TestEvent')).toEqual([testEventHandler]);
    });
  });
});

describe('Import query handlers', () => {
  const store: QueryHandlersStore = new Map<string, QueryHandler<any>>();

  beforeEach(() => {
    store.clear();
  });

  describe('Using ES export', () => {
    it('should import handlers and load them into store', async () => {
      const result = await importHandlers(
        ['**/__test__/default/query-handlers/*Handler.ts'],
        importer,
        sync,
        store
      );

      expect(result).toEqual(1);
      expect(store.size).toEqual(1);
      expect(store.get('TestQuery')).toEqual(testQueryHandler);
    });
  });
});