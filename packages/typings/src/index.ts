export interface Command<Type extends string = string, Payload = any> {
  type: Type;
  payload: Payload;
}

export interface Event<Name extends string = string, Payload = any> {
  event: Name;
  payload: Payload;
}

export interface Query<Name extends string = string, Payload = any> {
  query: Name;
  payload: Payload;
}

export type CommandContext<Context = any> = Context & {
  eventsBus: EventsBus;
  queriesBus: QueriesBus;
};

export type EventContext<Context = any> = Context & {
  commandsBus: CommandsBus;
  queriesBus: QueriesBus;
};

export type QueryContext<Context = any> = Context & {
  eventsBus: EventsBus;
};

export interface EventsBus<Context = any> {
  dispatch: <EventType extends Event = Event>(
    event: EventType
  ) => void | Promise<void>;
  setCommandsBus: (bus: CommandsBus) => void;
  setQueriesBus: (bus: QueriesBus) => void;
}

export interface CommandsBus<Context = any> {
  execute: <CommandType extends Command = Command, ReturnValue = any>(
    command: CommandType
  ) => ReturnValue | Promise<ReturnValue>;
  setEventsBus: (bus: EventsBus) => void;
  setQueriesBus: (bus: QueriesBus) => void;
}

export interface QueriesBus<Context = any> {
  query: <QueryType extends Query = Query, ReturnValue = any>(
    query: QueryType
  ) => ReturnValue | Promise<ReturnValue>;
  setEventsBus: (bus: EventsBus) => void;
}

export interface Module {
  default: any;
  [key: string]: any;
}

export type CommandHandlersStore = Map<string, CommandHandler<any>>;
export type EventHandlersStore = Map<string, Array<EventHandler<any>>>;
export type QueryHandlersStore = Map<string, QueryHandler<any>>;

export type CommandHandler<
  CommandType extends Command = Command,
  Context = any,
  ReturnValue = any
> = (context: CommandContext<Context>) => (command: CommandType) => ReturnValue;

export type EventHandler<EventType extends Event = Event, Context = any> = (
  context: EventContext<Context>
) => (event: EventType) => void | Promise<void>;

export type QueryHandler<
  QueryType extends Query = Query,
  Context = any,
  ReturnValue = any
> = (
  context: QueryContext<Context>
) => (query: QueryType) => ReturnValue | Promise<ReturnValue>;
