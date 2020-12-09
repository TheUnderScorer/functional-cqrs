import { CommandContext, EventContext, QueryContext } from '../typings';
import { CommandsBus, EventsBus, QueriesBus } from '../buses';

export class ContextManager<Context> {
  private eventsBus!: EventsBus<Context>;

  private queriesBus!: QueriesBus<Context>;

  private commandsBus!: CommandsBus<Context>;

  constructor(private context?: Context) {}

  setContext(context: Context) {
    this.context = context;
  }

  setCommandsBus(commandsBus: CommandsBus<Context>) {
    this.commandsBus = commandsBus;
  }

  setQueriesBus(queriesBus: QueriesBus<Context>) {
    this.queriesBus = queriesBus;
  }

  setEventsBus(eventsBus: EventsBus<Context>) {
    this.eventsBus = eventsBus;
  }

  getCommandsBusContext(): CommandContext<Context> {
    return {
      ...this.context!,
      queriesBus: this.queriesBus,
      eventsBus: this.eventsBus,
    };
  }

  getQueriesBusContext(): QueryContext<Context> {
    return {
      ...this.context!,
      eventsBus: this.eventsBus,
    };
  }

  getEventContext(): EventContext<Context> {
    return {
      ...this.context!,
      commandsBus: this.commandsBus,
      queriesBus: this.queriesBus,
    };
  }
}
