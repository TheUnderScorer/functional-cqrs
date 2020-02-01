import { Command } from '@functional-cqrs/typings';

export interface TestCommand extends Command<boolean> {
  type: 'TestCommand';
}
