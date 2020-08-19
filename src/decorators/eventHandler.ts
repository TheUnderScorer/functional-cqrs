import { Event, EventHandlerFn } from '../typings';
import { eventHandlerMetadataStore } from '../stores/metadata/eventHandlerMetadataStore';
import { Constructor } from '../typings/common';

export interface EventHandlerAsClassParams {
  handlers: Array<{
    method: string;
    eventName: string;
  }>;
}

export const eventHandler = {
  /**
   * Registers new event handler as function
   *
   * TODO Add example
   * */
  asFunction: <EventType extends Event = Event, Context = any>(
    eventName: EventType['name'],
    fn: EventHandlerFn<EventType, Context>
  ) => {
    eventHandlerMetadataStore.add({
      handler: fn,
      eventName,
      name: fn.name ?? Date.now().toString(),
      type: 'function',
    });

    return fn;
  },

  /**
   * Registers new event handler as class
   *
   * TODO Add example
   * */
  asClass: ({ handlers }: EventHandlerAsClassParams) => <T>(
    target: Constructor<T>
  ) => {
    eventHandlerMetadataStore.add({
      handler: target,
      name: target.name,
      type: 'class',
      handlers,
    });

    return target;
  },
};
