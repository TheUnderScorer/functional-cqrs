export interface HandlerInstruction<
  Type extends string = string,
  Payload = any
> {
  name: Type;
  payload: Payload;
}

export interface Handler<
  Instruction extends HandlerInstruction = HandlerInstruction
> {
  handle(instruction: Instruction): any | Promise<any>;
}
