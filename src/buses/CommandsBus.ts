import { Command, CommandsBusInterface } from '../typings';
import { CommandHandlerMetadataStore } from '../stores/metadata/commandHandlerMetadataStore';
import { Caller } from '../callers/Caller';
import { ContextManager } from '../context/ContextManager';
import { getObjName } from '../utils/getObjName';

export class CommandsBus<Context> implements CommandsBusInterface<Context> {
  private readonly caller: Caller<Context>;

  constructor(
    private readonly store: CommandHandlerMetadataStore,
    private readonly contextManager: ContextManager<Context>
  ) {
    this.caller = new Caller<Context>(this.contextManager, 'command');
  }

  execute<CommandType extends Command = Command, ReturnValue = any>(
    command: CommandType
  ): ReturnValue | Promise<ReturnValue> {
    const name = getObjName(command);
    const handler = this.store.get(name);

    if (!handler) {
      throw new Error(`No handler for command ${name} found.`);
    }

    return this.caller.call(handler, command);
  }
}
