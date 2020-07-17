export * from './event';
export * from './query';
export * from './command';

export interface Module {
  [key: string]: any;
  default: any;
}
