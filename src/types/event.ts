import { Constructor, MaybePromise } from './common';
import { CommandLike } from './handler';
import { CommandsBusInterface } from './command';
import { BaseBusInterface } from './buses';

export type Event<Payload = any> = Pick<CommandLike<Payload, never>, 'payload'>;

export interface EventSubscriber<T = any> {
  getSubscribedEvents(): EventHandlerDefinitions<T>;
}

export interface EventContext {
  commandsBus: CommandsBusInterface;
}

export type EventHandlerFn<EventType extends Event = Event> = (
  event: Readonly<EventType>,
  context: EventContext
) => MaybePromise<void>;

export type EventHandlerDefinitions<T> = {
  [Key in keyof T]?: T[Key] extends (param: infer Param) => unknown
    ? Param extends Event
      ? Constructor<Param>[]
      : never
    : never;
};

export interface EventsBusInterface extends BaseBusInterface<EventContext> {
  dispatch: <EventType extends Event = Event>(
    event: EventType
  ) => MaybePromise<void>;
}
