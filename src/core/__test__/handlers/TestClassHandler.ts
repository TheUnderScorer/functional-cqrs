/* eslint-disable max-classes-per-file */
import { Command, CommandContext, CommandHandler } from '../../../typings';
import { TestContext } from './testHandler';
import { TestEvent } from '../eventHandlers/testEventHandler';
import { commandHandler } from '../../../decorators';

export class TestClassCommand implements Command {
  constructor(public readonly payload: boolean) {}
}

@commandHandler.asClass<TestClassCommand>('TestClassCommand')
export class TestClassHandler implements CommandHandler<TestClassCommand> {
  constructor(private readonly context: CommandContext<TestContext>) {}

  async handle(command: TestClassCommand) {
    await this.context.eventsBus.dispatch<TestEvent>(new TestEvent(false));

    return {
      version: this.context.version,
      payload: command.payload,
    };
  }
}
