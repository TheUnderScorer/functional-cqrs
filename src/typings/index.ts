export * from './event';
export * from './query';
export * from './command';
export * from '../typeGuards/isEventSubscriber';

export interface Module {
  [key: string]: any;
  default: any;
}
