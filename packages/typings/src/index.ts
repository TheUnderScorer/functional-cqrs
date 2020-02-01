export interface Command<Payload = any> {
  type: string;
  payload: Payload;
}

export type CommandHandlersStore = Map<string, CommandHandler<any>>;

export type CommandHandler<
  CommandType extends Command = Command,
  Context = any,
  ReturnValue = any
> = (context: Context) => (command: CommandType) => ReturnValue;
