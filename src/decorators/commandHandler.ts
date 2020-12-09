import { Command, CommandHandler, CommandHandlerFn } from '../typings';
import { commandHandlerMetadataStore } from '../stores/metadata/commandHandlerMetadataStore';
import { Constructor } from '../typings/common';
import { HandlerType } from '../stores/metadata/types';
import { getName } from '../utils/getName';

export const commandHandler = {
  /**
   * Registers new command handler as function
   *
   * @see CommandHandlerFn
   * */
  asFunction: <CommandType extends Command, Context = any>(
    command: CommandType['name'],
    fn: CommandHandlerFn<CommandType, Context>
  ) => {
    const targetName = getName(command);

    commandHandlerMetadataStore.set(targetName, {
      handler: fn,
      name: fn.name ?? Date.now().toString(),
      type: HandlerType.Function,
      targetName,
    });

    return fn;
  },

  /**
   * Registers new command handler as class
   *
   * @see CommandHandler
   * */
  asClass: <CommandType extends Command>(
    command: Pick<CommandType, 'name'> | CommandType['name']
  ) => <T extends Constructor<CommandHandler<CommandType>>>(target: T) => {
    const commandName = getName(command);

    commandHandlerMetadataStore.set(commandName, {
      type: HandlerType.Class,
      name: target.name,
      handler: target,
      targetName: commandName,
    });

    return target;
  },
};
