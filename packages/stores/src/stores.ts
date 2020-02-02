import {
  CommandHandler,
  CommandHandlersStore,
  EventHandler,
  EventHandlersStore,
} from '@functional-cqrs/typings';

export const commandHandlersStore: CommandHandlersStore = new Map<
  string,
  CommandHandler
>();

export const eventHandlersStore: EventHandlersStore = new Map<
  string,
  Array<EventHandler<any>>
>();
