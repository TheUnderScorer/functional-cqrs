import { SingularHandlerMetadata } from '../types';
import { storeToArray } from '../../../utils';

export const getSingularHandlersByHandlers = (
  store: Map<string, SingularHandlerMetadata>
) => (handlers: any[]) => {
  const values = storeToArray(store).filter(({ handler }) =>
    handlers.includes(handler)
  );

  return values.reduce((newStore, value) => {
    newStore.set(value.targetName, value);

    return newStore;
  }, new Map<string, SingularHandlerMetadata>());
};
