import { createCommandBus } from '@functional-cqrs/buses';
import * as Path from 'path';
import { sync as globSync } from 'glob';
import { map, pipe, flatten } from 'ramda';

export interface CqrsConfig<Context = any> {
  handlersPath?: string[];
  importer?: (path: string) => Promise<any>;
  context?: Context;
}

const importHandlers = async (
  handlersPath: string[],
  importer: (path: string) => Promise<any>
): Promise<number> => {
  const importsResults = await Promise.all(
    pipe(
      map<string, string[]>(path => globSync(path)),
      flatten,
      map(async path => {
        const actualPath = Path.resolve(path);

        return importer(actualPath);
      })
    )(handlersPath)
  );

  if (!importsResults.length) {
    console.warn('No handlers found.');
  }

  return importsResults.length;
};

const createBuses = <Context = any>(context?: Context) => {
  return {
    commandsBus: createCommandBus(context),
  };
};

export const createCqrs = async <Context = any>({
  handlersPath = [],
  importer = path => import(path),
  context,
}: CqrsConfig<Context> = {}) => {
  if (handlersPath) {
    await importHandlers(handlersPath, importer);
  }

  return createBuses(context);
};
