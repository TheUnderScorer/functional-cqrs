import { ContextManager } from '../context/ContextManager';
import { HandlerInstruction } from '../typings/handler';
import { HandlerMetadata, HandlerType } from '../stores/metadata/types';

/**
 * Calls single handlers in any form - function or class
 * */
export class Caller<Context> {
  constructor(
    private readonly contextManager: ContextManager<Context>,
    private readonly type: 'command' | 'query'
  ) {}

  call(meta: HandlerMetadata, instruction: HandlerInstruction) {
    if (meta.type === HandlerType.Function) {
      return meta.handler({
        [this.type]: instruction,
        context: this.getContext(),
      });
    }

    // eslint-disable-next-line new-cap
    const classToCall = new meta.handler(this.getContext());

    return classToCall!.handle(instruction);
  }

  private getContext() {
    if (this.type === 'command') {
      return this.contextManager.getCommandsBusContext();
    }

    return this.contextManager.getQueriesBusContext();
  }
}
