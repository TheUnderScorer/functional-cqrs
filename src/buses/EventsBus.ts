import { Event, EventsBusInterface } from '../typings';
import {
  EventHandlerDefinition,
  EventHandlerMetadataStore,
} from '../stores/metadata/eventHandlerMetadataStore';
import { storeToArray } from '../utils';
import { ContextManager } from '../context/ContextManager';
import { EventHandlerCaller } from '../callers/EventHandlerCaller';
import { getName } from '../utils/getName';

export class EventsBus<Context = any> implements EventsBusInterface<Context> {
  private readonly caller: EventHandlerCaller<Context>;

  constructor(
    private readonly store: EventHandlerMetadataStore,
    private readonly contextManager: ContextManager<Context>
  ) {
    this.caller = new EventHandlerCaller<Context>(this.contextManager);
  }

  async dispatch<EventType extends Event = Event>(
    event: EventType
  ): Promise<void> {
    const name = getName(event);
    const handlers = this.getHandlersForEvent(name);

    await Promise.all(
      handlers.map((handler) => this.caller.call(event, handler))
    );
  }

  private getHandlersForEvent(eventName: string) {
    return storeToArray(this.store).filter(
      ({ eventName: handlerEventName, handlers }) => {
        return (
          handlerEventName === eventName ||
          Boolean(
            handlers?.find((entry: EventHandlerDefinition) => entry.eventName)
          )
        );
      }
    );
  }
}
