import { CommandHandler, CommandHandlersStore } from '@functional-cqrs/typings';

export const commandHandlersStore: CommandHandlersStore = new Map<
  string,
  CommandHandler
>();
