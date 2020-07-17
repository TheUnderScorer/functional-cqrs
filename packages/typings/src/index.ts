export * from './event';
export * from './query';
export * from './command';
export * from './checkers/is-event-subscriber';

export interface Module {
  [key: string]: any;
  default: any;
}
