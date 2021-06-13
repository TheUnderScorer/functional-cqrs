import { HandlersMap } from './core';

export interface CommandLike<Payload = any, Type extends string = string> {
  name: Type;
  payload: Payload;
}

export type ResolvedHandlerResult<
  Handlers extends HandlersMap,
  Command extends CommandLike
> = Handlers[CommandLikeName<Command>] extends (...args: unknown[]) => infer T
  ? T
  : Handlers[CommandLikeName<Command>] extends ClassHandler<any, infer S>
  ? S
  : never;

export type CommandLikeName<T extends CommandLike> = T['name'];

export interface ClassHandler<
  TCommand extends CommandLike = CommandLike,
  ReturnValue = unknown,
  Context = any
> {
  handle(instruction: Readonly<TCommand>, context: Context): ReturnValue;
}

export type HandlerFn<
  TCommand extends CommandLike = CommandLike,
  ReturnType = unknown,
  Context = any
> = (instruction: Readonly<TCommand>, context: Context) => ReturnType;

export type Handler<TCommand extends CommandLike, ReturnType = unknown> =
  | HandlerFn<TCommand, ReturnType>
  | ClassHandler<TCommand>;

export const isClassHandler = <T extends CommandLike>(
  value: unknown
): value is ClassHandler<T> =>
  Boolean(value) &&
  typeof value === 'object' &&
  typeof (value as Record<string, any>).handle === 'function';
