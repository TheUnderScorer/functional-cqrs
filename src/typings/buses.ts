import { CommandsBus } from './command';
import { QueriesBus } from './query';
import { EventsBus } from './event';

export interface Buses {
  commandsBus: CommandsBus;
  queriesBus: QueriesBus;
  eventsBus: EventsBus;
}
