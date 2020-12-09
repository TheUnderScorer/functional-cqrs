import { HandlerMetadata } from '../stores/metadata/types';

export interface ClassLoaderParams<Context> {
  store: Map<string, HandlerMetadata>;
  contextProvider: () => Context;
}
