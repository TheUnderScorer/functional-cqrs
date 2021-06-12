import { Command } from '../typings';
import { getName } from '../utils/getName';
import { callHandler } from '../callers/callHandler';
import { HandlerFn } from '../typings/handler';

export class BaseBus {
  constructor(protected readonly store: Record<string, HandlerFn>) {}

  protected run<CommandType extends Command = Command, ReturnValue = any>(
    command: CommandType
  ): ReturnValue | Promise<ReturnValue> {
    const name = getName(command);
    const handler = this.store[name];

    if (!handler) {
      throw new Error(`No handler for ${name} found.`);
    }

    return callHandler<ReturnValue>(handler, command);
  }
}
