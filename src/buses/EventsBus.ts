import { Event, EventsBusInterface, EventSubscriber } from '../typings';
import { callSubscribers } from '../callers/callSubscribers';
import { EventHandlersMap } from '../typings/core';
import { getName } from '../utils/getName';
import { MaybePromise } from '../typings/common';

export class EventsBus implements EventsBusInterface {
  constructor(
    private readonly subscribers: EventSubscriber<object>[],
    private readonly eventHandlers: EventHandlersMap
  ) {}

  async dispatch<EventType extends Event = Event>(
    event: EventType
  ): Promise<void> {
    const promises: MaybePromise<void>[] = [
      ...this.subscribers.map((subscriber) =>
        callSubscribers(event, subscriber)
      ),
    ];

    const handlers = this.eventHandlers[getName(event)];

    if (handlers?.length) {
      promises.push(...handlers.map((handler) => handler(event)));
    }

    await Promise.all(promises);
  }
}
