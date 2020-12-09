import { HandlerMetadata } from './types';
import { CommandHandler, CommandHandlerFn } from '../../typings';
import { getHandlerByHandlersArray } from './helpers/getSingularHandlersByHandler';
import { Constructor } from '../../typings/common';

export type CommandHandlerMetadataItem = HandlerMetadata<
  CommandHandlerFn<any> | Constructor<CommandHandler<any>>
>;

export type CommandHandlerMetadataStore = Map<
  string,
  CommandHandlerMetadataItem
>;

export const commandHandlerMetadataStore = new Map<
  string,
  CommandHandlerMetadataItem
>();

export const getCommandHandlersByHandlers = getHandlerByHandlersArray(
  commandHandlerMetadataStore
);
