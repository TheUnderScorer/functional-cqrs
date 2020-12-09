export type Maybe<T> = Nullable<T> | undefined;

export type Constructor<T = object> = new (...args: any[]) => T;

export type Nullable<T> = T | null;
