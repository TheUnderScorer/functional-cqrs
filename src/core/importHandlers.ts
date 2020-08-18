import { flatten, map, pipe } from 'ramda';
import * as Path from 'path';
import { CqrsConfig } from './cqrs';
import { Module } from '../typings';

type ModuleTuple = [Module, string];

const importHandlers = async (
  handlersPath: string[],
  importer: CqrsConfig['importer'],
  globHandler: CqrsConfig['globHandler'],
  store: Map<string, any>
): Promise<number> => {
  const importsResults = await Promise.all(
    pipe(
      map<string, string[]>((path) => globHandler!(path)),
      flatten,
      map(
        async (path): Promise<ModuleTuple> => {
          const actualPath = Path.resolve(path);

          return [await importer!(actualPath), actualPath];
        }
      ),
      map(
        async (modulePromise): Promise<ModuleTuple> => {
          const [loadedModule, path] = await modulePromise;

          if (loadedModule.default) {
            try {
              loadedModule.default(store);
            } catch (e) {
              console.warn(
                `Unable to load handler using default export at path: ${path}: `,
                e.message
              );
            }
          }

          return [loadedModule, path];
        }
      ),
      map(async (modulePromise) => {
        const [loadedModule, path] = await modulePromise;

        if (loadedModule.handler) {
          try {
            loadedModule.handler(store);
          } catch (e) {
            console.warn(
              `Unable to load handler using "handler" export at path: ${path}: `,
              e.message
            );
          }
        }
      })
    )(handlersPath)
  );

  if (!importsResults.length) {
    console.warn('No handlers found.');
  }

  return importsResults.length;
};

export default importHandlers;
