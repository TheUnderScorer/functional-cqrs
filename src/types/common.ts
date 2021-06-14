import { Class } from 'type-fest';

export type Maybe<T> = Nullable<T> | undefined;

export type Constructor<T = object> = Class<T>;

export type Nullable<T> = T | null;

export type MaybePromise<T> = Promise<T> | T;
