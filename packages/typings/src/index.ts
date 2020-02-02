export interface Command<Payload = any, Type extends string = string> {
  type: Type;
  payload: Payload;
}

export interface Event<Payload = any, Name extends string = string> {
  event: Name;
  payload: Payload;
}

export type CommandContext<Context = any> = Context & {
  eventsBus: EventsBus;
};

export type EventContext<Context = any> = Context & {
  commandsBus: CommandsBus;
};

export interface EventsBus<Context = any> {
  dispatch: <EventType extends Event = Event>(
    event: EventType
  ) => void | Promise<void>;
  setCommandsBus: (bus: CommandsBus) => void;
}

export interface CommandsBus<Context = any> {
  execute: <CommandType extends Command = Command, ReturnValue = any>(
    command: CommandType
  ) => ReturnValue | Promise<ReturnValue>;
  setEventsBus: (bus: EventsBus) => void;
}

export type CommandHandlersStore = Map<string, CommandHandler<any>>;
export type EventHandlersStore = Map<string, Array<EventHandler<any>>>;

export type CommandHandler<
  CommandType extends Command = Command,
  Context = any,
  ReturnValue = any
> = (context: CommandContext<Context>) => (command: CommandType) => ReturnValue;

export type EventHandler<EventType extends Event = Event, Context = any> = (
  context: EventContext<Context>
) => (event: Event) => void | Promise<void>;
