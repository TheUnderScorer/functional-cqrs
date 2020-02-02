import { createCommandBus, createEventsBus } from '@functional-cqrs/buses';
import * as Path from 'path';
import { sync as globSync } from 'glob';
import { map, pipe, flatten } from 'ramda';

export interface CqrsConfig<Context = any> {
  handlersPath?: string[];
  importer?: (path: string) => Promise<any>;
  context?: Context;
  globHandler?: (path: string) => string[];
}

const importHandlers = async (
  handlersPath: CqrsConfig['handlersPath'],
  importer: CqrsConfig['importer'],
  globHandler: CqrsConfig['globHandler']
): Promise<number> => {
  const importsResults = await Promise.all(
    pipe(
      map<string, string[]>(path => globHandler!(path)),
      flatten,
      map(async path => {
        const actualPath = Path.resolve(path);

        return importer!(actualPath);
      })
    )(handlersPath!)
  );

  if (!importsResults.length) {
    console.warn('No handlers found.');
  }

  return importsResults.length;
};

const createBuses = <Context = any>(context?: Context) => {
  const commandsBus = createCommandBus(context);
  const eventsBus = createEventsBus(context);

  commandsBus.setEventsBus(eventsBus);
  eventsBus.setCommandsBus(commandsBus);

  return {
    commandsBus,
    eventsBus,
  };
};

export const createCqrs = async <Context = any>({
  handlersPath = [],
  importer = async path => import(path),
  context,
  globHandler = globSync,
}: CqrsConfig<Context> = {}) => {
  let loadedHandlers = 0;

  if (handlersPath.length) {
    loadedHandlers = await importHandlers(handlersPath, importer, globHandler);
  }

  return {
    loadedHandlers,
    buses: createBuses(context),
  };
};
