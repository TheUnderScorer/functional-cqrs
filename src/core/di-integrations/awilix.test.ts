// eslint-disable-next-line max-classes-per-file
import { createContainer, AwilixContainer, asValue, asClass } from 'awilix';
import { Command } from '../../typings';
import { commandHandler } from '../../decorators';
import { createCqrs } from '../cqrs';

interface Context {
  log: (data: any) => any;
}

class TestCommand implements Command {
  constructor(readonly payload: object) {}
}

const testHandler = commandHandler.asFunction<TestCommand, Context>(
  TestCommand,
  ({ context, command }) => {
    return context.log(command.payload);
  }
);

class ScopedClass {
  static instancesCount = 0;

  static disposeFn = jest.fn();

  constructor() {
    ScopedClass.instancesCount += 1;
  }

  dispose() {
    ScopedClass.disposeFn();
  }
}

describe('Awilix integration', () => {
  let container: AwilixContainer;

  beforeEach(() => {
    container = createContainer();
  });

  it('should support awilix container', async () => {
    const payload = {
      test: true,
    };

    const log = jest.fn();

    container.register({
      log: asValue(log),
    });

    const cqrs = await createCqrs({
      context: container.cradle,
      commandHandlers: [testHandler],
    });

    await cqrs.buses.commandsBus.execute(new TestCommand(payload));

    expect(log).toHaveBeenCalledWith(payload);
  });

  it('should support scoped container', async () => {
    const payload = {
      test: true,
    };

    const log = jest.fn().mockImplementation(
      // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
      (context: { scopedClass: ScopedClass }) => (value: any) => value
    );

    container.register({
      log: asValue(log),
      scopedClass: asClass(ScopedClass)
        .scoped()
        .disposer((cls) => cls.dispose()),
    });

    const scopedContainer = container.createScope();

    const cqrs = await createCqrs({
      context: scopedContainer.cradle,
      commandHandlers: [testHandler],
    });

    await cqrs.buses.commandsBus.execute(new TestCommand(payload));
    await cqrs.buses.commandsBus.execute(new TestCommand(payload));

    expect(ScopedClass.instancesCount).toEqual(1);
    expect(log).toHaveBeenCalledWith(payload);

    await scopedContainer.dispose();

    expect(ScopedClass.disposeFn).toHaveBeenCalledTimes(1);

    const secondScopedContainer = container.createScope();

    const secondCqrs = await createCqrs({
      context: secondScopedContainer.cradle,
      commandHandlers: [testHandler],
    });

    await secondCqrs.buses.commandsBus.execute(new TestCommand(payload));
    await secondCqrs.buses.commandsBus.execute(new TestCommand(payload));

    expect(ScopedClass.instancesCount).toEqual(2);
    expect(log).toHaveBeenCalledWith(payload);

    await secondScopedContainer.dispose();

    expect(ScopedClass.disposeFn).toHaveBeenCalledTimes(2);
  });
});
