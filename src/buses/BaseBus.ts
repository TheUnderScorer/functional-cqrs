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
import { BaseBusInterface } from '../types/buses';

export class BaseBus<
  HandlerType extends ClassHandler | HandlerFn = ClassHandler | HandlerFn,
  Handlers extends HandlersMap<HandlerType> = HandlersMap<HandlerType>,
  Context = any
> implements BaseBusInterface<Context>
{
  context!: Context;

  constructor(protected readonly store: Handlers) {}

  protected run<CommandType extends CommandLike = CommandLike>(
    command: CommandType
  ) {
    const name = getName(command);
    const handler = this.store[name];

    if (!handler) {
      throw new NoHandlerFoundError(name);
    }

    return callHandler(handler, command, this.context) as ResolvedHandlerResult<
      Handlers,
      CommandType
    >;
  }
}
