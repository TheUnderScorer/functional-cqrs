import { CommandLike, Handler, isClassHandler } from '../types/handler';
import { MaybePromise } from '../types/common';

export const callHandler = <ReturnValue, Context>(
  handler: Handler<any>,
  instruction: CommandLike,
  context: Context
): MaybePromise<ReturnValue> => {
  if (isClassHandler(handler)) {
    return handler.handle(instruction, context) as ReturnValue;
  }

  return handler(instruction, context) as ReturnValue;
};
