export interface Command<Payload = any> {
  type: string;
  payload: Payload;
}

export type CommandHandler<CommandType extends Command, ReturnValue = any> = (
  command: CommandType
) => ReturnValue;
