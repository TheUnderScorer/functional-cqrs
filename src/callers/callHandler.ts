import { CommandLike, Handler, isClassHandler } from '../typings/handler';
import { MaybePromise } from '../typings/common';

export const callHandler = <ReturnValue>(
  handler: Handler<any>,
  instruction: CommandLike
): MaybePromise<ReturnValue> => {
  if (isClassHandler(handler)) {
    return handler.handle(instruction) as ReturnValue;
  }

  return handler(instruction) as ReturnValue;
};
