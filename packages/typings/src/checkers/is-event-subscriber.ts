import { EventSubscriber } from '../event';

export const isEventSubscriber = (
  item: any
): item is EventSubscriber<any, any> => {
  return (
    item && typeof item === 'object' && Array.isArray(item.eventSubscribers)
  );
};
