import { EventSubscriberInterface } from '../typings';
import {
  ClassMetadataKinds,
  getByKind,
} from '../stores/metadata/classMetadataStore';

export const isEventSubscriber = (
  item: any
): item is EventSubscriberInterface => {
  return getByKind(ClassMetadataKinds.EventSubscriber)
    .map((metadata) => metadata.constructor)
    .includes(item);
};
