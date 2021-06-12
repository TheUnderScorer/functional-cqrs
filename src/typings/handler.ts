import { MaybePromise } from './common';

export interface CommandLike<Payload = any, Type extends string = string> {
  // Name only is required if it's a "plain" object
  name?: Type;
  payload: Payload;
}

export interface ClassHandler<
  TCommand extends CommandLike = CommandLike,
  ReturnValue = unknown
> {
  handle(instruction: Readonly<TCommand>): MaybePromise<ReturnValue>;
}

export type HandlerFn<
  TCommand extends CommandLike = CommandLike,
  ReturnType = unknown
> = (instruction: Readonly<TCommand>) => MaybePromise<ReturnType>;

export type Handler<TCommand extends CommandLike, ReturnType = unknown> =
  | HandlerFn<TCommand, ReturnType>
  | ClassHandler<TCommand>;

export const isClassHandler = <T extends CommandLike>(
  value: unknown
): value is ClassHandler<T> =>
  value &&
  typeof value === 'object' &&
  typeof (value as Record<string, unknown>).handle === 'function';
