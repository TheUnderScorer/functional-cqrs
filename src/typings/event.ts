import { CommandsBus } from './command';
import { QueriesBus } from './query';

export interface Event<Name extends string = string, Payload = any> {
  event: Name;
  payload: Payload;
}

export type EventSubscriberMethod = (event: Event) => Promise<void>;

export interface EventSubscriberInterface {
  [key: string]: EventSubscriberMethod;
}

export interface EventSubscriberConstructor<Context> {
  new (context: Context): EventSubscriberInterface;
}

export type EventContext<Context = any> = Context & {
  commandsBus: CommandsBus;
  queriesBus: QueriesBus;
};

export interface EventsBus<Context = any> {
  dispatch: <EventType extends Event = Event>(
    event: EventType
  ) => void | Promise<void>;
}

export type EventHandlersStore = Map<string, Array<EventHandler<any>>>;

export type EventHandlerFunction<
  EventType extends Event = Event,
  Context = any
> = (
  context: EventContext<Context>
) => (event: EventType) => void | Promise<void>;

export type EventHandler<EventType extends Event = Event, Context = any> =
  | EventHandlerFunction<EventType, Context>
  | EventSubscriberInterface;
