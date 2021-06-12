import { getName } from '../utils/getName';
import { callHandler } from '../callers/callHandler';
import {
  ClassHandler,
  CommandLike,
  HandlerFn,
  ResolvedHandlerResult,
} from '../typings/handler';
import { HandlersMap } from '../typings/core';
import { MaybePromise } from '../typings/common';

export class BaseBus<
  HandlerType extends ClassHandler | HandlerFn = ClassHandler | HandlerFn,
  Handlers extends HandlersMap<HandlerType> = HandlersMap<HandlerType>
> {
  constructor(protected readonly store: Handlers) {}

  protected run<CommandType extends CommandLike = CommandLike>(
    command: CommandType
  ): MaybePromise<ResolvedHandlerResult<Handlers, CommandType>> {
    const name = getName(command);
    const handler = this.store[name];

    if (!handler) {
      throw new Error(`No handler for ${name} found.`);
    }

    return callHandler(handler, command);
  }
}
