import { Constructor, MaybePromise } from './common';

export interface Event<Payload = any, Name extends string = string> {
  // Name is only required if event is an "plain" object
  name?: Name;
  payload: Payload;
}

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
