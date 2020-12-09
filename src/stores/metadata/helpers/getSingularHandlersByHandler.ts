import { HandlerMetadata } from '../types';
import { storeToArray } from '../../../utils';

export const getHandlerByHandlersArray = (
  store: Map<string, HandlerMetadata>
) => (handlers: any[]) => {
  const values = storeToArray(store).filter(({ handler }) =>
    handlers.includes(handler)
  );

  return values.reduce((newStore, value) => {
    newStore.set(value.targetName, value);

    return newStore;
  }, new Map<string, HandlerMetadata>());
};
