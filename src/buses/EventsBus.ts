import {
  CommandsBusInterface,
  Event,
  EventsBusInterface,
  QueriesBusInterface,
} from '../typings';
import {
  EventHandlerDefinition,
  EventHandlerMetadataStore,
} from '../stores/metadata/eventHandlerMetadataStore';
import { storeToArray } from '../utils';
import { ContextManager } from '../context/ContextManager';
import { EventHandlerCaller } from '../callers/EventHandlerCaller';
import { getObjName } from '../utils/getObjName';

export interface PrivateEventsBus<Context> extends EventsBusInterface<Context> {
  setCommandsBus: (bus: CommandsBusInterface) => void;
  setQueriesBus: (bus: QueriesBusInterface) => void;
  setContext: (context: Context) => void;
  loadClasses: () => void;
}

export class EventsBus<Context> implements EventsBusInterface<Context> {
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
    const name = getObjName(event);
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
