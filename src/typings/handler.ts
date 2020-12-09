export interface HandlerInstruction<
  Type extends string = string,
  Payload = any
> {
  // Name only is required if it's a "plain" object
  name?: Type;
  payload: Payload;
}

export interface Handler<
  Instruction extends HandlerInstruction = HandlerInstruction
> {
  handle(instruction: Instruction): any | Promise<any>;
}
