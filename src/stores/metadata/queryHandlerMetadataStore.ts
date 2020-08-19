import { SingularHandlerMetadata } from './types';
import { QueryHandler, QueryHandlerFn } from '../../typings';
import { Constructor } from '../../typings/common';
import { getSingularHandlersByHandlers } from './helpers/getSingularHandlersByHandler';

export type QueryHandlerMetadataItem = SingularHandlerMetadata<
  QueryHandlerFn<any> | Constructor<QueryHandler<any>>
>;

export type QueryHandlerMetadataStore = Map<string, QueryHandlerMetadataItem>;

export const queryHandlerMetadataStore = new Map<
  string,
  QueryHandlerMetadataItem
>();

export const getQueryHandlersByHandlers = getSingularHandlersByHandlers(
  queryHandlerMetadataStore
);
