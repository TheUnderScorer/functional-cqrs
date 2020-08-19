import { Constructor } from '../../typings/common';
import { storeToArray } from '../../utils';

export interface MethodMetadataStoreItem<T> {
  constructor: Constructor<T>;
  key: string | symbol;
  kind: MethodMetadataKind;
  meta?: Record<string, any>;
}

export enum MethodMetadataKind {
  EventSubscriber = 'EventSubscriber',
}

export const methodMetadataStore = new Set<MethodMetadataStoreItem<any>>();

export const getByConstructorAndKind = (
  constructor: Constructor<any>,
  kind: MethodMetadataKind
) => {
  return storeToArray(methodMetadataStore).filter(
    (item) => item.constructor === constructor && item.kind === kind
  );
};
