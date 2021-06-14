import {
  Command,
  CommandContext,
  CommandHandler,
  CommandHandlerFn,
  CommandsBusInterface,
} from '../types';
import { BaseBus } from './BaseBus';
import { HandlersMap } from '../types/core';
import { ResolvedHandlerResult } from '../types/handler';

export class CommandsBus<
    Handlers extends HandlersMap<
      CommandHandler | CommandHandlerFn
    > = HandlersMap<CommandHandler | CommandHandlerFn>
  >
  extends BaseBus<CommandHandler | CommandHandlerFn, Handlers, CommandContext>
  implements CommandsBusInterface<Handlers>
{
  execute<CommandType extends Command = Command>(
    command: CommandType
  ): ResolvedHandlerResult<Handlers, CommandType> {
    return this.run(command);
  }
}
