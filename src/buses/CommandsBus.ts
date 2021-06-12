import { Command, CommandsBusInterface } from '../typings';
import { BaseBus } from './BaseBus';

export class CommandsBus extends BaseBus implements CommandsBusInterface {
  execute<CommandType extends Command = Command, ReturnValue = any>(
    command: CommandType
  ): ReturnValue | Promise<ReturnValue> {
    return this.run(command);
  }
}
