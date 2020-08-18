import { Stores } from './cqrs';
import {
  ClassMetadataKinds,
  getByKind,
} from '../stores/metadata/classMetadataStore';
import {
  getByConstructorAndKind,
  MethodMetadataKind,
} from '../stores/metadata/methodMetadataStore';
import { Event, EventSubscriberMethod } from '../typings';
import { eventHandler } from '../decorators';

export interface LoadFromMetadataParams<Context> {
  stores: Stores;
  context: Context;
}

export const loadFromMetadata = <Context>({
  stores,
  context,
}: LoadFromMetadataParams<Context>) => {
  const eventsSubscribers = getByKind(ClassMetadataKinds.EventSubscriber);
  const createdEventSubscribers = eventsSubscribers.map(
    ({ constructor, ...rest }) => ({
      ...rest,
      constructor,
      instance: new constructor(context),
    })
  );

  createdEventSubscribers.forEach(({ instance, constructor }) => {
    const methods = getByConstructorAndKind(
      constructor,
      MethodMetadataKind.EventSubscriber
    );

    if (!methods.length) {
      return;
    }

    methods.forEach(({ key, meta }) => {
      const handlers = stores.eventHandlersStore.get(meta!.eventName) ?? [];

      const boundMethod = (instance as Record<string, EventSubscriberMethod>)[
        key as string
      ].bind(instance);

      const fn = () => (event: Event) => boundMethod(event);
      handlers.push(fn);

      eventHandler(meta!.eventName, fn)(stores.eventHandlersStore);
    });
  });
};
