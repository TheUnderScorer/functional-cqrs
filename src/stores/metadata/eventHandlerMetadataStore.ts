import { Constructor } from '../../typings/common';
import { Event, EventHandlerFn } from '../../typings';
import { BaseHandlerMetadata, HandlerType } from './types';
import { storeToArray } from '../../utils';

export interface EventHandlerDefinition {
  method: string;
  eventName: string | Constructor<Event>;
}

export interface EventHandlerMetadataItem<T> extends BaseHandlerMetadata {
  handler: Constructor<T> | EventHandlerFn<any>;
  name: string;
  type: HandlerType;
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
