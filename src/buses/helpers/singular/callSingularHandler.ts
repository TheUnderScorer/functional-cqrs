import { SingularHandlerMetadata } from '../../../stores/metadata/types';
import {
  SingularHandler,
  SingularInstruction,
} from '../../../typings/singular';

interface MakeCallHandlerParams<Context> {
  key: 'command' | 'query';
  contextProvider: () => Context;
  classInstancesProvider: () => Map<string, SingularHandler>;
}

export const makeCallHandler = <Context>({
  key,
  contextProvider,
  classInstancesProvider,
}: MakeCallHandlerParams<Context>) => async (
  handlerMeta: SingularHandlerMetadata,
  instruction: SingularInstruction
) => {
  if (handlerMeta.type === 'function') {
    return (handlerMeta.handler as any)({
      [key]: instruction,
      context: contextProvider(),
    });
  }

  const classToCall = classInstancesProvider().get(instruction.name);

  return classToCall!.handle(instruction);
};
