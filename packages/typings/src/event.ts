import { CommandsBus } from './command';
import { QueriesBus } from './query';

export interface Event<Name extends string = string, Payload = any> {
  event: Name;
  payload: Payload;
}

export type EventSubscriberCreator<
  Context extends EventContext,
  Keys extends string[]
> = (context: Context) => EventSubscriber<Context, Keys>;

export type EventSubscriber<
  Context extends EventContext,
  Keys extends string[] = string[]
> = {
  [Key in Keys[number]]: ReturnType<EventHandlerFunction<Event<Key>, Context>>;
} & {
  readonly eventSubscribers: Keys;
};

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
  | EventSubscriberCreator<Context, string[]>;
