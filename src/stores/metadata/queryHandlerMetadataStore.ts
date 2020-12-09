import { HandlerMetadata } from './types';
import { QueryHandler, QueryHandlerFn } from '../../typings';
import { Constructor } from '../../typings/common';
import { getHandlerByHandlersArray } from './helpers/getSingularHandlersByHandler';

export type QueryHandlerMetadataItem = HandlerMetadata<
  QueryHandlerFn<any> | Constructor<QueryHandler<any>>
>;

export type QueryHandlerMetadataStore = Map<string, QueryHandlerMetadataItem>;

export const queryHandlerMetadataStore = new Map<
  string,
  QueryHandlerMetadataItem
>();

export const getQueryHandlersByHandlers = getHandlerByHandlersArray(
  queryHandlerMetadataStore
);
