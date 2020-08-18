import { Constructor } from '../../typings/common';

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
  return Array.from(methodMetadataStore.values()).filter(
    (item) => item.constructor === constructor && item.kind === kind
  );
};
