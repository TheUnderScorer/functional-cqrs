import { SingularHandlerMetadata } from './types';
import { CommandHandler, CommandHandlerFn } from '../../typings';
import { getSingularHandlersByHandlers } from './helpers/getSingularHandlersByHandler';
import { Constructor } from '../../typings/common';

export type CommandHandlerMetadataItem = SingularHandlerMetadata<
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

export const getCommandHandlersByHandlers = getSingularHandlersByHandlers(
  commandHandlerMetadataStore
);
