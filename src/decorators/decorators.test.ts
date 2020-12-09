/* eslint-disable no-unused-vars,@typescript-eslint/no-unused-vars */
// eslint-disable-next-line max-classes-per-file
import {
  Command,
  CommandHandler,
  CommandHandlerFn,
  Event,
  EventHandlerFn,
} from '../typings';
import { eventHandler } from './eventHandler';
import { commandHandler } from './commandHandler';
import { commandHandlerMetadataStore } from '../stores/metadata/commandHandlerMetadataStore';
import { eventHandlerMetadataStore } from '../stores/metadata/eventHandlerMetadataStore';
import { HandlerType } from '../stores/metadata/types';

describe('commandHandler', () => {
  type TestCommand = Command<'TestCommand', boolean>;

  beforeEach(() => {
    commandHandlerMetadataStore.clear();
  });

  it('registers command handler as function', () => {
    const handler: CommandHandlerFn<TestCommand> = ({
      command: { payload },
    }) => {
      return payload;
    };

    commandHandler.asFunction<TestCommand>('TestCommand', handler);

    const savedHandler = commandHandlerMetadataStore.get('TestCommand')!;
    expect(savedHandler.handler).toEqual(handler);
    expect(savedHandler.name).toEqual(handler.name);
    expect(savedHandler.type).toEqual(HandlerType.Function);
  });

  it('should register command handler as class', () => {
    @commandHandler.asClass<TestCommand>('TestCommand')
    // @ts-ignore
    class CommandHandlerClass implements CommandHandler<TestCommand> {
      handle(command: TestCommand) {
        return command.payload;
      }
    }

    const savedHandler = commandHandlerMetadataStore.get('TestCommand')!;
    expect(savedHandler.handler).toEqual(CommandHandlerClass);
    expect(savedHandler.name).toEqual(CommandHandlerClass.name);
    expect(savedHandler.type).toEqual(HandlerType.Class);
  });
});

describe('eventHandler', () => {
  beforeEach(() => {
    eventHandlerMetadataStore.clear();
  });

  type TestEvent = Event<'TestEvent', boolean>;

  it('should register event handler as function', () => {
    const handler: EventHandlerFn<TestEvent> = ({ event: { payload } }) => {
      console.log({ payload });
    };

    eventHandler.asFunction<TestEvent>('TestEvent', handler);

    const handlers = Array.from(eventHandlerMetadataStore.values());
    const [handlerMeta] = handlers;

    expect(handlers).toHaveLength(1);
    expect(handlerMeta.name).toEqual(handler.name);
    expect(handlerMeta.handler).toEqual(handler);
    expect(handlerMeta.eventName).toEqual('TestEvent');
    expect(handlerMeta.type).toEqual(HandlerType.Function);
  });

  it('should register event handler as class', () => {
    @eventHandler.asClass({
      handlers: [
        {
          eventName: 'TestEvent',
          method: 'firstMethod',
        },
        {
          eventName: 'TestEvent',
          method: 'secondMethod',
        },
      ],
    })
    // @ts-ignore
    class EventHandlerClass {
      firstMethod(event: TestEvent) {
        console.log({ event });
      }

      secondMethod(event: TestEvent) {
        console.log({ event });
      }
    }

    const handlers = Array.from(eventHandlerMetadataStore.values());
    const [handlerMeta] = handlers;

    expect(handlers).toHaveLength(1);
    expect(handlerMeta.name).toEqual(EventHandlerClass.name);
    expect(handlerMeta.handler).toEqual(EventHandlerClass);
    expect(handlerMeta.type).toEqual(HandlerType.Class);
    expect(handlerMeta.handlers).toEqual([
      {
        eventName: 'TestEvent',
        method: 'firstMethod',
      },
      {
        eventName: 'TestEvent',
        method: 'secondMethod',
      },
    ]);
  });
});
