import { Constructor, MaybePromise } from './common';
import { CommandLike } from './handler';

export type Event<Payload = any, Name extends string = string> = CommandLike<
  Payload,
  Name
>;

export interface EventSubscriber<T = any> {
  getSubscribedEvents(): EventHandlerDefinitions<T>;
}

export type EventHandlerFn<EventType extends Event = Event> = (
  event: Readonly<EventType>
) => MaybePromise<void>;

export type EventHandlerDefinitions<T> = {
  [Key in keyof T]?: T[Key] extends (param: infer Param) => unknown
    ? Param extends Event
      ? Constructor<Param>[]
      : never
    : never;
};

export interface EventsBusInterface {
  dispatch: <EventType extends Event = Event>(
    event: EventType
  ) => MaybePromise<void>;
}
