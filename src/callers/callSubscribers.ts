import { Event, EventSubscriber } from '../typings';
import { getName } from '../utils/getName';
import { Constructor } from '../typings/common';

export const callSubscribers = async <EventType extends Event = Event>(
  event: EventType,
  subscriber: EventSubscriber<object>
) => {
  const eventName = getName(event);

  const eventDefinitions = subscriber.getSubscribedEvents() as Record<
    string,
    Constructor<Event>[]
  >;
  const methods = Object.entries(eventDefinitions)
    .filter(([, events]) =>
      events.find((targetEvent) => getName(targetEvent) === eventName)
    )
    .map(([method]) => method);

  await methods.map((method) =>
    (subscriber as Record<string, any>)[method](event)
  );
};
