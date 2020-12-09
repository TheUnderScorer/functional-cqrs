import { CommandsBusInterface } from './command';
import { QueriesBusInterface } from './query';

export interface Event<Name extends string = string, Payload = any> {
  name: Name;
  payload: Payload;
}

export type EventSubscriberMethod = (event: Event) => Promise<void>;

export type EventContext<Context = any> = Context & {
  commandsBus: CommandsBusInterface<Context>;
  queriesBus: QueriesBusInterface<Context>;
};

export interface EventsBusInterface<Context = any> {
  dispatch: <EventType extends Event = Event>(
    event: EventType
  ) => void | Promise<void>;
}

export interface EventHandlerParams<EventType extends Event, Context = any> {
  event: EventType;
  context: Context;
}

export type EventHandlerFn<EventType extends Event = Event, Context = any> = (
  params: EventHandlerParams<EventType, Context>
) => void | Promise<void>;
