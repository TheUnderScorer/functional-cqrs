import { Constructor } from '../../typings/common';
import {
  ClassMetadataKinds,
  classMetadataStore,
} from '../../stores/metadata/classMetadataStore';

export const EventsSubscriber = () => <T>(target: Constructor<T>) => {
  classMetadataStore.set(target.name, {
    name: target.name,
    constructor: target,
    kind: ClassMetadataKinds.EventSubscriber,
  });
};
