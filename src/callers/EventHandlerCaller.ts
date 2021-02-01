import { ContextManager } from '../context/ContextManager';
import { Event, EventHandlerFn } from '../typings';
import { EventHandlerMetadataItem } from '../stores/metadata/eventHandlerMetadataStore';
import { Constructor } from '../typings/common';
import { HandlerType } from '../stores/metadata/types';
import { getName } from '../utils/getName';

export class EventHandlerCaller<Context> {
  constructor(private readonly contextManager: ContextManager<Context>) {}

  async call<EventType extends Event = Event>(
    event: EventType,
    meta: EventHandlerMetadataItem<any>
  ) {
    const name = getName(event);

    if (meta.type === HandlerType.Function) {
      await (meta.handler as EventHandlerFn<EventType, Context>)({
        event,
        context: this.contextManager.getEventContext(),
      });

      return;
    }

    const filteredDefinitions = meta.handlers!.filter(
      (definition) => getName(definition.eventName) === name
    );

    if (!filteredDefinitions.length) {
      return;
    }

    const Handler = meta.handler as Constructor<any>;
    const classToCall = new Handler(this.contextManager.getEventContext());

    await Promise.all(
      filteredDefinitions.map((definition) => {
        if (!classToCall[definition.method]) {
          throw new Error(
            `Class ${meta.name} does not have method "${definition.method}"`
          );
        }

        return classToCall[definition.method](event);
      })
    );
  }
}
