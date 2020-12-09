import { CommandsBusInterface } from './command';
import { QueriesBusInterface } from './query';
import { EventsBusInterface } from './event';

export interface Buses {
  commandsBus: CommandsBusInterface;
  queriesBus: QueriesBusInterface;
  eventsBus: EventsBusInterface;
}
