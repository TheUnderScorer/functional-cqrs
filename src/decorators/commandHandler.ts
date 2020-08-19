import { Command, CommandHandler, CommandHandlerFn } from '../typings';
import { commandHandlerMetadataStore } from '../stores/metadata/commandHandlerMetadataStore';
import { Constructor } from '../typings/common';

export const commandHandler = {
  /**
   * Registers new command handler as function
   *
   * TODO Add example
   * */
  asFunction: <CommandType extends Command, Context = any>(
    command: CommandType['name'],
    fn: CommandHandlerFn<CommandType, Context>
  ) => {
    commandHandlerMetadataStore.set(command, {
      handler: fn,
      name: fn.name ?? Date.now().toString(),
      type: 'function',
      targetName: command,
    });

    return fn;
  },

  /**
   * Registers new command handler as class
   *
   * TODO Add example
   * */
  asClass: <CommandType extends Command>(
    command: Pick<CommandType, 'name'> | CommandType['name']
  ) => <T extends Constructor<CommandHandler<CommandType>>>(target: T) => {
    const commandName = typeof command === 'object' ? command.name : command;

    commandHandlerMetadataStore.set(commandName, {
      type: 'class',
      name: target.name,
      handler: target,
      targetName: commandName,
    });

    return target;
  },
};
