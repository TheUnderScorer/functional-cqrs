import { Constructor } from '../../../typings/common';
import { SingularHandlerMetadata } from '../../../stores/metadata/types';
import { storeToArray } from '../../../utils';

interface MakeLoadClassInstancesParams<Context> {
  store: Map<string, SingularHandlerMetadata>;
  contextProvider: () => Context;
}

export const makeLoadClassInstances = <HandlerType, Context>({
  store,
  contextProvider,
}: MakeLoadClassInstancesParams<Context>) => () => {
  const classInstances = new Map<string, HandlerType>();

  classInstances.clear();

  const classes = storeToArray(store).filter((item) => item.type === 'class');

  const context = contextProvider();

  if (!classes.length) {
    return classInstances;
  }

  classes.forEach((handlerMeta) => {
    const instance = new (handlerMeta.handler as Constructor<HandlerType>)(
      context
    );

    classInstances.set(handlerMeta.targetName, instance);
  });

  return classInstances;
};
