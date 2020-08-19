export interface SingularInstruction<
  Type extends string = string,
  Payload = any
> {
  name: Type;
  payload: Payload;
}

export interface SingularHandler<
  Instruction extends SingularInstruction = SingularInstruction
> {
  handle(instruction: Instruction): any | Promise<any>;
}
