import { Constructor } from '../../typings/common';
import { EventHandlerFn } from '../../typings';
import { BaseHandlerMetadata } from './types';
import { storeToArray } from '../../utils';

export interface EventHandlerDefinition {
  method: string;
  eventName: string;
}

export interface EventHandlerMetadataItem<T> extends BaseHandlerMetadata {
  handler: Constructor<T> | EventHandlerFn<any>;
  name: string;
  type: 'function' | 'class';
  eventName?: string;
  handlers?: EventHandlerDefinition[];
}

export type EventHandlerMetadataStore = Set<EventHandlerMetadataItem<any>>;

export const eventHandlerMetadataStore = new Set<
  EventHandlerMetadataItem<any>
>();

export const getEventHandlersByHandlers = (
  eventHandlers: Array<Constructor | EventHandlerFn>
) => {
  const filtered = storeToArray(eventHandlerMetadataStore).filter((item) =>
    eventHandlers.includes(item.handler)
  );

  return filtered.reduce((newStore, value) => {
    newStore.add(value);

    return newStore;
  }, new Set<EventHandlerMetadataItem<any>>());
};
