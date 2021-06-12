import {
  Command,
  CommandHandler,
  CommandHandlerFn,
  CommandsBusInterface,
} from '../typings';
import { BaseBus } from './BaseBus';

export class CommandsBus extends BaseBus<CommandHandler | CommandHandlerFn>
  implements CommandsBusInterface {
  execute<CommandType extends Command = Command, ReturnValue = any>(
    command: CommandType
  ): ReturnValue | Promise<ReturnValue> {
    return this.run(command);
  }
}
