// eslint-disable-next-line max-classes-per-file
import { createCqrs } from './cqrs';
import {
  Command,
  CommandHandler,
  Event,
  EventSubscriber,
  Query,
  QueryHandler,
} from '../typings';
import { Buses } from '../typings/buses';

class TestCommand implements Command {
  name = 'TestCommand' as const;

  constructor(readonly payload: boolean) {}
}

class SecondTestCommand implements Command {
  name = 'SecondTestCommand' as const;

  constructor(readonly payload: boolean) {}
}

class TestQuery implements Query {
  name = 'TestQuery' as const;

  constructor(readonly payload: string) {}
}

class TestEvent implements Event<number> {
  name = 'TestEvent' as const;

  constructor(readonly payload: number) {}
}

describe('Functional cqrs', () => {
  it('should create cqrs', async () => {
    const cqrs = await createCqrs({});

    expect(cqrs).toMatchInlineSnapshot(`
      Object {
        "buses": Object {
          "commandsBus": CommandsBus {
            "store": Object {},
          },
          "eventsBus": EventsBus {
            "eventHandlers": Object {},
            "subscribers": Array [],
          },
          "queriesBus": QueriesBus {
            "store": Object {},
          },
        },
      }
    `);
  });

  it('should run command via function', async () => {
    const handler = jest.fn(() => true);

    const cqrs = await createCqrs({
      commandHandlers: {
        TestCommand: handler,
      },
    });

    const command = new TestCommand(true);

    cqrs.buses.commandsBus.execute(command);

    expect(handler).toHaveBeenCalledWith(command);
  });

  it('should run command via class', async () => {
    const handler = jest.fn((command: TestCommand) => command.payload);

    class Handler implements CommandHandler<TestCommand> {
      handle(command: Readonly<TestCommand>) {
        return handler(command);
      }
    }

    const cqrs = createCqrs({
      commandHandlers: {
        TestCommand: new Handler(),
      },
    });

    const command = new TestCommand(true);

    cqrs.buses.commandsBus.execute(command);

    expect(handler).toHaveBeenCalledWith(command);
  });

  it('should run query via function', async () => {
    const handler = jest.fn();

    const cqrs = createCqrs({
      queryHandlers: {
        [TestQuery.name]: handler,
      },
    });

    const query = new TestQuery('test');

    await cqrs.buses.queriesBus.query(query);

    expect(handler).toHaveBeenCalledWith(query);
  });

  it('should run query via class', async () => {
    const handler = jest.fn();

    class Handler implements QueryHandler<TestQuery> {
      handle(query: Readonly<TestQuery>) {
        return handler(query);
      }
    }

    const cqrs = await createCqrs({
      queryHandlers: {
        TestQuery: new Handler(),
      },
    });

    const command = new TestQuery('test');

    await cqrs.buses.queriesBus.query(command);

    expect(handler).toHaveBeenCalledWith(command);
  });

  it('should run event via function', async () => {
    const handler = jest.fn();

    const cqrs = await createCqrs({
      eventHandlers: {
        [TestEvent.name]: [handler],
      },
    });

    const event = new TestEvent(1);

    await cqrs.buses.eventsBus.dispatch(event);

    expect(handler).toHaveBeenCalledWith(event);
  });

  it('should run event via class subscriber', async () => {
    const handler = jest.fn();

    class Subscriber implements EventSubscriber<Subscriber> {
      getSubscribedEvents() {
        return {
          onEvent: [TestEvent],
        };
      }

      async onEvent(event: TestEvent) {
        handler(event);
      }
    }

    const cqrs = createCqrs({
      subscribers: [new Subscriber()],
    });

    const event = new TestEvent(1);

    await cqrs.buses.eventsBus.dispatch(event);

    expect(handler).toHaveBeenCalledWith(event);
  });

  it('should run command and dispatch event', async () => {
    let buses: Buses<any, any>;

    const testEvent = new TestEvent(1);

    const commandHandler = jest.fn(() => {
      buses.eventsBus.dispatch(testEvent);
    });

    const secondCommandHandler = jest.fn();
    const secondTestCommand = new SecondTestCommand(false);

    const eventHandler = jest.fn(() => {
      buses.commandsBus.execute(secondTestCommand);
    });

    const cqrs = await createCqrs({
      commandHandlers: {
        [TestCommand.name]: commandHandler,
        [SecondTestCommand.name]: secondCommandHandler,
      },
      eventHandlers: {
        [TestEvent.name]: [eventHandler],
      },
    });

    buses = cqrs.buses;

    const command = new TestCommand(true);

    await buses.commandsBus.execute(command);

    expect(commandHandler).toHaveBeenCalledWith(command);
    expect(eventHandler).toHaveBeenCalledWith(testEvent);
    expect(secondCommandHandler).toHaveBeenCalledWith(secondTestCommand);
  });
});
