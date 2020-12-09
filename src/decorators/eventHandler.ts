import { Event, EventHandlerFn } from '../typings';
import { eventHandlerMetadataStore } from '../stores/metadata/eventHandlerMetadataStore';
import { Constructor } from '../typings/common';
import { HandlerType } from '../stores/metadata/types';
import { getName } from '../utils/getName';

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
   * @see EventHandlerFn
   * */
  asFunction: <EventType extends Event = Event, Context = any>(
    eventName: EventType['name'],
    fn: EventHandlerFn<EventType, Context>
  ) => {
    eventHandlerMetadataStore.add({
      handler: fn,
      eventName,
      name: fn.name ?? Date.now().toString(),
      type: HandlerType.Function,
    });

    return fn;
  },

  /**
   * Registers new event handler as class
   *
   * @example ```
   * \@eventHandler.asClass({
   *   handlers: [
   *     {
   *       method: "onBar",
   *       event: "BarEvent"
   *     }
   *   ]
   * })
   * export class FooSubscriber {
   *
   *    onBar(event: BarEvent) {
   *      console.log(event);
   *    }
   *
   * }
   * ```
   * */
  asClass: ({ handlers }: EventHandlerAsClassParams) => <T>(
    target: Constructor<T>
  ) => {
    eventHandlerMetadataStore.add({
      handler: target,
      name: getName(target),
      type: HandlerType.Class,
      handlers,
    });

    return target;
  },
};
