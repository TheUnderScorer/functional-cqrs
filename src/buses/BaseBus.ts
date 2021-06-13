import { getName } from '../utils/getName';
import { callHandler } from '../callers/callHandler';
import {
  ClassHandler,
  CommandLike,
  HandlerFn,
  ResolvedHandlerResult,
} from '../types/handler';
import { HandlersMap } from '../types/core';
import { NoHandlerFoundError } from '../errors/NoHandlerFoundError';

export class BaseBus<
  HandlerType extends ClassHandler | HandlerFn = ClassHandler | HandlerFn,
  Handlers extends HandlersMap<HandlerType> = HandlersMap<HandlerType>
> {
  constructor(protected readonly store: Handlers) {}

  protected run<CommandType extends CommandLike = CommandLike>(
    command: CommandType
  ) {
    const name = getName(command);
    const handler = this.store[name];

    if (!handler) {
      throw new NoHandlerFoundError(name);
    }

    return callHandler(handler, command) as ResolvedHandlerResult<
      Handlers,
      CommandType
    >;
  }
}
