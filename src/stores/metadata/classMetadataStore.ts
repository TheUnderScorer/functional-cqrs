import { Constructor } from '../../typings/common';

export interface ClassMetadataStoreItem<T> {
  kind: ClassMetadataKinds;
  constructor: Constructor<T>;
  name: string;
}

export enum ClassMetadataKinds {
  EventSubscriber = 'EventSubscriber',
}

export const classMetadataStore = new Map<
  string,
  ClassMetadataStoreItem<any>
>();

export const getByKind = (kind: ClassMetadataKinds) =>
  Array.from(classMetadataStore.values()).filter((item) => item.kind === kind);
